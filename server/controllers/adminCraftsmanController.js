import prisma from "../src/prisma.js";

//GET ALL CRAFTSMEN DATA
export const getAllCraftsmen = async (req, res) => {
  try {
    const craftsmen = await prisma.user.findMany({
      where: { role: "CRAFTSMAN" },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        isAccountVerified: true,
        craftsman: {
          select: {
            warningLevel: true,
          },
        },
        role: true,
      },
    });
    res.json(craftsmen);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//CRAFTSMAN APPLICATIONS
export const getCraftsmanApplication = async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      where: { status: "SUBMITTED" },
      select: {
        id: true,
        category: {
          select: { name: true },
        },
        yearsOfExperience: true,
        city: true,
        workingDays: true,
        workingHours: true,
        maxTravelDistance: true,
        scenarioQA: true,
        workBehaviorQA: true,
        status: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(applications);
  } catch (error) {
    console.error("Error finding applications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//APPROVE || REJECT || SUSPEND CRAFTSMAN
export const updateApplicationStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body; // "APPROVED" or "REJECTED"
    if (status === "APPROVED") {
      await prisma.$transaction(async (tx) => {
        const application = await tx.application.findUnique({
          where: { userId },
        });
        if (!application) {
          throw new Error("Application not found");
        }
        if (!application.categoryId) {
          throw new Error("Application has no category");
        }
        const last = await tx.craftsman.findFirst({
          where: {
            categoryId: application.categoryId,
            queueOrder: { not: null },
          },
          orderBy: { queueOrder: "desc" },
          select: { queueOrder: true },
        });

        const nextOrder = (last?.queueOrder ?? 0) + 1;
        await tx.craftsman.update({
          where: { userId },
          data: {
            status: "APPROVED",
            categoryId: application.categoryId,
            queueOrder: nextOrder,
            experience: application.yearsOfExperience,
          },
        });
        await tx.application.update({
          where: { userId },
          data: { status: "APPROVED" },
        });
      });
      return res.json({ message: "Craftsman approved successfully" });
    } else if (status === "REJECTED") {
      await prisma.$transaction(async (tx) => {
        const application = await tx.application.findUnique({
          where: { userId },
        });

        if (!application) {
          throw new Error("Application not found");
        }

        await tx.craftsman.update({
          where: { userId },
          data: { status: "REJECTED" },
        });

        await tx.application.update({
          where: { userId },
          data: { status: "REJECTED" },
        });
      });

      return res.json({ message: "Craftsman rejected successfully" });
    } else if (status === "SUSPENDED") {
      await prisma.craftsman.update({
        where: { userId },
        data: { status: "SUSPENDED" },
      });

      return res.json({ message: "Craftsman suspended successfully" });
    }

    return res.status(400).json({ message: "Invalid status value" });
    //⚠️SEND EMAIL AFTER APPROVAL/REJECTION/SUSPENSION
  } catch (error) {
    console.error(error);
    if (error.message === "Application not found") {
      return res.status(404).json({ message: error.message });
    }

    if (error.message === "Application has no category") {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};
//CRAFTSMAN INVENTORY BY CATEGORY AND AVAILIBILTY
export const getCraftsmenCountByCategory = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        craftsmen: {
          where: { availability: "AVAILABLE" },
          select: { userId: true },
        },
      },
    });
    const result = categories.map((cat) => ({
      categoryId: cat.id,
      category: cat.name,
      count: cat.craftsmen.length,
      craftsmen: cat.craftsmen,
    }));
    res.json(result);
  } catch (error) {
    console.error("Error finding craftsmen:", error);
    res.status(500).json({ message: "Interval server error" });
  }
};

//RESTORE CRAFTSMAN
export const restoreCraftsman = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1- CHECK CRAFTSMAN EXISTS
    const craftsman = await prisma.craftsman.findUnique({
      where: { userId },
    });

    if (!craftsman) {
      return res.status(404).json({ message: "Craftsman not found" });
    }

    // 2- ENSURE HE IS SUSPENDED
    if (craftsman.status !== "SUSPENDED") {
      return res.status(400).json({
        message: "Only suspended craftsmen can be restored",
      });
    }

    // 3- DELETE ALL WARNINGS
    await prisma.warning.deleteMany({
      where: { craftsmanId: userId },
    });

    // 4- RESET CRAFTSMAN
    const updatedCraftsman = await prisma.craftsman.update({
      where: { userId },
      data: {
        status: "APPROVED",
        warningLevel: "NONE",
      },
    });

    return res.json({
      message: "Craftsman restored successfully",
      craftsman: updatedCraftsman,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

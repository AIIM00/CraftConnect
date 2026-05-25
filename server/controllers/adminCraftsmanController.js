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
        role: true,
        craftsman: {
          select: {
            userId: true,
            status: true,
            warningLevel: true,
            isAvailable: true,
            experience: true,
            queueOrder: true,
            category: {
              select: {
                id: true,
                name: true,
              },
            },
            service: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
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
        categoryId: true,
        serviceId: true,
        customCategory: true,
        customService: true,
        category: {
          select: { name: true },
        },
        service: {
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
        createdAt: true,
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
    const { status } = req.body;

    if (!["APPROVED", "REJECTED", "SUSPENDED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const application = await prisma.application.findUnique({
      where: { userId },
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (status === "APPROVED" && !application.categoryId) {
      return res.status(400).json({ message: "Application has no category" });
    }

    await prisma.$transaction(async (tx) => {
      if (status === "APPROVED") {
        const last = await tx.craftsman.findFirst({
          where: {
            categoryId: application.categoryId,
            serviceId: application.serviceId,
            queueOrder: { not: null },
          },
          orderBy: { queueOrder: "desc" },
          select: { queueOrder: true },
        });

        const nextOrder = (last?.queueOrder ?? 0) + 1;

        await tx.user.update({
          where: { id: userId },
          data: {
            role: "CRAFTSMAN",
          },
        });

        await tx.craftsman.upsert({
          where: { userId },
          create: {
            userId,
            status: "APPROVED",
            categoryId: application.categoryId,
            serviceId: application.serviceId,
            queueOrder: nextOrder,
            experience: application.yearsOfExperience,
          },
          update: {
            status: "APPROVED",
            categoryId: application.categoryId,
            serviceId: application.serviceId,
            queueOrder: nextOrder,
            experience: application.yearsOfExperience,
          },
        });

        await tx.application.update({
          where: { userId },
          data: { status: "APPROVED" },
        });
      }

      if (status === "REJECTED") {
        await tx.craftsman.upsert({
          where: { userId },
          create: {
            userId,
            status: "REJECTED",
          },
          update: {
            status: "REJECTED",
          },
        });

        await tx.application.update({
          where: { userId },
          data: { status: "REJECTED" },
        });
      }

      if (status === "SUSPENDED") {
        await tx.craftsman.update({
          where: { userId },
          data: { status: "SUSPENDED" },
        });
      }
    });

    return res.json({
      success: true,
      message: `Craftsman ${status.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.error("Update application status error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
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
          where: { isAvailable: true, status: "APPROVED" },
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

export const addCustomCategoryServiceForApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { categoryName, serviceName } = req.body;

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        category: true,
        service: true,
      },
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const finalCategoryName = categoryName?.trim();

    const finalServiceName = serviceName?.trim();

    if (!finalCategoryName || !finalServiceName) {
      return res.status(400).json({
        message: "Category and service are required",
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const category = await tx.category.upsert({
        where: {
          name: finalCategoryName,
        },
        update: {},
        create: {
          name: finalCategoryName,
        },
      });

      const service = await tx.service.upsert({
        where: {
          name_categoryId: {
            name: finalServiceName,
            categoryId: category.id,
          },
        },
        update: {},
        create: {
          name: finalServiceName,
          categoryId: category.id,
        },
      });

      const updatedApplication = await tx.application.update({
        where: {
          id: applicationId,
        },
        data: {
          categoryId: category.id,
          serviceId: service.id,
          customCategory: null,
          customService: null,
        },
        include: {
          category: true,
          service: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
      });

      return updatedApplication;
    });

    return res.json({
      success: true,
      message: "Category and service added to application",
      application: result,
    });
  } catch (error) {
    console.error("Add custom category/service error:", error);
    return res.status(500).json({ message: error.message });
  }
};

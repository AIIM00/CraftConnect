import prisma from "../src/prisma.js";

//GET IN PROGRESS TASKS
export const inProgressTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { status: "IN_PROGRESS" },
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        status: true,
        createdAt: true,
        scheduledDate: true,

        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
          },
        },

        craftsman: {
          select: {
            userId: true,
            status: true,
            warningLevel: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
        },

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
    });
    res.json(tasks);
  } catch (error) {
    console.error("Error finding in progress tasks:", error);
    res.status(500).json({ message: "Interval message error." });
  }
};

//GET CUSTOMERS REVIEWS
//GET CUSTOMERS REVIEWS
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      select: {
        id: true,
        rating: true,

        qualityRating: true,
        punctualityRating: true,
        communicationRating: true,
        professionalismRating: true,
        cleanlinessRating: true,
        priceFairnessRating: true,
        detailedAverage: true,

        wouldRecommend: true,
        wouldHireAgain: true,
        issueTags: true,

        comment: true,
        createdAt: true,

        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
          },
        },

        craftsman: {
          select: {
            userId: true,
            status: true,
            warningLevel: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
              },
            },
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

        task: {
          select: {
            id: true,
            title: true,
            description: true,
            location: true,
            status: true,
            scheduledDate: true,
            completedAt: true,

            warnings: {
              select: {
                id: true,
                message: true,
                createdAt: true,
                isRead: true,
                admin: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        },
      },
      orderBy: [
        {
          detailedAverage: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    return res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateWarningLevel = async (craftsmanId) => {
  // 1️⃣ LAST 10 COMPLETED TASKS
  const lastTasks = await prisma.taskCompletion.findMany({
    where: { craftsmanId },
    orderBy: { completedAt: "desc" },
    take: 10,
    select: { taskId: true },
  });

  const taskIds = lastTasks.map((t) => t.taskId);

  // 2️⃣ COUNT WARNINGS IN THOSE TASKS
  const warningsCount = await prisma.warning.count({
    where: {
      craftsmanId,
      taskId: { in: taskIds },
    },
  });

  // 3️⃣ DETERMINE LEVEL
  let level = "NONE";
  if (warningsCount === 1) level = "LOW";
  else if (warningsCount === 2) level = "MEDIUM";
  else if (warningsCount >= 3) level = "HIGH";

  // UPDATE WARNING LEVEL
  await prisma.craftsman.update({
    where: { userId: craftsmanId },
    data: { warningLevel: level },
  });

  return {
    warningsCount,
    level,
    lastTasksCount: lastTasks.length,
  };
};
//CREATE WARNINGS

//CREATE WARNINGS
export const createWarning = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { message, taskId } = req.body;
    const { craftsmanId } = req.params;

    if (!craftsmanId || !message || !taskId) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const craftsman = await prisma.craftsman.findUnique({
      where: { userId: craftsmanId },
      select: {
        userId: true,
        status: true,
      },
    });

    if (!craftsman) {
      return res.status(404).json({ message: "Craftsman not found" });
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: {
        id: true,
        craftsmanId: true,
        status: true,
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.craftsmanId !== craftsmanId) {
      return res.status(400).json({
        message: "This task does not belong to this craftsman",
      });
    }

    const warning = await prisma.warning.create({
      data: {
        message: message.trim(),
        craftsmanId,
        adminId,
        taskId,
      },
    });

    const stats = await updateWarningLevel(craftsmanId);

    return res.status(201).json({
      message: "Warning sent successfully",
      warning,
      warningLevel: stats.level,
      warningCount: stats.warningsCount,
    });
  } catch (err) {
    console.error("Create warning error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

//REMOVE WARNING

export const removeWarning = async (req, res) => {
  try {
    const { warningId } = req.params;

    const warning = await prisma.warning.findUnique({
      where: { id: warningId },
    });

    if (!warning) {
      return res.status(404).json({ message: "Warning not found" });
    }

    const craftsmanId = warning.craftsmanId;

    // DELETE WARNING
    await prisma.warning.delete({
      where: { id: warningId },
    });

    // UPDATE WARNING LEVEL AFTER DELETION
    const stats = await updateWarningLevel(craftsmanId);

    return res.json({
      message: "Warning removed successfully",
      warningLevel: stats.level,
      warningsCount: stats.warningsCount,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getFlaggedCraftsmen = async (req, res) => {
  try {
    const craftsmen = await prisma.craftsman.findMany({
      select: {
        userId: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    const result = [];
    for (let c of craftsmen) {
      const stats = await updateWarningLevel(c.userId);

      if (stats.warningsCount >= 3) {
        result.push({
          craftsmanId: c.userId,
          name: c.user.name,
          email: c.user.email,
          warningsCount: stats.warningsCount,
          level: stats.level,
          message: `This craftsman reached ${stats.warningsCount} warnings in last 10 tasks`,
          action: "REMOVE or KEEP",
        });
      }
    }

    if (result.length === 0) {
      return res.json({ message: "There is not any flagged craftsman." });
    }

    return res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeCraftsman = async (req, res) => {
  const { craftsmanId } = req.params;

  await prisma.craftsman.update({
    where: { userId: craftsmanId },
    data: {
      status: "SUSPENDED", // BANNED
    },
  });

  res.json({ message: "Craftsman removed" });
};

import prisma from "../src/prisma.js";
import { assignNextCraftsman } from "../services/taskAssignmentService.js";

export const saveApplicationStep = async (req, res) => {
  const userId = req.user.id;
  const { step, data } = req.body;

  try {
    let application = await prisma.application.findFirst({
      where: { userId, status: "DRAFT" },
    });

    if (!application) {
      application = await prisma.application.create({
        data: {
          userId,
          status: "DRAFT",
          step,
          ...data,
        },
      });
    } else {
      application = await prisma.application.update({
        where: { id: application.id },
        data: {
          step,
          ...data,
        },
      });
    }

    res.json({ message: "Step saved", application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitApplication = async (req, res) => {
  const userId = req.user.id;

  try {
    const application = await prisma.application.findFirst({
      where: { userId, status: "DRAFT" },
    });

    if (!application) {
      return res.status(400).json({ message: "No draft found" });
    }

    const updated = await prisma.application.update({
      where: { id: application.id },
      data: {
        status: "SUBMITTED",
        step: 4,
      },
    });

    res.json({
      message: "Application submitted successfully",
      application: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const dashboard = async (req, res) => {
  try {
    res.json({
      message: "Craftsman dashboard - Welcome to craftsman dashboard",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const craftsmanId = req.user.id;

    const [assignedTasks, inProgressTasks, completedTasks] = await Promise.all([
      prisma.taskAssignment.findMany({
        where: {
          craftsmanId,
          status: "PENDING",
        },
        include: {
          task: {
            include: {
              category: true,
              service: true,
              customer: {
                select: {
                  name: true,
                  email: true,
                  phoneNumber: true,
                },
              },
            },
          },
        },
        orderBy: {
          assignedAt: "desc",
        },
      }),

      prisma.task.findMany({
        where: {
          craftsmanId,
          status: "IN_PROGRESS",
        },
        include: {
          category: true,
          service: true,
          customer: {
            select: {
              name: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.task.findMany({
        where: {
          craftsmanId,
          status: "COMPLETED",
        },
        include: {
          category: true,
          service: true,
          customer: {
            select: {
              name: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    const pending = assignedTasks.map((assignment) => ({
      assignmentId: assignment.id,
      taskId: assignment.task.id,
      status: "PENDING",
      title: assignment.task.title,
      description: assignment.task.description,
      location: assignment.task.location,
      category: assignment.task.category,
      service: assignment.task.service,
      customer: assignment.task.customer,
      assignedAt: assignment.assignedAt,
    }));

    const inProgress = inProgressTasks.map((task) => ({
      taskId: task.id,
      status: task.status,
      title: task.title,
      description: task.description,
      location: task.location,
      category: task.category,
      service: task.service,
      customer: task.customer,
      createdAt: task.createdAt,
    }));

    const completed = completedTasks.map((task) => ({
      taskId: task.id,
      status: task.status,
      title: task.title,
      description: task.description,
      location: task.location,
      category: task.category,
      service: task.service,
      customer: task.customer,
      createdAt: task.createdAt,
    }));

    const allTasks = [...pending, ...inProgress, ...completed];

    return res.json({
      success: true,
      counts: {
        all: allTasks.length,
        pending: pending.length,
        inProgress: inProgress.length,
        completed: completed.length,
      },
      tasks: {
        all: allTasks,
        pending,
        inProgress,
        completed,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const assignRejectTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const craftsmanId = req.user.id;
    const { action } = req.body;

    const assignment = await prisma.taskAssignment.findUnique({
      where: {
        taskId_craftsmanId: {
          taskId,
          craftsmanId,
        },
      },
    });

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (assignment.status !== "PENDING") {
      return res.status(400).json({ message: "Already responded" });
    }

    if (action === "ACCEPT") {
      await prisma.$transaction(async (tx) => {
        const task = await tx.task.findUnique({
          where: { id: taskId },
        });

        if (!task) {
          throw new Error("Task not found");
        }

        if (task.status === "IN_PROGRESS" && task.craftsmanId !== craftsmanId) {
          throw new Error("Task already accepted by another craftsman");
        }

        if (task.craftsmanId && task.craftsmanId !== craftsmanId) {
          throw new Error("Task already assigned");
        }

        await tx.task.update({
          where: { id: taskId },
          data: {
            status: "IN_PROGRESS",
            craftsmanId,
          },
        });

        await tx.taskAssignment.update({
          where: {
            taskId_craftsmanId: {
              taskId,
              craftsmanId,
            },
          },
          data: {
            status: "ACCEPTED",
            respondedAt: new Date(),
          },
        });
      });

      return res.json({ message: "Task accepted" });
    }

    if (action === "REJECT") {
      await prisma.taskAssignment.update({
        where: {
          taskId_craftsmanId: {
            taskId,
            craftsmanId,
          },
        },
        data: {
          status: "DECLINED",
          respondedAt: new Date(),
        },
      });

      try {
        const nextAssignment = await assignNextCraftsman(taskId);

        return res.json({
          message: "Task rejected and reassigned",
          nextAssignment,
        });
      } catch (err) {
        return res.json({
          message: "Task rejected, but no more available craftsmen to assign",
        });
      }
    }

    res.status(400).json({ message: "Invalid action" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const craftsmanId = req.user.id;
    const { name, email, phoneNumber, experience } = req.body;

    const updated = await prisma.user.update({
      where: { id: craftsmanId },
      data: {
        name,
        email,
        phoneNumber,
      },
    });

    await prisma.craftsman.update({
      where: { userId: craftsmanId },
      data: {
        experience,
      },
    });

    res.json({ message: "Profile updated", user: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const showAvailability = async (req, res) => {
  try {
    const craftsmanId = req.user.id;

    const craftsman = await prisma.craftsman.findUnique({
      where: { userId: craftsmanId },
      select: {
        isAvailable: true,
      },
    });

    if (!craftsman) {
      return res.status(404).json({ message: "Craftsman not found" });
    }

    res.json({ isAvailable: craftsman.isAvailable });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleAvailability = async (req, res) => {
  try {
    const craftsmanId = req.user.id;

    const craftsman = await prisma.craftsman.findUnique({
      where: { userId: craftsmanId },
      select: {
        isAvailable: true,
      },
    });

    if (!craftsman) {
      return res.status(404).json({ message: "Craftsman not found" });
    }

    const updated = await prisma.craftsman.update({
      where: { userId: craftsmanId },
      data: {
        isAvailable: !craftsman.isAvailable,
      },
    });

    res.json({
      message: "Availability updated",
      isAvailable: updated.isAvailable,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReviews = async (req, res) => {
  try {
    const craftsmanId = req.user.id;

    const reviews = await prisma.review.findMany({
      where: { craftsmanId },
      select: {
        id: true,
        rating: true,
        comment: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

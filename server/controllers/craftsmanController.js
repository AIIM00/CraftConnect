import prisma from "../src/prisma.js";
import { assignNextCraftsman } from "../services/taskAssignmentService.js";

export const saveApplicationStep = async (req, res) => {
  const userId = req.user.id;
  const { step, data } = req.body;

  try {
    let application = await prisma.application.findUnique({
      where: { userId },
    });

    if (application && application.status === "SUBMITTED") {
      return res.status(400).json({
        message: "Application already submitted",
      });
    }

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
    const application = await prisma.application.findUnique({
      where: { userId },
    });

    if (!application) {
      return res.status(400).json({ message: "No application found" });
    }
    if (application.status === "SUBMITTED") {
      return res.status(400).json({
        message: "Application already submitted",
      });
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
export const getMyApplication = async (req, res) => {
  const userId = req.user.id;

  try {
    const application = await prisma.application.findUnique({
      where: { userId },
      include: {
        category: true,
      },
    });

    res.json({
      success: true,
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
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
    const { action, scheduledDate } = req.body;
    if (!["ACCEPT", "REJECT"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    let parsedScheduledDate = null;
    if (action === "ACCEPT") {
      if (!scheduledDate) {
        return res.status(400).json({
          message: "Scheduled date is required when accepting a task",
        });
      }

      parsedScheduledDate = new Date(scheduledDate);

      if (Number.isNaN(parsedScheduledDate.getTime())) {
        return res.status(400).json({
          message: "Invalid scheduled date",
        });
      }
    }

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
            scheduledDate: parsedScheduledDate,
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

      return res.json({ message: "Task accepted and scheduled successfully" });
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

//Craftsman Calendar Tasks
export const getCraftsmanCalendarTasks = async (req, res) => {
  try {
    const craftsmanId = req.user.id;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "startDate and endDate are required",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date range",
      });
    }

    const tasks = await prisma.task.findMany({
      where: {
        craftsmanId,
        OR: [
          {
            scheduledDate: {
              gte: start,
              lte: end,
            },
          },
          {
            completedAt: {
              gte: start,
              lte: end,
            },
          },
        ],
        status: {
          in: ["IN_PROGRESS", "COMPLETED"],
        },
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
        scheduledDate: "asc",
      },
    });

    res.json({
      success: true,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const completeTask = async (req, res) => {
  try {
    const craftsmanId = req.user.id;
    const { taskId } = req.params;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (task.craftsmanId !== craftsmanId) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this task",
      });
    }

    if (task.status === "COMPLETED") {
      return res.status(400).json({
        success: false,
        message: "Task is already completed",
      });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    res.json({
      success: true,
      message: "Task completed successfully",
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

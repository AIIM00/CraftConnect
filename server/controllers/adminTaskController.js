import prisma from "../src/prisma.js";
import { assignNextCraftsman } from "../services/taskAssignmentService.js";
import { createNotification } from "../services/notificationsService.js";

export const getAdminTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        status: true,

        createdAt: true,
        updatedAt: true,
        scheduledDate: true,
        completedAt: true,
        lastAssignmentAttemptAt: true,
        becameUnassignableAt: true,

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
            user: {
              select: {
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

        assignments: {
          orderBy: {
            assignedAt: "desc",
          },
          select: {
            id: true,
            status: true,
            assignedAt: true,
            respondedAt: true,
            craftsman: {
              select: {
                userId: true,
                status: true,
                isAvailable: true,
                queueOrder: true,
                user: {
                  select: {
                    name: true,
                    email: true,
                    phoneNumber: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUnassignableTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        status: "UNASSIGNABLE",
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
        category: true,
        service: true,
        assignments: {
          orderBy: {
            assignedAt: "desc",
          },
          include: {
            craftsman: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true,
                    phoneNumber: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        becameUnassignableAt: "desc",
      },
    });

    res.json({
      success: true,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const retryTaskAssignment = async (req, res) => {
  try {
    const { taskId } = req.params;

    await prisma.taskAssignment.deleteMany({
      where: {
        taskId,
        status: {
          in: ["DECLINED", "TIMEOUT"],
        },
      },
    });

    await prisma.task.update({
      where: { id: taskId },
      data: {
        status: "PENDING",
        craftsmanId: null,
        becameUnassignableAt: null,
      },
    });

    try {
      const assignment = await assignNextCraftsman(taskId);

      res.json({
        success: true,
        message: "Task assignment retried successfully",
        assignment,
      });
    } catch (assignError) {
      await prisma.task.update({
        where: { id: taskId },
        data: {
          status: "UNASSIGNABLE",
          becameUnassignableAt: new Date(),
        },
      });
      res.status(400).json({
        success: false,
        mesage: assignError.message,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelAdminTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    await prisma.task.update({
      where: { id: taskId },
      data: {
        status: "CANCELLED",
      },
    });

    res.json({
      success: true,
      message: "Task cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCraftsmenForTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: {
        categoryId: true,
        serviceId: true,
      },
    });

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    const craftsmen = await prisma.craftsman.findMany({
      where: {
        categoryId: task.categoryId,
        serviceId: task.serviceId,
        status: "APPROVED",
      },
      include: {
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
        queueOrder: "asc",
      },
    });

    res.json({
      success: true,
      craftsmen,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const manuallyAssignTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { craftsmanId } = req.body;

    if (!craftsmanId) {
      return res.status(400).json({
        success: false,
        message: "craftsmanId is required",
      });
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    if (["COMPLETED", "CANCELLED", "IN_PROGRESS"].includes(task.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot manually assign task with status ${task.status}`,
      });
    }

    const craftsman = await prisma.craftsman.findUnique({
      where: { userId: craftsmanId },
    });

    if (!craftsman) {
      return res.status(404).json({
        success: false,
        message: "Craftsman not found",
      });
    }

    if (
      craftsman.status !== "APPROVED" ||
      craftsman.categoryId !== task.categoryId ||
      craftsman.serviceId !== task.serviceId
    ) {
      return res.status(400).json({
        success: false,
        message: "Craftsman does not match this task category/service",
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.taskAssignment.updateMany({
        where: {
          taskId,
          status: "PENDING",
        },
        data: {
          status: "TRANSFERRED",
          respondedAt: new Date(),
        },
      });
      await tx.taskAssignment.upsert({
        where: {
          taskId_craftsmanId: {
            taskId,
            craftsmanId,
          },
        },
        update: {
          status: "PENDING",
          respondedAt: null,
          assignedAt: new Date(),
        },
        create: {
          taskId,
          craftsmanId,
          status: "PENDING",
        },
      });

      await tx.task.update({
        where: { id: taskId },
        data: {
          status: "WAITING",
          craftsmanId: null,
          lastAssignmentAttemptAt: new Date(),
          becameUnassignableAt: null,
        },
      });
    });
    await createNotification({
      userId: craftsmanId,
      title: "New task assigned by admin",
      message: "An admin manually assigned you a task request.",
      type: "TASK_UPDATE",
      targetUrl: "/craftsman/tasks",
    });
    await createNotification({
      userId: task.customerId,
      title: "Task assignment updated",
      message: "An admin assigned a craftsman to your task.",
      type: "TASK_UPDATE",
      targetUrl: `/bookings/${taskId}`,
    });

    res.json({
      success: true,
      message: "Task manually assigned successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const assignReplacementCraftsman = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { requestId } = req.params;
    const { newCraftsmanId } = req.body;

    const request = await prisma.taskReassignmentRequest.findUnique({
      where: { id: requestId },
      include: { task: true },
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "PENDING_ADMIN") {
      return res
        .status(400)
        .json({ message: "Request is not waiting for admin" });
    }

    const newCraftsman = await prisma.craftsman.findUnique({
      where: { userId: newCraftsmanId },
    });

    if (!newCraftsman) {
      return res.status(404).json({ message: "Craftsman not found" });
    }

    if (
      newCraftsman.status !== "APPROVED" ||
      newCraftsman.categoryId !== request.task.categoryId ||
      newCraftsman.serviceId !== request.task.serviceId
    ) {
      return res.status(400).json({
        message: "Craftsman does not match this task category/service",
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.taskAssignment.upsert({
        where: {
          taskId_craftsmanId: {
            taskId: request.taskId,
            craftsmanId: newCraftsmanId,
          },
        },
        update: {
          status: "PENDING",
          respondedAt: null,
          assignedAt: new Date(),
        },
        create: {
          taskId: request.taskId,
          craftsmanId: newCraftsmanId,
          status: "PENDING",
        },
      });

      await tx.taskReassignmentRequest.update({
        where: { id: requestId },
        data: {
          newCraftsmanId,
          adminId,
          status: "PENDING_CRAFTSMAN",
        },
      });
    });
    await createNotification({
      userId: newCraftsmanId,
      title: "Replacement task request",
      message: "You were selected as a replacement craftsman for a task.",
      type: "REASSIGNMENT",
      targetUrl: "/craftsman/tasks",
    });

    await createNotification({
      userId: request.task.customerId,
      title: "Task reassignment in progress",
      message: "We are assigning a replacement craftsman for your task.",
      type: "TASK_UPDATE",
      targetUrl: `/bookings/${request.taskId}`,
    });

    res.json({
      success: true,
      message: "Replacement request sent to new craftsman",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingReassignmentRequests = async (req, res) => {
  try {
    const requests = await prisma.taskReassignmentRequest.findMany({
      where: {
        status: "PENDING_ADMIN",
      },
      include: {
        task: {
          include: {
            customer: true,
            category: true,
            service: true,
          },
        },
        oldCraftsman: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

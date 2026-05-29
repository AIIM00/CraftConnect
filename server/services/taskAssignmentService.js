import prisma from "../src/prisma.js";
import { createNotification, notifyAdmins } from "./notificationsService.js";

export const assignNextCraftsman = async (taskId) => {
  return await prisma.$transaction(async (tx) => {
    const task = await tx.task.findUnique({
      where: { id: taskId },
      include: { category: true, service: true, assignments: true },
    });

    if (!task) {
      throw new Error("Task not found");
    }

    if (task.status === "IN_PROGRESS" && task.craftsmanId) {
      return { message: "Task already assigned" };
    }
    if (["CANCELLED", "COMPLETED", "IN_PROGRESS"].includes(task.status)) {
      throw new Error(
        `Task cannot be assigned because status is ${task.status}`,
      );
    }

    const craftsmen = await tx.craftsman.findMany({
      where: {
        categoryId: task.categoryId,
        serviceId: task.serviceId,
        status: "APPROVED",
        isAvailable: true,
        queueOrder: {
          not: null,
        },
      },
      orderBy: {
        queueOrder: "asc",
      },
      select: {
        userId: true,
      },
    });

    console.log(craftsmen);
    if (!craftsmen.length) {
      throw new Error("No available craftsmen for this category");
    }

    const alreadyTried = new Set(task.assignments.map((a) => a.craftsmanId));

    const queue = await tx.categoryAssignmentQueue.upsert({
      where: {
        categoryId_serviceId: {
          categoryId: task.categoryId,
          serviceId: task.serviceId,
        },
      },
      update: {},
      create: {
        categoryId: task.categoryId,
        serviceId: task.serviceId,
      },
    });

    let startIndex = 0;

    if (queue.lastAssignedTo) {
      const lastIndex = craftsmen.findIndex(
        (c) => c.userId === queue.lastAssignedTo,
      );
      if (lastIndex !== -1) {
        startIndex = (lastIndex + 1) % craftsmen.length;
      }
    }

    let selectedCraftsman = null;

    for (let i = 0; i < craftsmen.length; i++) {
      const index = (startIndex + i) % craftsmen.length;
      const candidate = craftsmen[index];

      if (!alreadyTried.has(candidate.userId)) {
        selectedCraftsman = candidate;
        break;
      }
    }

    if (!selectedCraftsman) {
      throw new Error(
        "All craftsmen in this category already declined or timed out",
      );
    }
    await tx.task.update({
      where: { id: task.id },
      data: {
        lastAssignmentAttemptAt: new Date(),
      },
    });

    await tx.taskAssignment.create({
      data: {
        taskId: task.id,
        craftsmanId: selectedCraftsman.userId,
        status: "PENDING",
      },
    });
    await createNotification({
      userId: selectedCraftsman.userId,
      title: "New task assigned",
      message: `You received a new ${task.category.name} task request.`,
      type: "TASK_UPDATE",
      targetUrl: "/craftsman/tasks",
    });

    await tx.task.update({
      where: { id: task.id },
      data: { status: "WAITING" },
    });

    await tx.categoryAssignmentQueue.update({
      where: {
        categoryId_serviceId: {
          categoryId: task.categoryId,
          serviceId: task.serviceId,
        },
      },
      data: { lastAssignedTo: selectedCraftsman.userId },
    });

    return {
      taskId: task.id,
      craftsmanId: selectedCraftsman.userId,
    };
  });
};

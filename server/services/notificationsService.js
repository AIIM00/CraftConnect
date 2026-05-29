import prisma from "../src/prisma.js";

export const createNotification = async ({
  userId = null,
  title,
  message,
  type = "ADMIN_UPDATE",
  targetUrl = null,
}) => {
  return prisma.notification.create({
    data: {
      userId,
      title,
      message,
      type,
      targetUrl,
    },
  });
};

export const notifyAdmins = async ({ title, message, targetUrl = null }) => {
  const admins = await prisma.user.findMany({
    where: {
      role: {
        in: ["ADMIN", "SUPERADMIN"],
      },
      isDeleted: false,
    },
    select: {
      id: true,
    },
  });

  if (!admins.length) return [];

  return prisma.notification.createMany({
    data: admins.map((admin) => ({
      userId: admin.id,
      title,
      message,
      type: "ADMIN_UPDATE",
      targetUrl,
    })),
  });
};

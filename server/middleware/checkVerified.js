import prisma from "../src/prisma.js";

export const checkVerified = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login first.",
      });
    }

    const user = await prisma.user.findFirst({
      where: { id: userId, isDeleted: false },
      select: {
        id: true,
        isAccountVerified: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!user.isAccountVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before using this service.",
      });
    }

    next();
  } catch (error) {
    console.error("Email verification middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

import prisma from "../src/prisma.js";

const resetOtpAuth = async (req, res, next) => {
  try {
    const { email, enteredOtp } = req.body;

    if (!email || !enteredOtp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
        isDeleted: false,
      },
    });

    if (
      !user ||
      user.resetOtp !== enteredOtp ||
      !user.resetOtpExpireAt ||
      user.resetOtpExpireAt < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    req.resetUser = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default resetOtpAuth;

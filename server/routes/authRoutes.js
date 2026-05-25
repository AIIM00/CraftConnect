import express from "express";
import userAuth from "../middleware/userAuth.js";
import resetOtpAuth from "../middleware/resetOtpAuth.js";
import { authLimiter, otpLimiter } from "../middleware/rateLimitMiddleware.js";
import {
  register,
  login,
  logout,
  sendVerifyOtp,
  verifyEmail,
  checkAuth,
  sendResetOtp,
  resetPassword,
} from "../controllers/authController.js";

//Auth Endpoints
const authRouter = express.Router();

authRouter.post("/register", authLimiter, register);
authRouter.post("/login", authLimiter, login);
authRouter.post("/logout", logout);
authRouter.post("/send-verify-otp", userAuth, otpLimiter, sendVerifyOtp);
authRouter.post("/verify-account", userAuth, verifyEmail);
authRouter.get("/is-auth", userAuth, checkAuth);

authRouter.post("/verify-reset-otp", resetOtpAuth, (req, res) => {
  res.json({
    success: true,
    message: "OTP verified successfully",
  });
});
authRouter.post("/send-reset-otp", otpLimiter, sendResetOtp);
authRouter.post("/reset-password", resetOtpAuth, resetPassword);

export default authRouter;

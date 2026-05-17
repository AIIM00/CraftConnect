import express from "express";
import userAuth from "../middleware/userAuth.js";
import { checkVerified } from "../middleware/checkVerified.js";
import {
  browseServices,
  bookTask,
  getUserBookings,
  cancelBooking,
  trackTask,
  leaveReview,
  getUserData,
  updateUserProfile,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/services", browseServices);
userRouter.post("/book", userAuth, checkVerified, bookTask);
userRouter.get("/bookings", userAuth, checkVerified, getUserBookings);
userRouter.patch("/cancel/:taskId", userAuth, checkVerified, cancelBooking);
userRouter.get("/track/:taskId", userAuth, checkVerified, trackTask);
userRouter.post("/review/:taskId", userAuth, checkVerified, leaveReview);
userRouter.get("/data", userAuth, getUserData);
userRouter.put("/profile", userAuth, updateUserProfile);

export default userRouter;

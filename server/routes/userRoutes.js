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
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/services", browseServices);
userRouter.post("/book", userAuth, checkVerified, bookTask);
userRouter.get("/bookings", userAuth, checkVerified, getUserBookings);
userRouter.post("/cancel/:taskId", userAuth, checkVerified, cancelBooking);
userRouter.get("/track/:taskId", userAuth, checkVerified, trackTask);
userRouter.post("/review/:taskId", userAuth, checkVerified, leaveReview);
userRouter.get("/data", userAuth, getUserData);
export default userRouter;

import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../controllers/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.get("/", userAuth, getMyNotifications);
notificationRouter.get("/unread-count", userAuth, getUnreadNotificationCount);
notificationRouter.patch(
  "/:notificationId/read",
  userAuth,
  markNotificationAsRead,
);
notificationRouter.patch(
  "/mark-all-read",
  userAuth,
  markAllNotificationsAsRead,
);

export default notificationRouter;

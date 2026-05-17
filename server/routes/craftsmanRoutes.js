import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  isCraftsman,
  checkCraftsmanStatus,
} from "../middleware/craftsmanAuth.js";
import {
  getMyApplication,
  saveApplicationStep,
  submitApplication,
  dashboard,
  getCraftsmanCalendarTasks,
  assignRejectTask,
  updateProfile,
  getAllTasks,
  toggleAvailability,
  showAvailability,
  completeTask,
} from "../controllers/craftsmanController.js";

export const craftsmanRouter = express.Router();
craftsmanRouter.get(
  "/applications/me",
  userAuth,
  isCraftsman,
  getMyApplication,
);
craftsmanRouter.post(
  "/applications/save",
  userAuth,
  isCraftsman,
  saveApplicationStep,
);
craftsmanRouter.post(
  "/applications/submit",
  userAuth,
  isCraftsman,
  submitApplication,
);

craftsmanRouter.get(
  "/dashboard",
  userAuth,
  isCraftsman,
  checkCraftsmanStatus,
  dashboard,
);
craftsmanRouter.get(
  "/tasks",
  userAuth,
  isCraftsman,
  checkCraftsmanStatus,
  getAllTasks,
);

craftsmanRouter.get(
  "/calendar-tasks",
  userAuth,
  isCraftsman,
  getCraftsmanCalendarTasks,
);
craftsmanRouter.patch(
  "/tasks/:taskId/respond",
  userAuth,
  isCraftsman,
  checkCraftsmanStatus,
  assignRejectTask,
);
craftsmanRouter.patch(
  "/tasks/:taskId/complete",
  userAuth,
  isCraftsman,
  completeTask,
);

craftsmanRouter.patch("/profile", userAuth, isCraftsman, updateProfile);
craftsmanRouter.get(
  "/availability",
  userAuth,
  isCraftsman,
  checkCraftsmanStatus,
  showAvailability,
);

craftsmanRouter.patch(
  "/availability/toggle",
  userAuth,
  isCraftsman,
  checkCraftsmanStatus,
  toggleAvailability,
);
export default craftsmanRouter;

import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  isCraftsman,
  checkCraftsmanStatus,
} from "../middleware/craftsmanAuth.js";
import {
  saveApplicationStep,
  submitApplication,
  dashboard,
  assignRejectTask,
  updateProfile,
  getAllTasks,
} from "../controllers/craftsmanController.js";

export const craftsmanRouter = express.Router();

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

craftsmanRouter.patch(
  "/tasks/:taskId/respond",
  userAuth,
  isCraftsman,
  checkCraftsmanStatus,
  assignRejectTask,
);

craftsmanRouter.patch("/profile", userAuth, isCraftsman, updateProfile);

export default craftsmanRouter;

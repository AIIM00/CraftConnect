import express from "express";
import userAuth from "../middleware/userAuth.js";
import { isAdmin, isSuperAdmin, inviteCheck } from "../middleware/adminAuth.js";
import {
  adminInfo,
  getAllCustomers,
  getUserById,
  deleteUserById,
} from "../controllers/adminUserController.js";

import {
  getAllCraftsmen,
  getCraftsmanApplication,
  updateApplicationStatus,
  getCraftsmenCountByCategory,
  restoreCraftsman,
} from "../controllers/adminCraftsmanController.js";

import {
  inProgressTasks,
  getAllReviews,
  createWarning,
  removeWarning,
  getFlaggedCraftsmen,
} from "../controllers/adminModerationController.js";
import {
  addAdmin,
  acceptAdminInvite,
} from "../controllers/adminInviteController.js";

const adminRouter = express.Router();

//Admin Invite Controller

adminRouter.post("/add-admin", userAuth, isSuperAdmin, addAdmin);
adminRouter.post(
  "/add-admin/accept-invite/:token",
  inviteCheck,
  acceptAdminInvite,
);

//Admin User Controller
adminRouter.get("/info", userAuth, isAdmin, adminInfo);
adminRouter.get("/customers", userAuth, isAdmin, getAllCustomers);
adminRouter.get("/data/:id", userAuth, isAdmin, getUserById);
adminRouter.delete("/delete/:id", userAuth, isAdmin, deleteUserById);

//Admin Craftsman Controller
adminRouter.get("/craftsmen", userAuth, isAdmin, getAllCraftsmen);
adminRouter.get(
  "/craftsmen/applications",
  userAuth,
  isAdmin,
  getCraftsmanApplication,
);
adminRouter.patch(
  "/craftsmen/applications/:userId/status",
  userAuth,
  isAdmin,
  updateApplicationStatus,
);
adminRouter.get(
  "/craftsmen/category/count",
  userAuth,
  isAdmin,
  getCraftsmenCountByCategory,
);
adminRouter.patch(
  "/craftsmen/restore/:userId",
  userAuth,
  isAdmin,
  restoreCraftsman,
);

//Admin Moderation Controller
adminRouter.get("/tasks/in-progress", userAuth, isAdmin, inProgressTasks);
adminRouter.get("/reviews", userAuth, isAdmin, getAllReviews);
adminRouter.post("/warnings/:craftsmanId", userAuth, isAdmin, createWarning);
adminRouter.delete("/warnings/:warningId", userAuth, isAdmin, removeWarning);
adminRouter.get(
  "/warnings/flagged-craftsmen",
  userAuth,
  isAdmin,
  getFlaggedCraftsmen,
);

export default adminRouter;

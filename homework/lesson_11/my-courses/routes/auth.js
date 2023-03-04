import express from "express";
import { protect } from "../middleware/routeProtect.js";
import * as controller from "../controllers/auth.js";

export const router = express.Router();

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/logout", controller.logout);
router.get("/me", protect, controller.getMe);
router.post("/forgot-password", controller.forgotPassword);
router.put("/reset-password/:token", controller.resetPassword);
router.put("/update-details", protect, controller.updateDetails);
router.put("/update-password", protect, controller.updatePassword);

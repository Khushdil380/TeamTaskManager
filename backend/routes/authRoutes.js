import express from "express";
import {
  signup,
  verifyOtp,
  resendOtp,
  login,
  forgotPassword,
  resetPassword,
  verifyToken,
  updateProfile,
  requestPasswordUpdateOtp,
  updatePassword,
} from "../controllers/authController.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected route
router.get("/verify-token", verifyToken);

// Authenticated profile routes
router.put("/update-profile", updateProfile);
router.post("/request-password-update-otp", requestPasswordUpdateOtp);
router.put("/update-password", updatePassword);

export default router;

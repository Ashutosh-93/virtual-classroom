// routes/user.routes.js

import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  getMe,
  updateProfile,
  getEnrolledCourses,
  markLectureComplete,
  getCourseProgress,
  changePassword,
  deleteAccount,
} from "../controllers/user.controller.js";

const router = express.Router();

// =====================
// USER PROFILE
// =====================
router.get("/me", authMiddleware, getMe);
router.put("/update-profile", authMiddleware, updateProfile);

// =====================
// ENROLLED COURSES
// =====================
router.get("/enrolled-courses", authMiddleware, getEnrolledCourses);

// =====================
// PROGRESS / LEARNING
// =====================
router.post("/complete-lecture", authMiddleware, markLectureComplete);
router.get("/progress/:courseId", authMiddleware, getCourseProgress);

// =====================
// ACCOUNT MANAGEMENT
// =====================
router.put("/change-password", authMiddleware, changePassword);
router.delete("/delete-account", authMiddleware, deleteAccount);

export default router;
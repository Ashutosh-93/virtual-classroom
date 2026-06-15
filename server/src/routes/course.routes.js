// routes/course.routes.js

import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createCourse,
  deleteCourse,
  enrollInCourse,
  getAllCourses,
  getCourseById,
  getEnrolledCourses,
  getTeacherCourses,
  updateCourse,
} from "../controllers/course.controller.js";

const router = express.Router();

// =====================
// PUBLIC ROUTES
// =====================

router.get("/", getAllCourses);

// =====================
// AUTHENTICATED ROUTES
// =====================

router.post("/create", authMiddleware, createCourse);
router.get("/teacher/my-courses", authMiddleware, getTeacherCourses);
router.get("/my/enrolled", authMiddleware, getEnrolledCourses);
router.post("/:id/enroll", authMiddleware, enrollInCourse);
router.put("/:id", authMiddleware, updateCourse);
router.delete("/:id", authMiddleware, deleteCourse);

// Keep the dynamic course detail route at the end so
// specific paths like /teacher/my-courses are not mistaken
// for a course ID.
router.get("/:id", getCourseById);

export default router;
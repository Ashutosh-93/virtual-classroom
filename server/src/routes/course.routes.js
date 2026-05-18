// routes/course.routes.js

import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createCourse,
  getAllCourses,
  getCourseById,
  getTeacherCourses,
} from "../controllers/course.controller.js";

const router = express.Router();

// =====================
// PUBLIC ROUTES
// =====================

// Get all courses (public)
router.get("/", getAllCourses);



// =====================
// TEACHER / AUTH ROUTES
// =====================

// Create course
router.post("/create", authMiddleware, createCourse);

// Get logged-in teacher's courses
router.get("/teacher/my-courses", authMiddleware, getTeacherCourses);


// Get single course (public)
router.get("/:id", getCourseById);

export default router;
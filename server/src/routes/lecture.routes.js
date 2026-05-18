// routes/lecture.routes.js

import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createLecture,
  getCourseLectures,
  updateLecture,
  deleteLecture,
} from "../controllers/lecture.controller.js";

const router = express.Router();

// =====================
// CREATE LECTURE (teacher only)
// =====================
router.post(
  "/course/:courseId",
  authMiddleware,
  createLecture
);

// =====================
// GET ALL LECTURES OF A COURSE
// =====================
router.get(
  "/course/:courseId",
  authMiddleware,
  getCourseLectures
);

// =====================
// UPDATE LECTURE
// =====================
router.put(
  "/:lectureId",
  authMiddleware,
  updateLecture
);

// =====================
// DELETE LECTURE
// =====================
router.delete(
  "/:lectureId",
  authMiddleware,
  deleteLecture
);

export default router;
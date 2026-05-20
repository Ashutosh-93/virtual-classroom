import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

import {
  createLecture,
  updateLecture,
  deleteLecture,
} from "../controllers/lecture.controller.js";

const router = express.Router();

// CREATE LECTURE (with video upload)
router.post(
  "/:courseId",
  authMiddleware,
  upload.single("video"), 
  createLecture
);

// UPDATE LECTURE (optional video replacement)
router.put(
  "/:lectureId",
  authMiddleware,
  upload.single("video"), 
  updateLecture
);

router.delete("/:lectureId", authMiddleware, deleteLecture);

export default router;
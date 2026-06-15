import mongoose from "mongoose";

import Course from "../models/course.model.js";
import Lecture from "../models/lecture.model.js";
import { deleteVideo, uploadVideo } from "../services/storage.service.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const ensureTeacherOwnership = (course, userId) => {
  if (!course) {
    return false;
  }

  return course.teacher?.toString() === userId?.toString();
};

// ==============================
// CREATE LECTURE
// ==============================
export const createLecture = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { courseId } = req.params;

    const trimmedTitle = title?.trim();
    const trimmedDescription = description?.trim();

    if (!isValidObjectId(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    if (!trimmedTitle || !trimmedDescription || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and video file are required",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (!ensureTeacherOwnership(course, req.user?._id)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to add lectures to this course",
      });
    }

    const uploadedVideo = await uploadVideo(req.file.buffer);

    const lecture = await Lecture.create({
      title: trimmedTitle,
      description: trimmedDescription,
      videoUrl: uploadedVideo.secure_url,
      publicId: uploadedVideo.public_id,
      course: courseId,
    });

    course.lectures.addToSet(lecture._id);
    await course.save();

    return res.status(201).json({
      success: true,
      message: "Lecture created successfully",
      lecture,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create lecture",
    });
  }
};

// ==============================
// UPDATE LECTURE
// ==============================
export const updateLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { title, description } = req.body;

    if (!isValidObjectId(lectureId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lecture ID",
      });
    }

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    const course = await Course.findById(lecture.course);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Associated course not found",
      });
    }

    if (!ensureTeacherOwnership(course, req.user?._id)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this lecture",
      });
    }

    if (typeof title === "string") {
      const trimmedTitle = title.trim();

      if (!trimmedTitle) {
        return res.status(400).json({
          success: false,
          message: "Lecture title cannot be empty",
        });
      }

      lecture.title = trimmedTitle;
    }

    if (typeof description === "string") {
      const trimmedDescription = description.trim();

      if (!trimmedDescription) {
        return res.status(400).json({
          success: false,
          message: "Lecture description cannot be empty",
        });
      }

      lecture.description = trimmedDescription;
    }

    if (req.file) {
      if (lecture.publicId) {
        await deleteVideo(lecture.publicId);
      }

      const uploadedVideo = await uploadVideo(req.file.buffer);

      lecture.videoUrl = uploadedVideo.secure_url;
      lecture.publicId = uploadedVideo.public_id;
    }

    await lecture.save();

    return res.status(200).json({
      success: true,
      message: "Lecture updated successfully",
      lecture,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update lecture",
    });
  }
};

// ==============================
// DELETE LECTURE
// ==============================
export const deleteLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;

    if (!isValidObjectId(lectureId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lecture ID",
      });
    }

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    const course = await Course.findById(lecture.course);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Associated course not found",
      });
    }

    if (!ensureTeacherOwnership(course, req.user?._id)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this lecture",
      });
    }

    if (lecture.publicId) {
      try {
        await deleteVideo(lecture.publicId);
      } catch (deleteError) {
        // Keep the request flowing even if Cloudinary cleanup fails.
        // The database record will still be removed, and the video can be cleaned up separately if needed.
      }
    }

    await Lecture.findByIdAndDelete(lectureId);

    course.lectures.pull(lectureId);
    await course.save();

    return res.status(200).json({
      success: true,
      message: "Lecture deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete lecture",
    });
  }
};
import Course from "../models/course.model.js";
import Lecture from "../models/lecture.model.js";

import {
  uploadVideo,
  deleteVideo,
} from "../services/storage.service.js";

// ==============================
// CREATE LECTURE
// ==============================
export const createLecture = async (req, res) => {
  try {
    const { title } = req.body;
    const { courseId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Video file is required",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // ownership check
    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to add lectures",
      });
    }

    // upload video
    const result = await uploadVideo(req.file.buffer);

    const lecture = await Lecture.create({
      title,
      videoUrl: result.secure_url,
      publicId: result.public_id,
      course: courseId,
    });

    course.lectures.push(lecture._id);
    await course.save();

    res.status(201).json({
      success: true,
      lecture,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// UPDATE LECTURE
// ==============================
export const updateLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { title } = req.body;

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    const course = await Course.findById(lecture.course);

    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // update title
    if (title) lecture.title = title;

    // replace video if new file exists
    if (req.file) {
      await deleteVideo(lecture.publicId);

      const result = await uploadVideo(req.file.buffer);

      lecture.videoUrl = result.secure_url;
      lecture.publicId = result.public_id;
    }

    await lecture.save();

    res.status(200).json({
      success: true,
      lecture,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// DELETE LECTURE
// ==============================
export const deleteLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    const course = await Course.findById(lecture.course);

    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // remove from cloud
    await deleteVideo(lecture.publicId);

    // remove from DB
    await Lecture.findByIdAndDelete(lectureId);

    // remove reference from course
    course.lectures.pull(lectureId);
    await course.save();

    res.status(200).json({
      success: true,
      message: "Lecture deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
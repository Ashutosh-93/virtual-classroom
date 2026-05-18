// controllers/lecture.controller.js

import Course from "../models/course.model.js";
import Lecture from "../models/lecture.model.js";

// CREATE LECTURE
export const createLecture = async (req, res) => {
  try {
    const { title, videoUrl } = req.body;

    const { courseId } = req.params;

    // check course
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // make sure teacher owns the course
    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // create lecture
    const lecture = await Lecture.create({
      title,
      videoUrl,
      course: courseId,
    });

    // push lecture into course
    course.lectures.push(lecture._id);

    await course.save();

    res.status(201).json({
      success: true,
      message: "Lecture created successfully",
      lecture,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET COURSE LECTURES
export const getCourseLectures = async (req, res) => {
  try {
    const { courseId } = req.params;

    const lectures = await Lecture.find({
      course: courseId,
    }).sort({
      createdAt: 1,
    });

    res.status(200).json({
      success: true,
      lectures,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE LECTURE
export const updateLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const { title, videoUrl } = req.body;

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    // check course ownership
    const course = await Course.findById(lecture.course);

    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    lecture.title = title || lecture.title;

    lecture.videoUrl = videoUrl || lecture.videoUrl;

    await lecture.save();

    res.status(200).json({
      success: true,
      message: "Lecture updated successfully",
      lecture,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE LECTURE
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

    // find course
    const course = await Course.findById(lecture.course);

    // ownership check
    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // remove lecture from course
    course.lectures.pull(lectureId);

    await course.save();

    // delete lecture
    await Lecture.findByIdAndDelete(lectureId);

    res.status(200).json({
      success: true,
      message: "Lecture deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
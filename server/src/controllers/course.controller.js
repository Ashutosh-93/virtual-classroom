// controllers/course.controller.js

import Course from "../models/course.model.js";
import User from "../models/user.model.js";


// CREATE COURSE
export const createCourse = async (req, res) => {
  try {
    const { title, description, thumbnail, price } = req.body;

    const course = await Course.create({
      title,
      description,
      thumbnail,
      price,
      teacher: req.user._id,
    });

    // add course to teacher createdCourses
    await User.findByIdAndUpdate(req.user._id, {
      $push: { createdCourses: course._id },
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL COURSES
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("teacher", "fullName avatar email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE COURSE
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("teacher", "fullName profilePic email")
      .populate("lectures", "title");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET TEACHER COURSES
export const getTeacherCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      teacher: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
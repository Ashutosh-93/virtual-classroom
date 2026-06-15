import mongoose from "mongoose";

import Course from "../models/course.model.js";
import User from "../models/user.model.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ==============================
// CREATE COURSE
// ==============================
export const createCourse = async (req, res) => {
  try {
    const { title, description, thumbnail, price, isPublished } = req.body;

    const trimmedTitle = title?.trim();
    const trimmedDescription = description?.trim();
    const numericPrice = Number(price ?? 0);

    if (!trimmedTitle || !trimmedDescription) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid non-negative number",
      });
    }

    const course = await Course.create({
      title: trimmedTitle,
      description: trimmedDescription,
      thumbnail: thumbnail || "",
      price: numericPrice,
      isPublished: Boolean(isPublished),
      teacher: req.user._id,
    });

    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { createdCourses: course._id } },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create course",
    });
  }
};

// ==============================
// GET ALL COURSES (PUBLIC)
// ==============================
export const getAllCourses = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 12));
    const search = (req.query.search || "").trim();

    const filter = { isPublished: true };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Course.countDocuments(filter);
    const courses = await Course.find(filter)
      .populate("teacher", "fullName profilePic email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch courses",
    });
  }
};

// ==============================
// GET SINGLE COURSE (PUBLIC)
// ==============================
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await Course.findById(id)
      .populate("teacher", "fullName profilePic email")
      .populate("lectures", "title description videoUrl createdAt");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch course",
    });
  }
};

// ==============================
// GET TEACHER COURSES
// ==============================
export const getTeacherCourses = async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.user._id })
      .populate("teacher", "fullName profilePic email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch teacher courses",
    });
  }
};

// ==============================
// UPDATE COURSE
// ==============================
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this course",
      });
    }

    const { title, description, thumbnail, price, isPublished } = req.body;

    if (typeof title === "string") {
      const trimmedTitle = title.trim();

      if (!trimmedTitle) {
        return res.status(400).json({
          success: false,
          message: "Title cannot be empty",
        });
      }

      course.title = trimmedTitle;
    }

    if (typeof description === "string") {
      const trimmedDescription = description.trim();

      if (!trimmedDescription) {
        return res.status(400).json({
          success: false,
          message: "Description cannot be empty",
        });
      }

      course.description = trimmedDescription;
    }

    if (typeof thumbnail === "string") course.thumbnail = thumbnail;

    if (price !== undefined) {
      const numericPrice = Number(price);

      if (!Number.isFinite(numericPrice) || numericPrice < 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be a valid non-negative number",
        });
      }

      course.price = numericPrice;
    }

    if (typeof isPublished === "boolean") {
      course.isPublished = isPublished;
    }

    await course.save();

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update course",
    });
  }
};

// ==============================
// DELETE COURSE
// ==============================
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this course",
      });
    }

    await Course.findByIdAndDelete(id);

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { createdCourses: id },
    });

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete course",
    });
  }
};

// ==============================
// GET ENROLLED COURSES
// ==============================
export const getEnrolledCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: "enrolledCourses",
        populate: { path: "teacher", select: "fullName profilePic email" },
      })
      .lean();

    return res.status(200).json({
      success: true,
      courses: user?.enrolledCourses || [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch enrolled courses",
    });
  }
};

// ==============================
// ENROLL IN COURSE
// ==============================
export const enrollInCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (!course.isPublished) {
      return res.status(400).json({
        success: false,
        message: "This course is not available for enrollment yet",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const alreadyEnrolled = user.enrolledCourses.some((courseId) => courseId.toString() === id);

    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    user.enrolledCourses.push(course._id);
    course.studentsEnrolled.push(user._id);

    await Promise.all([user.save(), course.save()]);

    return res.status(200).json({
      success: true,
      message: "Enrolled successfully",
      course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to enroll in course",
    });
  }
};
// controllers/user.controller.js

import User from "../models/user.model.js";
import Course from "../models/course.model.js";
import Lecture from "../models/lecture.model.js";

import bcrypt from "bcrypt";

// ============================
// GET CURRENT USER
// ============================
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("enrolledCourses")
      .populate("createdCourses");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// UPDATE PROFILE
// ============================
export const updateProfile = async (req, res) => {
  try {
    const { fullName, profilePic } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.fullName = fullName || user.fullName;
    user.profilePic = profilePic || user.profilePic;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// GET ENROLLED COURSES
// ============================
export const getEnrolledCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "enrolledCourses",
      populate: {
        path: "teacher",
        select: "fullName avatar",
      },
    });

    res.status(200).json({
      success: true,
      courses: user.enrolledCourses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// MARK LECTURE COMPLETE
// ============================
export const markLectureComplete = async (req, res) => {
  try {
    const { lectureId } = req.body;

    const user = await User.findById(req.user._id);

    if (!user.completedLectures.includes(lectureId)) {
      user.completedLectures.push(lectureId);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Lecture marked as completed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// GET COURSE PROGRESS
// ============================
export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate("lectures");

    const user = await User.findById(req.user._id);

    const totalLectures = course.lectures.length;

    const completed = user.completedLectures.filter((lectureId) =>
      course.lectures.some((lec) => lec._id.toString() === lectureId.toString())
    ).length;

    const progress = totalLectures === 0 ? 0 : (completed / totalLectures) * 100;

    res.status(200).json({
      success: true,
      progress,
      completed,
      totalLectures,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// CHANGE PASSWORD
// ============================
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// DELETE ACCOUNT
// ============================
export const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
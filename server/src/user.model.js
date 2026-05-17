// models/User.js

import mongoose from mongoose;

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    avatar: {
      type: String,
      default: ""
    },

    role: {
      type: String,
      enum: [student, teacher, admin],
      default: student,
    },

    bio: {
      type: String,
      default: "",
    },

    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Course,
      },
    ],

    createdCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Course,
      },
    ],

    watchedLectures: [
      {
        lecture: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Lecture,
        },

        watchedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model(User, userSchema);

export default User;

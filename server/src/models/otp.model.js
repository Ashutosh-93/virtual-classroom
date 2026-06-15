// models/otp.model.js

import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
  },

  otp: {
    type: String,
    required: true,
  },

  purpose: {
    type: String,
    enum: ["register", "reset-password"],
    default: "register",
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: "5m",
  },
});

const Otp = mongoose.model("Otp", otpSchema);

export default Otp;
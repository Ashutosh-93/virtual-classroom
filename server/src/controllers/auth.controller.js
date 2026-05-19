import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import resend from "../config/resend.js";

import Otp from "../models/otp.model.js";

import { OAuth2Client } from "google-auth-library";


// Helper: generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// SIGNUP
export const signup = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
    });

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set true in production (HTTPS)
      sameSite: "lax",
    });

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Signup failed",
      error: error.message,
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("login controller 1");

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

// LOGOUT
export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.json({ message: "Logged out successfully" });
};

// auth.controller.js



// ===================================
// SEND OTP
// ===================================
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // prevent spam requests
    const existingOtp = await Otp.findOne({ email });

    if (existingOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP already sent. Please wait 5 minutes.",
      });
    }

    // generate otp
    const generatedOtp = crypto
      .randomInt(100000, 999999)
      .toString();

    // save otp
    await Otp.create({
      email,
      otp: generatedOtp,
    });

    // send email
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Your Verification Code",
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP code is:</p>
        <h1>${generatedOtp}</h1>
        <p>This OTP expires in 5 minutes.</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===================================
// VERIFY OTP
// ===================================
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not requested",
      });
    }

    // verify otp
    if (otpRecord.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // delete otp after success
    await Otp.deleteOne({
      _id: otpRecord._id,
    });

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// GOOGLE LOGIN



const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "Google ID token is required",
      });
    }

    // verify token with google
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const {
      sub: googleId,
      email,
      name,
      picture,
    } = payload;

    // find existing user
    let user = await User.findOne({ email });

    // ==========================
    // CREATE ACCOUNT IF NOT EXISTS
    // ==========================
    if (!user) {
      user = await User.create({
        fullName: name,
        email,
        avatar: picture,
        googleId,
        password: crypto.randomBytes(32).toString("hex"),
        isVerified: true,
      });
    }

    // ==========================
    // LINK GOOGLE ACCOUNT
    // ==========================
    else if (!user.googleId) {
      user.googleId = googleId;

      // only overwrite avatar if empty
      if (!user.avatar) {
        user.avatar = picture;
      }

      await user.save();
    }

    // ==========================
    // GENERATE JWT
    const token = generateToken(user._id);
    // ==========================
    
    // ==========================
    // SEND COOKIE
    // ==========================
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ==========================
    // RESPONSE
    // ==========================
    res.status(200).json({
      success: true,
      message: "Google login successful",

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },

      token,
    });
  } catch (error) {
    console.error(error);

    res.status(401).json({
      success: false,
      message: "Invalid Google token",
    });
  }
};
import crypto from "crypto";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";

import User from "../models/user.model.js";
import { createToken } from "../config/jwt.config.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const buildUserResponse = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  profilePic: user.profilePic || "",
});

// ==============================
// SIGNUP
// ==============================
export const signup = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;
    const trimmedName = fullName?.trim();
    const normalizedEmail = normalizeEmail(email);

    if (!trimmedName || !normalizedEmail || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, password, and confirm password are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters, one uppercase letter, one number, and one special character",
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName: trimmedName,
      email: normalizedEmail,
      password: hashedPassword,
      isVerified: false,
      role: "student",
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully. Please verify your email using OTP.",
      user: buildUserResponse(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create user account",
    });
  }
};

// ==============================
// LOGIN
// ==============================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    if (!user || !user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = createToken(user._id);
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: buildUserResponse(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// ==============================
// LOGOUT
// ==============================
export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// auth.controller.js






// GOOGLE LOGIN



export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "Google ID token is required",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    

    const payload = ticket.getPayload();
    

    if (!payload) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google token payload",
      });
    }

    const { sub: googleId, email, name, picture } = payload;
    const normalizedEmail = normalizeEmail(email);

    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = await User.create({
        fullName: name || "Google User",
        email: normalizedEmail,
        profilePic: picture || "",
        googleId,
        password: crypto.randomBytes(32).toString("hex"),
        isVerified: true,
        role: "student",
      });
    } else if (!user.googleId) {
      user.googleId = googleId;

      if (!user.profilePic) {
        user.profilePic = picture || user.profilePic;
      }

      if (!user.isVerified) {
        user.isVerified = true;
      }

      await user.save();
    }

    const token = createToken(user._id);
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Google login successful",
      user: buildUserResponse(user),
    });
  } catch (error) {
    
    return res.status(401).json({
      success: false,
      message: "Invalid Google token",
    });
  }
};
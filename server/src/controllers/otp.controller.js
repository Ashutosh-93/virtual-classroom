import crypto from "crypto";
import resend from "../config/resend.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import Otp from "../models/otp.model.js";


// SEND OTP
export const sendOtp = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const normalizedName = name?.trim() || "";
    const normalizedEmail = email?.trim().toLowerCase() || "";

    if (!normalizedName || !normalizedEmail || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // PASSWORD STRENGTH

    const PASSWORD_REGEX =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain minimum 8 characters, 1 uppercase letter, 1 number and 1 special character",
      });
    }


    // check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      if(existingUser.isVerified){  
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    }

    // prevent spam requests
    const existingOtp = await Otp.findOne({ email: normalizedEmail });

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
      //hashing password and otp before saving in tempUser
const hashedPassword = await bcrypt.hash(password, 10);
const hashedOtp = await bcrypt.hash(generatedOtp, 10);
//create a user from email, name and hashed password
await User.create({
  fullName: normalizedName,
  email: normalizedEmail,
  password: hashedPassword,
  isVerified: false,
});

    // save otp
    await Otp.create({
      email: normalizedEmail,
      otp: hashedOtp,
    });

    // send email
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: normalizedEmail,
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
    const normalizedEmail = email?.trim().toLowerCase() || "";
    const normalizedOtp = otp?.toString().trim() || "";

    if (!normalizedEmail || !normalizedOtp) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const otpRecord = await Otp.findOne({ email: normalizedEmail });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not requested",
      });
    }
    const isMatch = await bcrypt.compare(normalizedOtp, otpRecord.otp);
    // verify otp
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }
    //update user after successful otp verification
    await User.updateOne({ email: normalizedEmail }, { isVerified: true });

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

// routes/authRoutes.js

import express from "express";
import {
  signup,
  login,
  logout,
  googleLogin
} from "../controllers/auth.controller.js";
import { sendOtp, verifyOtp } from "../controllers/otp.controller.js";


const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/send-otp", sendOtp);

router.post("/verify-otp", verifyOtp);

router.post("/google-login", googleLogin);

export default router;
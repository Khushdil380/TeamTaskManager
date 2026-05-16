import User from "../models/User.js";
import {
  generateOtp,
  sendOtpEmail,
  sendPasswordResetEmail,
} from "../services/emailService.js";
import jwt from "jsonwebtoken";

// Signup controller
export const signup = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        // Fully verified account — block registration
        return res.status(409).json({
          message: "Email already registered. Please login or use another email.",
        });
      }
      // Unverified ghost record (OTP never completed) — wipe it so they can retry
      await existingUser.deleteOne();
    }

    // Generate OTP
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user with pending verification
    const user = new User({
      fullName,
      email,
      password,
      otp,
      otpExpiry,
      isVerified: false,
      isEmailVerified: false,
    });

    await user.save();

    // Send OTP email
    await sendOtpEmail(email, otp);

    return res.status(201).json({
      message: "Signup successful! OTP sent to your email.",
      userId: user._id,
      email: user.email,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      message: "Signup failed. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Verify OTP controller
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email }).select("+otp +otpExpiry");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if OTP is expired
    if (new Date() > user.otpExpiry) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please signup again." });
    }

    // Verify OTP
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark user as verified
    user.isEmailVerified = true;
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    user.lastLogin = new Date();

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.status(200).json({
      message: "Email verified successfully!",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        isVerified: user.isVerified,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({
      message: "OTP verification failed. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Login controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. Please signup first." });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first. Check your inbox for OTP.",
      });
    }

    // Compare password
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        isVerified: user.isVerified,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Login failed. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Forgot Password - Send OTP
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email" });
    }

    // Generate OTP
    const otp = generateOtp();
    const resetPasswordOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpiry = resetPasswordOtpExpiry;

    await user.save();

    // Send OTP email
    await sendPasswordResetEmail(email, otp);

    return res.status(200).json({
      message: "Password reset OTP sent to your email",
      email: user.email,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      message: "Failed to send password reset OTP",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Reset Password - Verify OTP and set new password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findOne({ email }).select(
      "+resetPasswordOtp +resetPasswordOtpExpiry",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if OTP is expired
    if (new Date() > user.resetPasswordOtpExpiry) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Verify OTP
    if (user.resetPasswordOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordOtp = null;
    user.resetPasswordOtpExpiry = null;

    await user.save();

    return res.status(200).json({
      message: "Password reset successfully!",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      message: "Password reset failed. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Resend OTP for email verification
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email, isVerified: false }).select(
      "+otp +otpExpiry",
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found or already verified",
      });
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendOtpEmail(email, otp);

    return res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({
      message: "Failed to resend OTP. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Verify token (for auto-login)
export const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Token verified",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        isVerified: user.isVerified,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Update profile (fullName and/or avatar)
export const updateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { fullName, avatar } = req.body;

    const updateData = {};
    if (fullName && fullName.trim()) updateData.fullName = fullName.trim();
    if (avatar && Number.isInteger(avatar) && avatar >= 1 && avatar <= 10) {
      updateData.avatar = avatar;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const user = await User.findByIdAndUpdate(decoded.userId, updateData, {
      new: true,
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        isVerified: user.isVerified,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      message: "Failed to update profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Request OTP for password update (authenticated)
export const requestPasswordUpdateOtp = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpiry = otpExpiry;
    await user.save();

    await sendOtpEmail(user.email, otp);

    return res.status(200).json({
      message: `OTP sent to ${user.email}`,
      email: user.email,
    });
  } catch (error) {
    console.error("Request password update OTP error:", error);
    return res.status(500).json({
      message: "Failed to send OTP",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Update password with OTP verification (authenticated)
export const updatePassword = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { otp, newPassword, confirmPassword } = req.body;

    if (!otp || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findById(decoded.userId).select(
      "+resetPasswordOtp +resetPasswordOtpExpiry",
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.resetPasswordOtp || !user.resetPasswordOtpExpiry) {
      return res
        .status(400)
        .json({ message: "No OTP requested. Please request OTP first." });
    }

    if (new Date() > user.resetPasswordOtpExpiry) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    if (user.resetPasswordOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.password = newPassword;
    user.resetPasswordOtp = null;
    user.resetPasswordOtpExpiry = null;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("Update password error:", error);
    return res.status(500).json({
      message: "Failed to update password",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

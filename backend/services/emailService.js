import nodemailer from "nodemailer";

// Create a fresh transporter each call — avoids stale cached connections on Railway
const createTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;

  console.log("[Email] Transporter init — USER:", user || "NOT SET", "PASS:", pass ? "set" : "NOT SET");

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // STARTTLS on port 587
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    tls: { rejectUnauthorized: false },
  });
};

// Generate OTP
export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via email
export const sendOtpEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"Team Task Manager" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Email Verification OTP - Team Task Manager",
      html: `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #0F1115; margin-bottom: 20px;">Email Verification</h2>
            <p style="color: #333; font-size: 16px; margin-bottom: 15px;">
              Your OTP for email verification is:
            </p>
            <div style="background-color: #ff6a33; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #ffffff; letter-spacing: 5px;">${otp}</span>
            </div>
            <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
              This OTP will expire in 10 minutes.
            </p>
            <p style="color: #666; font-size: 14px;">
              If you didn't request this, please ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              © 2026 Team Task Manager. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    await createTransporter().sendMail(mailOptions);
    console.log(`✅ OTP email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error("❌ OTP email error:", error.code, error.responseCode, error.message);
    throw error;
  }
};

// Send password reset OTP
export const sendPasswordResetEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"Team Task Manager" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP - Team Task Manager",
      html: `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #0F1115; margin-bottom: 20px;">Password Reset Request</h2>
            <p style="color: #333; font-size: 16px; margin-bottom: 15px;">
              Your OTP for password reset is:
            </p>
            <div style="background-color: #ff6a33; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #ffffff; letter-spacing: 5px;">${otp}</span>
            </div>
            <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
              This OTP will expire in 10 minutes.
            </p>
            <p style="color: #666; font-size: 14px;">
              If you didn't request this, please ignore this email.
            </p>
          </div>
        </div>
      `,
    };

    await createTransporter().sendMail(mailOptions);
    console.log(`✅ Password reset email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Password reset email error:", error.code, error.responseCode, error.message);
    throw error;
  }
};

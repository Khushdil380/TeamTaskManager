// Email service using Resend HTTP API (no SMTP — works on Railway)
// Requires RESEND_API_KEY env var. Get a free key at https://resend.com

const RESEND_API = "https://api.resend.com/emails";

const sendEmail = async ({ to, subject, html }) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY env var is not set");

  const from =
    process.env.EMAIL_FROM || "Team Task Manager <onboarding@resend.dev>";

  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Resend API error ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
};

// Generate OTP
export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via email
export const sendOtpEmail = async (email, otp) => {
  try {
    await sendEmail({
      to: email,
      subject: "Email Verification OTP - Team Task Manager",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px;">
            <h2 style="color: #0F1115; margin-bottom: 20px;">Email Verification</h2>
            <p style="color: #333; font-size: 16px; margin-bottom: 15px;">Your OTP for email verification is:</p>
            <div style="background-color: #ff6a33; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #ffffff; letter-spacing: 5px;">${otp}</span>
            </div>
            <p style="color: #666; font-size: 14px;">This OTP will expire in 10 minutes.</p>
            <p style="color: #666; font-size: 14px;">If you did not request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">2026 Team Task Manager. All rights reserved.</p>
          </div>
        </div>
      `,
    });
    console.log(`OTP email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error("OTP email error:", error.message);
    throw error;
  }
};

// Send password reset OTP
export const sendPasswordResetEmail = async (email, otp) => {
  try {
    await sendEmail({
      to: email,
      subject: "Password Reset OTP - Team Task Manager",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px;">
            <h2 style="color: #0F1115; margin-bottom: 20px;">Password Reset Request</h2>
            <p style="color: #333; font-size: 16px; margin-bottom: 15px;">Your OTP for password reset is:</p>
            <div style="background-color: #ff6a33; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #ffffff; letter-spacing: 5px;">${otp}</span>
            </div>
            <p style="color: #666; font-size: 14px;">This OTP will expire in 10 minutes.</p>
            <p style="color: #666; font-size: 14px;">If you did not request this, please ignore this email.</p>
          </div>
        </div>
      `,
    });
    console.log(`Password reset email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error("Password reset email error:", error.message);
    throw error;
  }
};
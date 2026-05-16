// Email service using Brevo REST API (bypasses Railway SMTP block)
// Requires BREVO_API_KEY env var. Free tier: 300 emails/day, no domain needed.
// Setup: brevo.com -> Senders & IPs -> Add & verify helpteamtaskmanager@gmail.com
//         Then: Developers -> API Keys -> create key -> add as BREVO_API_KEY in Railway

const BREVO_API = "https://api.brevo.com/v3/smtp/email";
const SENDER_EMAIL = process.env.EMAIL_USER || "helpteamtaskmanager@gmail.com";
const SENDER_NAME = "Team Task Manager";

const sendEmail = async ({ to, subject, html }) => {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error("BREVO_API_KEY env var is not set");

  const res = await fetch(BREVO_API, {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Brevo API error ${res.status}: ${JSON.stringify(data)}`);
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
    console.log(`[Brevo] OTP email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("[Brevo] OTP email error:", error.message);
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
    console.log(`[Brevo] Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("[Brevo] Password reset email error:", error.message);
    throw error;
  }
};
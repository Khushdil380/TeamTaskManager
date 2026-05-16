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

// Send welcome email after successful OTP verification
export const sendWelcomeEmail = async (email, fullName) => {
  try {
    await sendEmail({
      to: email,
      subject: `Welcome to Team Task Manager, ${fullName}! 🎉`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f5f5f5;padding:20px;">
          <!-- Header -->
          <div style="background:linear-gradient(135deg,#FF6A33,#ff8c5a);border-radius:12px 12px 0 0;padding:36px 30px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:26px;font-weight:700;letter-spacing:0.5px;">Team Task Manager</h1>
            <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">Collaborate. Organize. Deliver.</p>
          </div>
          <!-- Body -->
          <div style="background:#fff;padding:36px 30px;">
            <h2 style="color:#0F1115;margin:0 0 8px;font-size:22px;">Welcome aboard, ${fullName}! 👋</h2>
            <p style="color:#444;font-size:15px;line-height:1.7;margin:0 0 24px;">
              Your account has been verified successfully. You're now part of a platform built to help teams
              stay aligned, track progress, and get work done — all in one place.
            </p>

            <!-- Getting Started -->
            <div style="background:#fff8f5;border:1px solid #ffe0d4;border-radius:10px;padding:24px;margin-bottom:28px;">
              <h3 style="color:#FF6A33;margin:0 0 18px;font-size:15px;text-transform:uppercase;letter-spacing:1px;">Get Started in 3 Steps</h3>
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:10px 0;vertical-align:top;width:36px;">
                    <div style="background:#FF6A33;color:#fff;width:26px;height:26px;border-radius:50%;text-align:center;line-height:26px;font-size:13px;font-weight:700;">1</div>
                  </td>
                  <td style="padding:10px 0 10px 12px;vertical-align:top;">
                    <strong style="color:#0F1115;font-size:14px;">Create or Join a Project</strong>
                    <p style="color:#666;font-size:13px;margin:4px 0 0;line-height:1.5;">Admins can create projects and invite team members. Members can view and work on assigned projects.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;vertical-align:top;width:36px;">
                    <div style="background:#FF6A33;color:#fff;width:26px;height:26px;border-radius:50%;text-align:center;line-height:26px;font-size:13px;font-weight:700;">2</div>
                  </td>
                  <td style="padding:10px 0 10px 12px;vertical-align:top;">
                    <strong style="color:#0F1115;font-size:14px;">Assign & Track Tasks</strong>
                    <p style="color:#666;font-size:13px;margin:4px 0 0;line-height:1.5;">Break projects into tasks, set priorities and deadlines, and track progress from your personal dashboard.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;vertical-align:top;width:36px;">
                    <div style="background:#FF6A33;color:#fff;width:26px;height:26px;border-radius:50%;text-align:center;line-height:26px;font-size:13px;font-weight:700;">3</div>
                  </td>
                  <td style="padding:10px 0 10px 12px;vertical-align:top;">
                    <strong style="color:#0F1115;font-size:14px;">Collaborate with Your Team</strong>
                    <p style="color:#666;font-size:13px;margin:4px 0 0;line-height:1.5;">Chat inside projects, monitor team workload, and use the calendar to stay ahead of every deadline.</p>
                  </td>
                </tr>
              </table>
            </div>

            <!-- CTA -->
            <div style="text-align:center;margin-bottom:28px;">
              <a href="${process.env.FRONTEND_URL || "https://teamtaskmanager-production-5902.up.railway.app"}"
                 style="background:#FF6A33;color:#fff;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:15px;font-weight:600;display:inline-block;letter-spacing:0.3px;">
                Go to Dashboard →
              </a>
            </div>

            <p style="color:#888;font-size:13px;line-height:1.6;margin:0;">
              If you have any questions or need help getting started, reply to this email or reach out to us at
              <a href="mailto:${SENDER_EMAIL}" style="color:#FF6A33;">${SENDER_EMAIL}</a>.
              We're happy to help.
            </p>
          </div>
          <!-- Footer -->
          <div style="background:#f0f0f0;border-radius:0 0 12px 12px;padding:18px 30px;text-align:center;">
            <p style="color:#aaa;font-size:12px;margin:0;">© 2026 Team Task Manager. All rights reserved.</p>
            <p style="color:#bbb;font-size:11px;margin:6px 0 0;">You received this email because you created an account with us.</p>
          </div>
        </div>
      `,
    });
    console.log(`[Brevo] Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("[Brevo] Welcome email error:", error.message);
    // Welcome email failure is non-critical — don't throw
  }
};

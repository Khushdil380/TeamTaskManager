import { useState } from "react";
import "./ProfileModals.css";
import { getAuthToken } from "../../utils/auth";

const API_URL = import.meta.env.VITE_API_URL;

const STEPS = { FORM: "form", OTP: "otp", DONE: "done" };

const UpdatePasswordModal = ({ user, onClose }) => {
  const [step, setStep] = useState(STEPS.FORM);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRequestOtp = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${API_URL}/api/auth/request-password-update-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");

      setStep(STEPS.OTP);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/update-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ otp: otp.trim(), newPassword, confirmPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update password");

      setStep(STEPS.DONE);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${API_URL}/api/auth/request-password-update-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to resend OTP");

      setOtp("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === STEPS.DONE) {
    return (
      <div className="profile-modal-body profile-modal-done">
        <span className="profile-modal-done-icon">✅</span>
        <p className="profile-modal-done-msg">Password updated successfully!</p>
        <button
          className="profile-modal-save-btn"
          onClick={onClose}
          type="button"
        >
          Close
        </button>
      </div>
    );
  }

  if (step === STEPS.OTP) {
    return (
      <form className="profile-modal-body" onSubmit={handleUpdatePassword}>
        <p className="profile-modal-hint">
          OTP sent to <strong>{user?.email}</strong>. Enter it below to confirm.
        </p>
        <div className="profile-modal-field">
          <label className="profile-modal-label">Enter OTP</label>
          <input
            className="profile-modal-input profile-modal-otp-input"
            type="text"
            inputMode="numeric"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="------"
            autoFocus
            maxLength={6}
          />
        </div>
        {error && <p className="profile-modal-error">{error}</p>}
        <button
          type="submit"
          className="profile-modal-save-btn"
          disabled={loading}
        >
          {loading ? "Updating…" : "Update Password"}
        </button>
        <button
          type="button"
          className="profile-modal-resend-btn"
          onClick={handleResendOtp}
          disabled={loading}
        >
          Resend OTP
        </button>
      </form>
    );
  }

  return (
    <form className="profile-modal-body" onSubmit={handleRequestOtp}>
      <div className="profile-modal-field">
        <label className="profile-modal-label">New Password</label>
        <input
          className="profile-modal-input"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Minimum 6 characters"
          autoFocus
        />
      </div>
      <div className="profile-modal-field">
        <label className="profile-modal-label">Confirm Password</label>
        <input
          className="profile-modal-input"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat new password"
        />
      </div>
      {error && <p className="profile-modal-error">{error}</p>}
      <button
        type="submit"
        className="profile-modal-save-btn"
        disabled={loading}
      >
        {loading ? "Sending OTP…" : "Send OTP to Email"}
      </button>
    </form>
  );
};

export default UpdatePasswordModal;

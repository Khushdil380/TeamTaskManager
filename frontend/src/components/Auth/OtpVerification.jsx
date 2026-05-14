import { useState, useEffect } from "react";
import "./OtpVerification.css";

const OtpVerification = ({ email, onSuccess, onBack }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(600); // 10 minutes
  const [canResend, setCanResend] = useState(false);

  // Timer for OTP expiry
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "OTP verification failed");
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      onSuccess(data.user);
    } catch (err) {
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/resend-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      if (response.ok) {
        setTimer(600);
        setCanResend(false);
      } else {
        const data = await response.json();
        setError(data.message || "Failed to resend OTP");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="otp-verification" onSubmit={handleSubmit}>
      <div className="otp-header">
        <p className="otp-message">
          Enter the OTP sent to <strong>{email}</strong>
        </p>
      </div>

      <div className="form-group">
        <label htmlFor="otp">OTP Code</label>
        <input
          type="text"
          id="otp"
          placeholder="000000"
          maxLength="6"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
          disabled={isLoading}
          className="otp-input"
        />
      </div>

      <div className="otp-timer">
        <span>OTP expires in: </span>
        <strong className={canResend ? "expired" : ""}>
          {formatTime(timer)}
        </strong>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" className="auth-button" disabled={isLoading}>
        {isLoading ? "Verifying..." : "Verify OTP"}
      </button>

      <div className="otp-actions">
        <button
          type="button"
          className="link-button"
          onClick={handleResendOtp}
          disabled={!canResend || isLoading}
        >
          Resend OTP
        </button>
        <button
          type="button"
          className="link-button"
          onClick={onBack}
          disabled={isLoading}
        >
          Back to Signup
        </button>
      </div>
    </form>
  );
};

export default OtpVerification;

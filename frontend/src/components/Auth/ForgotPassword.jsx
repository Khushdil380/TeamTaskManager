import { useState } from "react";
import "./ForgotPassword.css";

const ForgotPassword = ({ onSwitchToLogin, onSwitchToReset }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to send OTP");
        setIsLoading(false);
        return;
      }

      setSuccessMessage("OTP sent to your email!");
      setIsLoading(false);
      setTimeout(() => {
        onSwitchToReset(email);
      }, 1500);
    } catch (err) {
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <form className="auth-form forgot-password-form" onSubmit={handleSubmit}>
      <div className="forgot-header">
        <p className="forgot-message">
          Enter your email to receive a password reset OTP
        </p>
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <button type="submit" className="auth-button" disabled={isLoading}>
        {isLoading ? "Sending OTP..." : "Send OTP"}
      </button>

      <div className="auth-switch">
        <button
          type="button"
          className="link-button"
          onClick={onSwitchToLogin}
          disabled={isLoading}
        >
          Back to Login
        </button>
      </div>
    </form>
  );
};

export default ForgotPassword;

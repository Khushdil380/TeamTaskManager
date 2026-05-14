import { useState } from "react";
import "./LoginForm.css";
import { saveAuthData } from "../../utils/auth";

const LoginForm = ({
  onSwitchToSignup,
  onSwitchToForgotPassword,
  onSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        setIsLoading(false);
        return;
      }

      // Store token and user info
      saveAuthData(data.token, data.user);

      setIsLoading(false);
      onSuccess(data.user);
    } catch (err) {
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <form className="auth-form login-form" onSubmit={handleSubmit}>
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

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" className="auth-button" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>

      <div className="auth-links">
        <button
          type="button"
          className="link-button"
          onClick={onSwitchToForgotPassword}
          disabled={isLoading}
        >
          Forgot Password?
        </button>
      </div>

      <div className="auth-switch">
        <span>Don't have an account? </span>
        <button
          type="button"
          className="link-button"
          onClick={onSwitchToSignup}
          disabled={isLoading}
        >
          Sign Up
        </button>
      </div>
    </form>
  );
};

export default LoginForm;

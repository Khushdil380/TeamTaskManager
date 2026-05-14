import { useState } from "react";
import Modal from "../Modal/Modal";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import OtpVerification from "./OtpVerification";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [currentView, setCurrentView] = useState("login");
  const [signupEmail, setSignupEmail] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");

  const handleLoginSuccess = (user) => {
    onClose();
    onLoginSuccess(user);
  };

  const handleSignupSuccess = () => {
    // After OTP verified, go back to login so user logs in manually
    setCurrentView("login");
  };

  const handleResetSuccess = () => {
    setCurrentView("login");
  };

  const renderContent = () => {
    switch (currentView) {
      case "login":
        return (
          <LoginForm
            onSwitchToSignup={() => setCurrentView("signup")}
            onSwitchToForgotPassword={() => setCurrentView("forgot")}
            onSuccess={handleLoginSuccess}
          />
        );
      case "signup":
        return (
          <SignupForm
            onSwitchToLogin={() => setCurrentView("login")}
            onSwitchToOtpVerification={(email) => {
              setSignupEmail(email);
              setCurrentView("otp");
            }}
          />
        );
      case "otp":
        return (
          <OtpVerification
            email={signupEmail}
            onSuccess={handleSignupSuccess}
            onBack={() => setCurrentView("signup")}
          />
        );
      case "forgot":
        return (
          <ForgotPassword
            onSwitchToLogin={() => setCurrentView("login")}
            onSwitchToReset={(email) => {
              setForgotEmail(email);
              setCurrentView("reset");
            }}
          />
        );
      case "reset":
        return (
          <ResetPassword
            email={forgotEmail}
            onSwitchToLogin={() => setCurrentView("login")}
            onSuccess={handleResetSuccess}
          />
        );
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (currentView) {
      case "login":
        return "Login";
      case "signup":
        return "Sign Up";
      case "otp":
        return "Verify Email";
      case "forgot":
        return "Reset Password";
      case "reset":
        return "Set New Password";
      default:
        return "Authentication";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getModalTitle()}
      size="medium"
    >
      {renderContent()}
    </Modal>
  );
};

export default AuthModal;

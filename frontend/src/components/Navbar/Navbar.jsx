import { useState, useRef, useEffect } from "react";
import "./Navbar.css";
import logo from "../../assets/logo.svg";

const Navbar = () => {
  const [helpOpen, setHelpOpen] = useState(false);
  const helpRef = useRef(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (helpRef.current && !helpRef.current.contains(e.target)) {
        setHelpOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo and Brand Name */}
        <div className="navbar-logo">
          <img src={logo} alt="Team Task Manager" className="navbar-logo-img" />
          <span className="navbar-brand">Team Task Manager</span>
        </div>

        {/* Right Side Navigation */}
        <div className="navbar-right">
          {/* Help icon with popover */}
          <div
            className={`help-btn-wrap${helpOpen ? " help-open" : ""}`}
            ref={helpRef}
            onMouseEnter={() => setHelpOpen(true)}
            onMouseLeave={() => setHelpOpen(false)}
          >
            <button
              className="help-btn"
              aria-label="Help"
              onClick={() => setHelpOpen((v) => !v)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span className="help-btn-label">Help</span>
            </button>

            {/* Popover */}
            <div className="help-popover" role="tooltip">
              <div className="help-popover-arrow" />
              <p className="help-popover-title">Need help?</p>
              <p className="help-popover-body">
                Send us an email and we&apos;ll get back to you as soon as
                possible.
              </p>
              <a
                href="mailto:helpteamtaskmanager@gmail.com"
                className="help-popover-email"
              >
                helpteamtaskmanager@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import { useState, useRef, useEffect } from "react";
import "./DashboardNavbar.css";
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";
import { ROLE_LABEL } from "../../utils/dashboardConfig";
import { getInitials } from "../../utils/helpers";
import { getAvatarById } from "../../utils/avatarConfig";

const DashboardNavbar = ({
  user,
  role,
  onRoleSwitch,
  onLogout,
  onMenuToggle,
  onOpenModal,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <header className="dash-navbar">
      <div className="dash-navbar-left">
        <button
          className="dash-menu-btn"
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
        <span className="dash-navbar-brand">Team Task Manager</span>
      </div>

      <div className="dash-navbar-search">
        <div className="dash-search-wrapper">
          <svg
            className="dash-search-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            className="dash-search-input"
            placeholder="Search projects, members, tasks..."
            aria-label="Search"
          />
        </div>
      </div>

      <div className="dash-navbar-right" ref={profileRef}>
        <span className="dash-role-badge">{ROLE_LABEL[role]}</span>
        <button
          className="dash-avatar-btn"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          aria-label="Profile menu"
          style={{ background: getAvatarById(user?.avatar).bg }}
        >
          {getInitials(user?.fullName)}
        </button>
        {isDropdownOpen && (
          <ProfileDropdown
            user={user}
            role={role}
            onRoleSwitch={(newRole) => {
              onRoleSwitch(newRole);
              setIsDropdownOpen(false);
            }}
            onLogout={onLogout}
            onClose={() => setIsDropdownOpen(false)}
            onOpenModal={onOpenModal}
          />
        )}
      </div>
    </header>
  );
};

export default DashboardNavbar;

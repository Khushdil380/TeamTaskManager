import "./ProfileDropdown.css";
import { ROLES, ROLE_LABEL } from "../../utils/dashboardConfig";
import { getInitials } from "../../utils/helpers";

const ProfileDropdown = ({ user, role, onRoleSwitch, onLogout, onClose }) => {
  const targetRole = role === ROLES.ADMIN ? ROLES.MEMBER : ROLES.ADMIN;

  return (
    <div className="profile-dropdown">
      {/* User info header */}
      <div className="profile-dropdown-header">
        <div className="profile-dropdown-avatar">
          {getInitials(user?.fullName)}
        </div>
        <div className="profile-dropdown-info">
          <span className="profile-dropdown-name">{user?.fullName}</span>
          <span className="profile-dropdown-email">{user?.email}</span>
        </div>
      </div>

      <div className="profile-dropdown-divider" />

      {/* Account actions */}
      <button className="profile-dropdown-item" onClick={onClose}>
        <span className="profile-dropdown-item-icon">🖼️</span>
        Update Avatar
        <span className="profile-dropdown-badge">Soon</span>
      </button>
      <button className="profile-dropdown-item" onClick={onClose}>
        <span className="profile-dropdown-item-icon">✏️</span>
        Edit Name
        <span className="profile-dropdown-badge">Soon</span>
      </button>
      <button className="profile-dropdown-item" onClick={onClose}>
        <span className="profile-dropdown-item-icon">🔒</span>
        Update Password
        <span className="profile-dropdown-badge">Soon</span>
      </button>

      <div className="profile-dropdown-divider" />

      {/* Role switch */}
      <button
        className="profile-dropdown-item profile-dropdown-role"
        onClick={() => onRoleSwitch(targetRole)}
      >
        <span className="profile-dropdown-item-icon">🔄</span>
        Switch to{" "}
        <strong className="profile-dropdown-role-name">
          {ROLE_LABEL[targetRole]}
        </strong>
      </button>

      <div className="profile-dropdown-divider" />

      {/* Logout */}
      <button
        className="profile-dropdown-item profile-dropdown-logout"
        onClick={onLogout}
      >
        <span className="profile-dropdown-item-icon">🚪</span>
        Logout
      </button>
    </div>
  );
};

export default ProfileDropdown;

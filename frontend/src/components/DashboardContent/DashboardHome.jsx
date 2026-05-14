import { ROLE_LABEL } from "../../utils/dashboardConfig";

const DashboardHome = ({ user, role }) => (
  <div className="dash-home">
    <div className="dash-home-header">
      <h1 className="dash-home-title">
        Welcome back,{" "}
        <span className="dash-home-name">
          {user?.fullName?.split(" ")[0]} 👋
        </span>
      </h1>
      <p className="dash-home-subtitle">
        Viewing as <strong>{ROLE_LABEL[role]}</strong>
      </p>
    </div>

    <div className="dash-stats-grid">
      <div className="dash-stat-card">
        <span className="dash-stat-icon">📋</span>
        <div>
          <p className="dash-stat-value">0</p>
          <p className="dash-stat-label">My Tasks</p>
        </div>
      </div>
      <div className="dash-stat-card">
        <span className="dash-stat-icon">📁</span>
        <div>
          <p className="dash-stat-value">0</p>
          <p className="dash-stat-label">Projects</p>
        </div>
      </div>
      <div className="dash-stat-card">
        <span className="dash-stat-icon">👥</span>
        <div>
          <p className="dash-stat-value">0</p>
          <p className="dash-stat-label">Team Members</p>
        </div>
      </div>
      <div className="dash-stat-card">
        <span className="dash-stat-icon">✅</span>
        <div>
          <p className="dash-stat-value">0</p>
          <p className="dash-stat-label">Completed</p>
        </div>
      </div>
    </div>

    <div className="dash-notice">
      <p>🚧 Dashboard overview coming in the next phase.</p>
    </div>
  </div>
);

export default DashboardHome;

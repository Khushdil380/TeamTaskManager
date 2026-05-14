const DashboardHome = ({ user }) => (
  <div className="dash-home">
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

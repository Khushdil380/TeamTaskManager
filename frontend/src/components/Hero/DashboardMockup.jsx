import "./DashboardMockup.css";
import TaskCard from "./TaskCard";
import ActivityFeed from "./ActivityFeed";

const DashboardMockup = () => {
  return (
    <div className="dashboard-mockup">
      <div className="mockup-glass-container">
        {/* Header */}
        <div className="mockup-header">
          <div className="mockup-title">Dashboard</div>
          <div className="mockup-actions">
            <div className="action-dot"></div>
            <div className="action-dot"></div>
            <div className="action-dot"></div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="mockup-content">
          {/* Left Column - Stats and Progress */}
          <div className="mockup-column left">
            {/* Progress Bar */}
            <div className="progress-card">
              <div className="progress-label">Project Progress</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "72%" }}></div>
              </div>
              <div className="progress-text">72% Complete</div>
            </div>

            {/* Task Stats */}
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">24</div>
                <div className="stat-label">Tasks</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">8</div>
                <div className="stat-label">In Progress</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">16</div>
                <div className="stat-label">Completed</div>
              </div>
            </div>

            {/* Team Avatars */}
            <div className="team-section">
              <div className="team-label">Team Members</div>
              <div className="team-avatars">
                <div className="avatar avatar-1">KA</div>
                <div className="avatar avatar-2">SJ</div>
                <div className="avatar avatar-3">MR</div>
                <div className="avatar avatar-4">+2</div>
              </div>
            </div>
          </div>

          {/* Right Column - Tasks */}
          <div className="mockup-column right">
            <div className="tasks-title">Active Tasks</div>
            <TaskCard
              title="Design UI Components"
              priority="High"
              dueDate="Today"
            />
            <TaskCard
              title="API Integration"
              priority="Medium"
              dueDate="Tomorrow"
            />
            <TaskCard title="Database Setup" priority="High" dueDate="In 2 days" />
          </div>
        </div>

        {/* Activity Feed Bottom */}
        <ActivityFeed />
      </div>

      {/* Floating Cards for Depth */}
      <div className="floating-card card-1">
        <div className="card-icon">📊</div>
        <div className="card-text">Analytics</div>
      </div>
      <div className="floating-card card-2">
        <div className="card-icon">✓</div>
        <div className="card-text">Completed</div>
      </div>
      <div className="floating-card card-3">
        <div className="card-icon">🎯</div>
        <div className="card-text">Goals</div>
      </div>
    </div>
  );
};

export default DashboardMockup;

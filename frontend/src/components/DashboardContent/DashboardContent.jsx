import "./DashboardContent.css";
import {
  MEMBER_NAV_ITEMS,
  ADMIN_NAV_ITEMS,
  ROLE_LABEL,
} from "../../utils/dashboardConfig";

// Derive label for any tab id from nav config
const ALL_NAV_ITEMS = [
  ...new Map(
    [...MEMBER_NAV_ITEMS, ...ADMIN_NAV_ITEMS].map((item) => [item.id, item]),
  ).values(),
];

const getTabLabel = (id) =>
  ALL_NAV_ITEMS.find((item) => item.id === id)?.label || id;

// Default dashboard overview
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

// Placeholder for all other tabs
const ComingSoon = ({ tabId }) => (
  <div className="dash-coming-soon">
    <div className="dash-coming-soon-card">
      <span className="dash-coming-soon-icon">🚧</span>
      <h2>{getTabLabel(tabId)}</h2>
      <p>
        This section is under construction and will be available in the next
        phase.
      </p>
    </div>
  </div>
);

const DashboardContent = ({ activeTab, user, role }) => (
  <main className="dash-content">
    {activeTab === "dashboard" ? (
      <DashboardHome user={user} role={role} />
    ) : (
      <ComingSoon tabId={activeTab} />
    )}
  </main>
);

export default DashboardContent;

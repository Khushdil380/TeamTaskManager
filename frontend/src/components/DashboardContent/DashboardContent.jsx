import "./DashboardContent.css";
import DashboardHome from "./DashboardHome";
import ComingSoon from "./ComingSoon";

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

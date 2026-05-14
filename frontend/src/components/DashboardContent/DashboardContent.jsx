import "./DashboardContent.css";
import DashboardHome from "./DashboardHome";
import ComingSoon from "./ComingSoon";
import ManageUsers from "../ManageUsers/ManageUsers";

const DashboardContent = ({ activeTab, user, role }) => (
  <main
    className={`dash-content${
      activeTab === "manage-users" ? " dash-content--full" : ""
    }`}
  >
    {activeTab === "dashboard" ? (
      <DashboardHome user={user} />
    ) : activeTab === "manage-users" ? (
      <ManageUsers />
    ) : (
      <ComingSoon tabId={activeTab} />
    )}
  </main>
);

export default DashboardContent;

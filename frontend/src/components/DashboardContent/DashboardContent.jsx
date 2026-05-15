import "./DashboardContent.css";
import DashboardHome from "./DashboardHome";
import ComingSoon from "./ComingSoon";
import ManageUsers from "../ManageUsers/ManageUsers";
import Projects from "../Projects/Projects";

const FULL_TABS = ["manage-users", "projects"];

const DashboardContent = ({ activeTab, user, role, searchQuery }) => (
  <main
    className={`dash-content${
      FULL_TABS.includes(activeTab) ? " dash-content--full" : ""
    }`}
  >
    {activeTab === "dashboard" ? (
      <DashboardHome user={user} />
    ) : activeTab === "manage-users" ? (
      <ManageUsers searchQuery={searchQuery} />
    ) : activeTab === "projects" ? (
      <Projects searchQuery={searchQuery} />
    ) : (
      <ComingSoon tabId={activeTab} />
    )}
  </main>
);

export default DashboardContent;

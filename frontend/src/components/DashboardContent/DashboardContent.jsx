import "./DashboardContent.css";
import DashboardHome from "./DashboardHome";
import ComingSoon from "./ComingSoon";
import ManageUsers from "../ManageUsers/ManageUsers";
import Projects from "../Projects/Projects";
import TeamMembers from "../TeamMembers/TeamMembers";
import MyTasks from "../MyTasks/MyTasks";
import Calendar from "../Calendar/Calendar";

const FULL_TABS = ["manage-users", "projects", "members"];

const DashboardContent = ({ activeTab, user, role, searchQuery }) => (
  <main
    className={`dash-content${
      FULL_TABS.includes(activeTab) ? " dash-content--full" : ""
    }`}
  >
    {activeTab === "dashboard" ? (
      <DashboardHome user={user} role={role} />
    ) : activeTab === "manage-users" ? (
      <ManageUsers searchQuery={searchQuery} />
    ) : activeTab === "projects" ? (
      <Projects searchQuery={searchQuery} user={user} role={role} />
    ) : activeTab === "members" ? (
      <TeamMembers searchQuery={searchQuery} role={role} user={user} />
    ) : activeTab === "my-tasks" && role !== "admin" ? (
      <MyTasks user={user} />
    ) : activeTab === "calendar" ? (
      <Calendar role={role} />
    ) : (
      <ComingSoon tabId={activeTab} />
    )}
  </main>
);

export default DashboardContent;

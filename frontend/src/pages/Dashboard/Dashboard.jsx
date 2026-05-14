import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { getAuthToken, getAuthUser, clearAuthData } from "../../utils/auth";
import { getUserRole, setUserRole, ROLES } from "../../utils/dashboardConfig";
import DashboardNavbar from "../../components/DashboardNavbar/DashboardNavbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import DashboardContent from "../../components/DashboardContent/DashboardContent";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(ROLES.MEMBER);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    const userData = getAuthUser();
    if (!token || !userData) {
      navigate("/");
      return;
    }
    setUser(userData);
    setRole(getUserRole());
  }, [navigate]);

  const handleRoleSwitch = (newRole) => {
    setUserRole(newRole);
    setRole(newRole);
    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    clearAuthData();
    navigate("/");
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsSidebarOpen(false);
  };

  if (!user) return null;

  return (
    <div className="dashboard">
      <DashboardNavbar
        user={user}
        role={role}
        onRoleSwitch={handleRoleSwitch}
        onLogout={handleLogout}
        onMenuToggle={() => setIsSidebarOpen((prev) => !prev)}
      />
      <div className="dashboard-body">
        <Sidebar
          role={role}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <DashboardContent activeTab={activeTab} user={user} role={role} />
      </div>
    </div>
  );
};

export default Dashboard;

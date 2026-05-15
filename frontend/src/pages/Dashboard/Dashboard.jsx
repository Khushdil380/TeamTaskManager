import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { getAuthToken, getAuthUser, clearAuthData } from "../../utils/auth";
import { getUserRole, setUserRole, ROLES } from "../../utils/dashboardConfig";
import DashboardNavbar from "../../components/DashboardNavbar/DashboardNavbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import DashboardContent from "../../components/DashboardContent/DashboardContent";
import Modal from "../../components/Modal/Modal";
import AvatarModal from "../../components/ProfileModals/AvatarModal";
import EditNameModal from "../../components/ProfileModals/EditNameModal";
import UpdatePasswordModal from "../../components/ProfileModals/UpdatePasswordModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(ROLES.MEMBER);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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
    setSearchQuery("");
    setIsSidebarOpen(false);
  };

  const handleUserUpdate = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const closeModal = () => setActiveModal(null);

  if (!user) return null;

  return (
    <div className="dashboard">
      <DashboardNavbar
        user={user}
        role={role}
        activeTab={activeTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRoleSwitch={handleRoleSwitch}
        onLogout={handleLogout}
        onMenuToggle={() => setIsSidebarOpen((prev) => !prev)}
        onOpenModal={setActiveModal}
      />
      <div className="dashboard-body">
        <Sidebar
          role={role}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <DashboardContent
          activeTab={activeTab}
          user={user}
          role={role}
          searchQuery={searchQuery}
        />
      </div>

      <Modal
        isOpen={activeModal === "avatar"}
        onClose={closeModal}
        title="Update Avatar"
        size="medium"
      >
        <AvatarModal
          user={user}
          onClose={closeModal}
          onUpdate={handleUserUpdate}
        />
      </Modal>

      <Modal
        isOpen={activeModal === "edit-name"}
        onClose={closeModal}
        title="Edit Name"
        size="medium"
      >
        <EditNameModal
          user={user}
          onClose={closeModal}
          onUpdate={handleUserUpdate}
        />
      </Modal>

      <Modal
        isOpen={activeModal === "update-password"}
        onClose={closeModal}
        title="Update Password"
        size="medium"
      >
        <UpdatePasswordModal user={user} onClose={closeModal} />
      </Modal>
    </div>
  );
};

export default Dashboard;

import "./Sidebar.css";
import {
  MEMBER_NAV_ITEMS,
  ADMIN_NAV_ITEMS,
  ROLES,
} from "../../utils/dashboardConfig";

const Sidebar = ({ role, activeTab, onTabChange, isOpen, onClose }) => {
  const navItems = role === ROLES.ADMIN ? ADMIN_NAV_ITEMS : MEMBER_NAV_ITEMS;

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside className={`dash-sidebar ${isOpen ? "is-open" : ""}`}>
        <nav className="dash-sidebar-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`dash-nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => onTabChange(item.id)}
              aria-current={activeTab === item.id ? "page" : undefined}
            >
              <span className="dash-nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="dash-nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

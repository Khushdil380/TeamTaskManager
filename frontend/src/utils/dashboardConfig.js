// DASHBOARD CONFIGURATION — roles, nav items, role storage

export const ROLES = {
  MEMBER: "member",
  ADMIN: "admin",
};

export const ROLE_LABEL = {
  member: "Member",
  admin: "Admin",
};

const USER_ROLE_KEY = "userRole";

export const getUserRole = () =>
  localStorage.getItem(USER_ROLE_KEY) || ROLES.MEMBER;

export const setUserRole = (role) => localStorage.setItem(USER_ROLE_KEY, role);

export const MEMBER_NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "my-tasks", label: "My Tasks", icon: "✅" },
  { id: "projects", label: "Projects", icon: "📁" },
  { id: "calendar", label: "Calendar", icon: "📅" },
  { id: "members", label: "Team Members", icon: "👥" },
];

export const ADMIN_NAV_ITEMS = [
  ...MEMBER_NAV_ITEMS,
  { id: "chats", label: "Project Chats", icon: "💬" },
  { id: "manage-users", label: "Manage Users", icon: "⚙️" },
  { id: "reports", label: "Reports", icon: "📈" },
  { id: "settings", label: "Settings", icon: "🔧" },
];

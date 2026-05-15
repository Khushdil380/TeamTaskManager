import { useState, useEffect } from "react";
import "./DashboardHome.css";
import { getAuthToken } from "../../utils/auth";
import { ROLES } from "../../utils/dashboardConfig";
import AdminDashboard from "./AdminDashboard";
import MemberDashboard from "./MemberDashboard";

const API_URL = import.meta.env.VITE_API_URL;

const DashboardHome = ({ user, role }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const view = role === ROLES.ADMIN ? "admin" : "member";
      const res = await fetch(`${API_URL}/api/dashboard/stats?view=${view}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to load");
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [role]);

  if (loading) {
    return (
      <div className="dh-page">
        <div className="dh-loading">
          <div className="dh-spinner" />
          <p>Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dh-page">
        <div className="dh-error">
          <span>⚠️</span>
          <p>{error}</p>
          <button className="dh-refresh-btn" onClick={fetchStats}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return role === ROLES.ADMIN ? (
    <AdminDashboard data={data} user={user} onRefresh={fetchStats} />
  ) : (
    <MemberDashboard data={data} user={user} onRefresh={fetchStats} />
  );
};

export default DashboardHome;

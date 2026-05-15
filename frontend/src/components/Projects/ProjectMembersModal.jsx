import { useState, useEffect } from "react";
import "./Projects.css";
import { getAuthToken } from "../../utils/auth";
import { getAvatarById } from "../../utils/avatarConfig";

const API_URL = import.meta.env.VITE_API_URL;

const ProjectMembersModal = ({ project, onProjectUpdated }) => {
  const [orgMembers, setOrgMembers] = useState([]);
  const [loadingOrg, setLoadingOrg] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null); // userId being processed
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrgMembers();
  }, []);

  const fetchOrgMembers = async () => {
    setLoadingOrg(true);
    try {
      const res = await fetch(`${API_URL}/api/team/members`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      const data = await res.json();
      if (res.ok) setOrgMembers(data.members || []);
    } catch {
      // silent
    } finally {
      setLoadingOrg(false);
    }
  };

  // memberId from team response is a plain userId string
  const isInProject = (userId) =>
    (project.members || []).some(
      (m) => (m._id || m).toString() === userId.toString(),
    );

  const handleAdd = async (member) => {
    setActionLoading(member.memberId);
    setError("");
    try {
      const res = await fetch(
        `${API_URL}/api/projects/${project._id}/members`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify({ email: member.email }),
        },
      );
      const data = await res.json();
      if (!res.ok) setError(data.message);
      else onProjectUpdated(data.project);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemove = async (userId) => {
    setActionLoading(userId);
    setError("");
    try {
      const res = await fetch(
        `${API_URL}/api/projects/${project._id}/members/${userId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getAuthToken()}` },
        },
      );
      const data = await res.json();
      if (!res.ok) setError(data.message);
      else onProjectUpdated(data.project);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = search.trim()
    ? orgMembers
        .filter((m) => {
          const q = search.toLowerCase();
          return (
            m.fullName.toLowerCase().includes(q) ||
            m.email.toLowerCase().includes(q)
          );
        })
        .slice(0, 5)
    : [];

  return (
    <div className="pmm-body">
      {/* Search organisation members */}
      <input
        className="pmm-input"
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setError("");
        }}
        placeholder="Type a name or email to search…"
        autoFocus
      />

      {error && <p className="pmm-error">{error}</p>}

      {loadingOrg ? (
        <p className="pmm-no-members">Loading…</p>
      ) : !search.trim() ? (
        <p className="pmm-no-members">Start typing to find members.</p>
      ) : filtered.length === 0 ? (
        <p className="pmm-no-members">No matches for "{search}"</p>
      ) : (
        <div className="pmm-members-list">
          {filtered.map((m) => {
            const inProject = isInProject(m.memberId);
            const loading =
              actionLoading !== null &&
              actionLoading.toString() === m.memberId.toString();
            const av = getAvatarById(m.avatar);
            return (
              <div key={m._id} className="pmm-member-row">
                <div className="pmm-avatar" style={{ background: av.bg }}>
                  {av.icon}
                </div>
                <div className="pmm-member-info">
                  <div className="pmm-member-name">{m.fullName}</div>
                  <div className="pmm-member-email">{m.email}</div>
                </div>
                {inProject ? (
                  <button
                    className="pmm-remove-btn"
                    onClick={() => handleRemove(m.memberId)}
                    disabled={loading}
                    type="button"
                  >
                    {loading ? "…" : "Remove"}
                  </button>
                ) : (
                  <button
                    className="pmm-add-btn"
                    onClick={() => handleAdd(m)}
                    disabled={loading}
                    type="button"
                  >
                    {loading ? "…" : "Add"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectMembersModal;

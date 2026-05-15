import { useState } from "react";
import "./Projects.css";
import { getAuthToken } from "../../utils/auth";
import { getAvatarById } from "../../utils/avatarConfig";

const API_URL = import.meta.env.VITE_API_URL;

const ProjectMembersModal = ({ project, onProjectUpdated }) => {
  const [email, setEmail] = useState("");
  const [verifyStatus, setVerifyStatus] = useState("idle"); // idle|loading|found|error
  const [foundUser, setFoundUser] = useState(null);
  const [verifyError, setVerifyError] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (verifyStatus !== "idle") {
      setVerifyStatus("idle");
      setFoundUser(null);
      setVerifyError("");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setVerifyStatus("loading");
    setVerifyError("");
    setFoundUser(null);

    try {
      const res = await fetch(
        `${API_URL}/api/projects/check-user?email=${encodeURIComponent(email.trim())}`,
        { headers: { Authorization: `Bearer ${getAuthToken()}` } },
      );
      const data = await res.json();
      if (!res.ok) {
        setVerifyError(data.message);
        setVerifyStatus("error");
      } else {
        setFoundUser(data);
        setVerifyStatus("found");
      }
    } catch {
      setVerifyError("Network error. Please try again.");
      setVerifyStatus("error");
    }
  };

  const handleAdd = async () => {
    setAddLoading(true);
    setVerifyError("");
    try {
      const res = await fetch(
        `${API_URL}/api/projects/${project._id}/members`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify({ email: email.trim() }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setVerifyError(data.message);
      } else {
        onProjectUpdated(data.project);
        setEmail("");
        setVerifyStatus("idle");
        setFoundUser(null);
      }
    } catch {
      setVerifyError("Network error. Please try again.");
    } finally {
      setAddLoading(false);
    }
  };

  const handleRemove = async (userId) => {
    try {
      const res = await fetch(
        `${API_URL}/api/projects/${project._id}/members/${userId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getAuthToken()}` },
        },
      );
      const data = await res.json();
      if (res.ok) {
        onProjectUpdated(data.project);
      }
    } catch {
      // silent — optimistic update not needed, list stays intact
    }
  };

  const currentMembers = project.members || [];

  return (
    <div className="pmm-body">
      {/* Add by email */}
      <form className="pmm-add-form" onSubmit={handleVerify}>
        <div className="pmm-add-row">
          <input
            className="pmm-input"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="member@example.com"
            autoFocus
            disabled={verifyStatus === "loading"}
          />
          <button
            type="submit"
            className="pmm-verify-btn"
            disabled={!email.trim() || verifyStatus === "loading"}
          >
            {verifyStatus === "loading" ? "Checking…" : "Verify"}
          </button>
        </div>

        {verifyStatus === "found" && foundUser && (
          <div className="pmm-found">
            <div
              className="pmm-avatar"
              style={{ background: getAvatarById(foundUser.avatar).bg }}
            >
              {getAvatarById(foundUser.avatar).icon}
            </div>
            <div className="pmm-found-info">
              <span className="pmm-found-name">{foundUser.fullName}</span>
              <span className="pmm-found-email">{foundUser.email}</span>
            </div>
            <button
              type="button"
              className="pmm-add-btn"
              onClick={handleAdd}
              disabled={addLoading}
            >
              {addLoading ? "Adding…" : "Add"}
            </button>
          </div>
        )}

        {verifyError && <p className="pmm-error">{verifyError}</p>}
      </form>

      {/* Current members list */}
      {currentMembers.length > 0 && (
        <>
          <div className="pmm-divider" />
          <span className="pmm-members-title">
            Current Members ({currentMembers.length})
          </span>
          <div className="pmm-members-list">
            {currentMembers.map((m) => (
              <div key={m._id} className="pmm-member-row">
                <div
                  className="pmm-avatar"
                  style={{ background: getAvatarById(m.avatar).bg }}
                >
                  {getAvatarById(m.avatar).icon}
                </div>
                <div className="pmm-member-info">
                  <div className="pmm-member-name">{m.fullName}</div>
                  <div className="pmm-member-email">{m.email}</div>
                </div>
                <button
                  className="pmm-remove-btn"
                  onClick={() => handleRemove(m._id)}
                  title="Remove from project"
                  type="button"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {currentMembers.length === 0 && (
        <p className="pmm-no-members">No members added yet.</p>
      )}
    </div>
  );
};

export default ProjectMembersModal;

import { useState, useEffect, useRef } from "react";
import "./ManageUsers.css";
import Modal from "../Modal/Modal";
import AddMemberModal from "./AddMemberModal";
import { getAuthToken } from "../../utils/auth";
import { getAvatarById } from "../../utils/avatarConfig";

const API_URL = import.meta.env.VITE_API_URL;

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const ManageUsers = ({ searchQuery = "" }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/team/members`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load members");
      setMembers(data.members);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMemberAdded = (member) => {
    setMembers((prev) => [member, ...prev]);
  };

  const handleDelete = async (id) => {
    setMembers((prev) => prev.filter((m) => m._id !== id));
    try {
      const res = await fetch(`${API_URL}/api/team/members/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      if (!res.ok) {
        fetchMembers();
      }
    } catch {
      fetchMembers();
    }
  };

  const handlePriorityChange = async (id, priority) => {
    setMembers((prev) =>
      prev.map((m) => (m._id === id ? { ...m, priority } : m)),
    );
    try {
      await fetch(`${API_URL}/api/team/members/${id}/priority`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ priority }),
      });
    } catch {
      fetchMembers();
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    const emails = text
      .split(/[,\n\r]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await fetch(`${API_URL}/api/team/bulk-add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ emails }),
      });
      const data = await res.json();
      setBulkResult(data.results);
      if (data.results?.added?.length > 0) {
        fetchMembers();
      }
    } catch {
      setBulkResult({ added: [], notFound: emails, alreadyAdded: [] });
    }

    e.target.value = "";
  };

  const filtered = members.filter(
    (m) =>
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="manage-users">
      {/* Toolbar */}
      <div className="mu-toolbar">
        <div className="mu-toolbar-left">
          <span className="mu-count">
            {members.length} member{members.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="mu-toolbar-right">
          <button
            className="mu-action-btn mu-add-btn"
            onClick={() => setShowAddModal(true)}
            title="Add member"
          >
            <span>+</span>
            <span className="mu-btn-label">Add Member</span>
          </button>
          <button
            className="mu-action-btn mu-upload-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Bulk import from .txt (emails separated by commas)"
          >
            <span>📤</span>
            <span className="mu-btn-label">Import</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt"
            className="mu-file-input"
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {/* Bulk result banner */}
      {bulkResult && (
        <div className="mu-bulk-result">
          <div className="mu-bulk-result-content">
            {bulkResult.added?.length > 0 && (
              <span className="mu-bulk-added">
                ✅ {bulkResult.added.length} added
              </span>
            )}
            {bulkResult.alreadyAdded?.length > 0 && (
              <span className="mu-bulk-warn">
                ⚠️ {bulkResult.alreadyAdded.length} already in team
              </span>
            )}
            {bulkResult.notFound?.length > 0 && (
              <span className="mu-bulk-error">
                ❌ {bulkResult.notFound.length} not found
              </span>
            )}
          </div>
          <button className="mu-bulk-close" onClick={() => setBulkResult(null)}>
            ✕
          </button>
        </div>
      )}

      {/* Member list */}
      <div className="mu-list-wrapper">
        {loading ? (
          <div className="mu-state-msg">Loading members…</div>
        ) : error ? (
          <div className="mu-state-msg mu-state-error">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="mu-empty">
            {members.length === 0 ? (
              <>
                <span className="mu-empty-icon">👥</span>
                <p>No members yet. Add your first team member.</p>
              </>
            ) : (
              <>
                <span className="mu-empty-icon">🔍</span>
                <p>No results for &ldquo;{searchQuery}&rdquo;</p>
              </>
            )}
          </div>
        ) : (
          <table className="mu-table">
            <thead>
              <tr>
                <th className="mu-th">Full Name</th>
                <th className="mu-th">Email</th>
                <th className="mu-th">Added Date</th>
                <th className="mu-th">Priority</th>
                <th className="mu-th mu-th-action"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m._id} className="mu-row">
                  <td className="mu-td">
                    <div className="mu-member-info">
                      <div
                        className="mu-avatar"
                        style={{ background: getAvatarById(m.avatar).bg }}
                      >
                        {getAvatarById(m.avatar).icon}
                      </div>
                      <span className="mu-member-name">{m.fullName}</span>
                    </div>
                  </td>
                  <td className="mu-td mu-td-email">{m.email}</td>
                  <td className="mu-td mu-td-date">{formatDate(m.addedAt)}</td>
                  <td className="mu-td">
                    <select
                      className={`mu-priority-select mu-priority-${m.priority}`}
                      value={m.priority}
                      onChange={(e) =>
                        handlePriorityChange(m._id, e.target.value)
                      }
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </td>
                  <td className="mu-td mu-td-action">
                    <button
                      className="mu-delete-btn"
                      onClick={() => handleDelete(m._id)}
                      title="Remove member"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Member Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Team Member"
        size="medium"
      >
        <AddMemberModal
          onClose={() => setShowAddModal(false)}
          onAdded={handleMemberAdded}
        />
      </Modal>
    </div>
  );
};

export default ManageUsers;

import { useState } from "react";
import "./ManageUsers.css";
import { getAuthToken } from "../../utils/auth";

const API_URL = import.meta.env.VITE_API_URL;

const AddMemberModal = ({ onClose, onAdded }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | found | error
  const [foundUser, setFoundUser] = useState(null);
  const [error, setError] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setError("");
    setFoundUser(null);

    try {
      const res = await fetch(
        `${API_URL}/api/team/check-user?email=${encodeURIComponent(email.trim())}`,
        { headers: { Authorization: `Bearer ${getAuthToken()}` } },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
        setStatus("error");
      } else {
        setFoundUser(data);
        setStatus("found");
      }
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  };

  const handleAdd = async () => {
    setAddLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/team/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
      } else {
        onAdded(data.member);
        onClose();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setAddLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (status !== "idle") {
      setStatus("idle");
      setFoundUser(null);
      setError("");
    }
  };

  return (
    <div className="add-member-modal">
      <form onSubmit={handleVerify} className="add-member-form">
        <div className="add-member-field">
          <label className="add-member-label">Email Address</label>
          <div className="add-member-input-row">
            <input
              className="add-member-input"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="member@example.com"
              autoFocus
              disabled={status === "loading"}
            />
            <button
              type="submit"
              className="add-member-verify-btn"
              disabled={!email.trim() || status === "loading"}
            >
              {status === "loading" ? "Checking…" : "Verify"}
            </button>
          </div>
        </div>
      </form>

      {status === "found" && foundUser && (
        <div className="add-member-found">
          <span className="add-member-found-icon">✅</span>
          <div className="add-member-found-info">
            <span className="add-member-found-name">{foundUser.fullName}</span>
            <span className="add-member-found-email">{foundUser.email}</span>
          </div>
          <button
            className="add-member-add-btn"
            onClick={handleAdd}
            disabled={addLoading}
            type="button"
          >
            {addLoading ? "Adding…" : "Add"}
          </button>
        </div>
      )}

      {error && <p className="add-member-error">{error}</p>}
    </div>
  );
};

export default AddMemberModal;

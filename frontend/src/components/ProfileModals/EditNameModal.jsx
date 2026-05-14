import { useState } from "react";
import "./ProfileModals.css";
import { getAuthToken, updateAuthUser } from "../../utils/auth";

const API_URL = import.meta.env.VITE_API_URL;

const EditNameModal = ({ user, onClose, onUpdate }) => {
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    const trimmed = fullName.trim();

    if (!trimmed) {
      setError("Name cannot be empty");
      return;
    }

    if (trimmed === user?.fullName) {
      onClose();
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ fullName: trimmed }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update name");

      updateAuthUser({ fullName: trimmed });
      onUpdate({ fullName: trimmed });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="profile-modal-body" onSubmit={handleSave}>
      <div className="profile-modal-field">
        <label className="profile-modal-label">Full Name</label>
        <input
          className="profile-modal-input"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter your full name"
          autoFocus
          maxLength={60}
        />
      </div>
      {error && <p className="profile-modal-error">{error}</p>}
      <button
        type="submit"
        className="profile-modal-save-btn"
        disabled={loading}
      >
        {loading ? "Saving…" : "Update Name"}
      </button>
    </form>
  );
};

export default EditNameModal;

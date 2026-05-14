import { useState } from "react";
import "./ProfileModals.css";
import { AVATAR_OPTIONS, getAvatarById } from "../../utils/avatarConfig";
import { getInitials } from "../../utils/helpers";
import { getAuthToken, updateAuthUser } from "../../utils/auth";

const API_URL = import.meta.env.VITE_API_URL;

const AvatarModal = ({ user, onClose, onUpdate }) => {
  const [selectedId, setSelectedId] = useState(user?.avatar || 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (selectedId === (user?.avatar || 1)) {
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
        body: JSON.stringify({ avatar: selectedId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update avatar");

      updateAuthUser({ avatar: selectedId });
      onUpdate({ avatar: selectedId });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-modal-body">
      <p className="profile-modal-hint">Choose your avatar style</p>
      <div className="avatar-grid">
        {AVATAR_OPTIONS.map((av) => (
          <button
            key={av.id}
            className={`avatar-option${selectedId === av.id ? " selected" : ""}`}
            style={{ background: av.bg }}
            onClick={() => setSelectedId(av.id)}
            aria-label={`Avatar option ${av.id}`}
            type="button"
          >
            {getInitials(user?.fullName)}
          </button>
        ))}
      </div>
      {error && <p className="profile-modal-error">{error}</p>}
      <button
        className="profile-modal-save-btn"
        onClick={handleSave}
        disabled={loading}
        type="button"
      >
        {loading ? "Saving…" : "Save Avatar"}
      </button>
    </div>
  );
};

export default AvatarModal;

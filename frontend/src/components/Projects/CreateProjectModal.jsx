import { useState, useEffect } from "react";
import "./Projects.css";
import { getAuthToken } from "../../utils/auth";

const API_URL = import.meta.env.VITE_API_URL;

const STATUS_OPTIONS = [
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "on-hold", label: "On Hold" },
  { value: "cancelled", label: "Cancelled" },
];

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const CreateProjectModal = ({ onClose, onSaved, editProject }) => {
  const isEdit = !!editProject;

  const [form, setForm] = useState({
    title: editProject?.title || "",
    description: editProject?.description || "",
    priority: editProject?.priority || "medium",
    dueDate: editProject?.dueDate
      ? new Date(editProject.dueDate).toISOString().slice(0, 10)
      : "",
    status: editProject?.status || "in-progress",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const descLen = form.description.length;
  const descValid = descLen >= 20 && descLen <= 200;
  const canSubmit = form.title.trim() && descValid && !loading;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError("");

    const url = isEdit
      ? `${API_URL}/api/projects/${editProject._id}`
      : `${API_URL}/api/projects`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          priority: form.priority,
          dueDate: form.dueDate || null,
          status: form.status,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
      } else {
        onSaved(data.project);
        onClose();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="proj-modal" onSubmit={handleSubmit}>
      {/* Title */}
      <div className="proj-modal-field">
        <label className="proj-modal-label">
          Project Title <span>*</span>
        </label>
        <input
          className="proj-modal-input"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Website Redesign"
          autoFocus
          disabled={loading}
        />
      </div>

      {/* Description */}
      <div className="proj-modal-field">
        <label className="proj-modal-label">
          Description <span>*</span>
        </label>
        <textarea
          className="proj-modal-textarea"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe goals and scope… (20–200 characters)"
          disabled={loading}
        />
        <span
          className={`proj-modal-hint${!form.description || descValid ? "" : " error"}`}
        >
          {descLen} / 200{descLen < 20 ? ` — min 20` : ""}
        </span>
      </div>

      {/* Priority + Due Date + Status — all in one line */}
      <div className="proj-modal-row">
        <div className="proj-modal-field">
          <label className="proj-modal-label">Priority</label>
          <select
            className="proj-modal-select"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            disabled={loading}
          >
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div className="proj-modal-field">
          <label className="proj-modal-label">Due Date</label>
          <input
            className="proj-modal-input proj-modal-date"
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="proj-modal-field">
          <label className="proj-modal-label">Status</label>
          <select
            className="proj-modal-select"
            name="status"
            value={form.status}
            onChange={handleChange}
            disabled={loading}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="proj-modal-error">{error}</p>}

      <div className="proj-modal-footer">
        <button
          type="button"
          className="proj-modal-cancel"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="proj-modal-submit"
          disabled={!canSubmit}
        >
          {loading
            ? isEdit
              ? "Saving…"
              : "Creating…"
            : isEdit
              ? "Save Changes"
              : "Create Project"}
        </button>
      </div>
    </form>
  );
};

export default CreateProjectModal;

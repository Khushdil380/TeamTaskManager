import { useState, useEffect } from "react";
import "./Projects.css";
import Modal from "../Modal/Modal";
import CreateProjectModal from "./CreateProjectModal";
import ProjectMembersModal from "./ProjectMembersModal";
import { getAuthToken } from "../../utils/auth";

const API_URL = import.meta.env.VITE_API_URL;

const STATUS_LABEL = {
  "in-progress": "In Progress",
  completed: "Completed",
  "on-hold": "On Hold",
  cancelled: "Cancelled",
};

const formatDue = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const isOverdue = (dateStr, status) => {
  if (!dateStr || status === "completed" || status === "cancelled") return false;
  return new Date(dateStr) < new Date();
};

const Projects = ({ searchQuery = "" }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSort, setFilterSort] = useState("");

  // Modals
  const [showCreate, setShowCreate] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [membersProject, setMembersProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, [filterPriority, filterStatus, filterSort]);

  const fetchProjects = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filterPriority) params.set("priority", filterPriority);
      if (filterStatus) params.set("status", filterStatus);
      if (filterSort) params.set("sort", filterSort);

      const res = await fetch(
        `${API_URL}/api/projects${params.toString() ? "?" + params : ""}`,
        { headers: { Authorization: `Bearer ${getAuthToken()}` } },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load projects");
      setProjects(data.projects);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSaved = (project) => {
    setProjects((prev) => {
      const idx = prev.findIndex((p) => p._id === project._id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = project;
        return next;
      }
      return [project, ...prev];
    });
  };

  const handleProjectUpdated = (project) => {
    setProjects((prev) =>
      prev.map((p) => (p._id === project._id ? project : p)),
    );
    // Keep members modal open with fresh data
    setMembersProject(project);
  };

  const handleDelete = async (id) => {
    setProjects((prev) => prev.filter((p) => p._id !== id));
    try {
      const res = await fetch(`${API_URL}/api/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      if (!res.ok) fetchProjects();
    } catch {
      fetchProjects();
    }
  };

  const clearFilters = () => {
    setFilterPriority("");
    setFilterStatus("");
    setFilterSort("");
  };

  const hasFilters = filterPriority || filterStatus || filterSort;

  // Client-side search filter
  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="projects">
      {/* Toolbar */}
      <div className="proj-toolbar">
        {/* Left: count */}
        <div className="proj-toolbar-left">
          <span className="proj-count">{projects.length}</span>
          <span className="proj-count-label">
            project{projects.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Centre: filters */}
        <div className="proj-filters">
          <select
            className={`proj-filter-select${filterPriority ? " proj-filter-active" : ""}`}
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="">Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            className={`proj-filter-select${filterStatus ? " proj-filter-active" : ""}`}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Status</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            className={`proj-filter-select${filterSort === "dueDate" ? " proj-filter-active" : ""}`}
            value={filterSort}
            onChange={(e) => setFilterSort(e.target.value)}
          >
            <option value="">Sort: Newest</option>
            <option value="dueDate">Sort: Due Date</option>
          </select>

          {hasFilters && (
            <button className="proj-filter-clear" onClick={clearFilters}>
              Clear
            </button>
          )}
        </div>

        {/* Right: create button */}
        <button className="proj-create-btn" onClick={() => setShowCreate(true)}>
          <span>+</span>
          <span>New Project</span>
        </button>
      </div>

      {/* Card grid */}
      <div className="proj-list-wrapper">
        {loading ? (
          <p className="proj-state-msg">Loading projects…</p>
        ) : error ? (
          <p className="proj-state-msg proj-state-error">{error}</p>
        ) : (
          <div className="proj-grid">
            {filtered.length === 0 ? (
              <div className="proj-empty">
                <span className="proj-empty-icon">
                  {projects.length === 0 ? "📁" : "🔍"}
                </span>
                <p>
                  {projects.length === 0
                    ? "No projects yet. Create your first project."
                    : `No results for "${searchQuery}"`}
                </p>
              </div>
            ) : (
              filtered.map((p) => (
                <ProjectCard
                  key={p._id}
                  project={p}
                  onEdit={() => setEditProject(p)}
                  onDelete={() => handleDelete(p._id)}
                  onMembers={() => setMembersProject(p)}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Create modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="New Project"
        size="medium"
      >
        <CreateProjectModal
          onClose={() => setShowCreate(false)}
          onSaved={handleProjectSaved}
        />
      </Modal>

      {/* Edit modal */}
      <Modal
        isOpen={!!editProject}
        onClose={() => setEditProject(null)}
        title="Edit Project"
        size="medium"
      >
        {editProject && (
          <CreateProjectModal
            editProject={editProject}
            onClose={() => setEditProject(null)}
            onSaved={(proj) => {
              handleProjectSaved(proj);
              setEditProject(null);
            }}
          />
        )}
      </Modal>

      {/* Members modal */}
      <Modal
        isOpen={!!membersProject}
        onClose={() => setMembersProject(null)}
        title={membersProject ? `Team — ${membersProject.title}` : "Team"}
        size="medium"
      >
        {membersProject && (
          <ProjectMembersModal
            project={membersProject}
            onProjectUpdated={handleProjectUpdated}
          />
        )}
      </Modal>
    </div>
  );
};

/* ── Project Card ── */
const ProjectCard = ({ project, onEdit, onDelete, onMembers }) => {
  const due = formatDue(project.dueDate);
  const overdue = isOverdue(project.dueDate, project.status);

  return (
    <div className="proj-card">
      <div className={`proj-card-stripe proj-stripe-${project.color}`} />

      <div className="proj-card-body">
        {/* Meta row */}
        <div className="proj-card-meta">
          <button className="proj-members-btn" onClick={onMembers}>
            <span className="proj-members-icon">👥</span>
            <span className="proj-members-count">
              {project.members?.length || 0}
            </span>
          </button>

          <div className="proj-card-badges">
            <span
              className={`proj-priority-badge proj-priority-${project.priority}`}
            >
              {project.priority}
            </span>
            {due && (
              <span
                className={`proj-due-date${overdue ? " proj-due-overdue" : ""}`}
              >
                {overdue ? "⚠ " : ""}
                {due}
              </span>
            )}
          </div>
        </div>

        {/* Title + description */}
        <h3 className="proj-card-title">{project.title}</h3>
        <p className="proj-card-desc">{project.description}</p>
      </div>

      {/* Footer */}
      <div className="proj-card-footer">
        <span
          className={`proj-status-badge proj-status-${project.status}`}
        >
          {STATUS_LABEL[project.status]}
        </span>

        <div className="proj-card-actions">
          <button
            className="proj-action-btn"
            onClick={onEdit}
            title="Edit project"
          >
            ✏️
          </button>
          <button
            className="proj-action-btn danger"
            onClick={onDelete}
            title="Delete project"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default Projects;

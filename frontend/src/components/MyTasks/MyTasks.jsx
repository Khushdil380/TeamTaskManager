import { useState, useEffect, useCallback } from "react";
import {
  TASK_STATUS_CFG,
  PRIORITY_CFG,
  STRIPE_COLORS,
} from "../../utils/taskConfig";
import { formatDeadline, isOverdue } from "../../utils/helpers";
import { getAuthToken } from "../../utils/auth";
import "./MyTasks.css";

const API = import.meta.env.VITE_API_URL;

const STATUS_OPTIONS = [
  { value: "todo", ...TASK_STATUS_CFG.todo },
  { value: "in-progress", ...TASK_STATUS_CFG["in-progress"] },
  { value: "completed", ...TASK_STATUS_CFG.completed },
];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "todo", label: "To Do" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
];

export default function MyTasks({ user }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchTasks = useCallback(async () => {
    const token = getAuthToken();
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API}/api/tasks/my-tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load tasks");
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleStatusChange = async (taskId, newStatus) => {
    const token = getAuthToken();
    setUpdatingId(taskId);
    try {
      const res = await fetch(`${API}/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();
      setTasks((prev) =>
        prev.map((t) =>
          t._id === taskId ? { ...t, status: data.task.status } : t,
        ),
      );
    } catch (err) {
      // silent fail — show no toast, task state unchanged
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  const counts = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  return (
    <div className="mytasks">
      {/* Topbar: title + filters in one row */}
      <div className="mytasks-topbar">
        <div className="mytasks-heading">
          <h2 className="mytasks-title">My Tasks</h2>
          <p className="mytasks-sub">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""} assigned to you
          </p>
        </div>
        <div className="mytasks-filters">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`mytasks-filter-btn${filter === f.key ? " active" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
              <span className="mytasks-filter-count">{counts[f.key]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="mytasks-state">
          <div className="mytasks-spinner" />
          <p>Loading tasks…</p>
        </div>
      ) : error ? (
        <div className="mytasks-state mytasks-error">
          <p>{error}</p>
          <button className="mytasks-retry-btn" onClick={fetchTasks}>
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="mytasks-state">
          <p className="mytasks-empty-icon">✓</p>
          <p className="mytasks-empty-text">
            {filter === "all"
              ? "No tasks assigned to you yet."
              : `No ${TASK_STATUS_CFG[filter]?.label ?? filter} tasks.`}
          </p>
        </div>
      ) : (
        <ul className="mytasks-list">
          {filtered.map((task) => (
            <TaskRow
              key={task._id}
              task={task}
              onStatusChange={handleStatusChange}
              updating={updatingId === task._id}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function TaskRow({ task, onStatusChange, updating }) {
  const deadline = formatDeadline(task.deadline);
  const overdue = isOverdue(task.deadline, task.status);
  const statusCfg = TASK_STATUS_CFG[task.status] ?? TASK_STATUS_CFG.todo;
  const priorityCfg = PRIORITY_CFG[task.priority] ?? PRIORITY_CFG.medium;
  const stripeColor =
    task.project?.color && STRIPE_COLORS[task.project.color]
      ? STRIPE_COLORS[task.project.color]
      : STRIPE_COLORS[1];

  return (
    <li
      className={`mytask-row${task.status === "completed" ? " completed" : ""}`}
    >
      {/* Priority left-border accent */}
      <span
        className="mytask-priority-accent"
        style={{ background: priorityCfg.color }}
      />

      <div className="mytask-body">
        {/* Left: title + description */}
        <div className="mytask-left">
          <span className="mytask-title">{task.title}</span>
          {task.description && (
            <span className="mytask-desc">{task.description}</span>
          )}
        </div>

        {/* Right: meta chips + status selector */}
        <div className="mytask-right">
          <div className="mytask-meta">
            {task.project && (
              <span className="mytask-project-chip">
                <span
                  className="mytask-project-dot"
                  style={{ background: stripeColor }}
                />
                {task.project.title}
              </span>
            )}
            <span
              className="mytask-chip"
              style={{ color: priorityCfg.color, background: priorityCfg.bg }}
            >
              {priorityCfg.label}
            </span>
            {deadline && (
              <span
                className={`mytask-chip mytask-deadline${
                  overdue ? " overdue" : ""
                }`}
              >
                {overdue && "⚠ "}
                {deadline.label}
              </span>
            )}
          </div>

          <div className="mytask-status-wrap">
            <select
              className="mytask-status-select"
              value={task.status}
              disabled={updating}
              style={{
                color: statusCfg.color,
                background: statusCfg.bg,
                borderColor: statusCfg.color + "55",
                opacity: updating ? 0.6 : 1,
              }}
              onChange={(e) => onStatusChange(task._id, e.target.value)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            {updating && <span className="mytask-updating-dot" />}
          </div>
        </div>
      </div>
    </li>
  );
}

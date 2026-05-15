import { useState, useEffect, useRef, useCallback } from "react";
import "./ProjectDetail.css";
import { getAuthToken } from "../../utils/auth";
import { getAvatarById } from "../../utils/avatarConfig";
import {
  PRIORITY_CFG,
  PROJECT_STATUS_LABEL,
  TASK_STATUS_CFG,
} from "../../utils/taskConfig";
import { formatDate, isOverdue } from "../../utils/helpers";

const API_URL = import.meta.env.VITE_API_URL;

const formatMsgTime = (dateStr) => {
  const d = new Date(dateStr);
  const now = new Date();
  const yesterday = new Date(now - 86400000);
  const opts = { hour: "2-digit", minute: "2-digit" };
  if (d.toDateString() === now.toDateString())
    return d.toLocaleTimeString("en-US", opts);
  if (d.toDateString() === yesterday.toDateString())
    return `Yesterday ${d.toLocaleTimeString("en-US", opts)}`;
  return (
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    " " +
    d.toLocaleTimeString("en-US", opts)
  );
};

const EMPTY_FORM = {
  title: "",
  description: "",
  assignedTo: [],
  deadline: "",
  priority: "medium",
  status: "todo",
};

/* ── Avatar display helper ── */
const AvatarBubble = ({ avatarId, size = 32 }) => {
  const av = getAvatarById(avatarId);
  return (
    <div
      className="pd-avatar"
      style={{
        background: av.bg,
        width: size,
        height: size,
        fontSize: size * 0.5,
      }}
    >
      {av.icon}
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   ProjectDetail
══════════════════════════════════════════════════════ */
const ProjectDetail = ({
  project,
  user,
  role = "member",
  onBack,
  onProjectUpdated,
}) => {
  const currentUserId = (user?._id ?? user?.id)?.toString();
  const isAdmin =
    role === "admin" &&
    (project.adminId?.toString?.() === currentUserId ||
      project.adminId?._id?.toString?.() === currentUserId);

  /* ── Tasks state ── */
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [taskError, setTaskError] = useState("");

  /* ── Task form state ── */
  const [showForm, setShowForm] = useState(false);
  const [taskForm, setTaskForm] = useState(EMPTY_FORM);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [savingTask, setSavingTask] = useState(false);

  /* ── Messages state ── */
  const [messages, setMessages] = useState([]);
  const [loadingMsgs, setLoadingMsgs] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [sending, setSending] = useState(false);
  const lastMsgTimeRef = useRef(null);
  const chatEndRef = useRef(null);
  const pollRef = useRef(null);

  const authHeader = { Authorization: `Bearer ${getAuthToken()}` };

  /* ── Fetch tasks ── */
  const fetchTasks = useCallback(async () => {
    try {
      const view = role === "admin" ? "admin" : "member";
      const res = await fetch(
        `${API_URL}/api/tasks?projectId=${project._id}&view=${view}`,
        { headers: authHeader },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load tasks");
      setTasks(data.tasks);
    } catch (err) {
      setTaskError(err.message);
    } finally {
      setLoadingTasks(false);
    }
  }, [project._id, role]);

  /* ── Fetch messages ── */
  const fetchMessages = useCallback(
    async (initial = false) => {
      try {
        const since = initial ? "" : lastMsgTimeRef.current;
        const url = `${API_URL}/api/messages?projectId=${project._id}${since ? `&since=${encodeURIComponent(since)}` : ""}`;
        const res = await fetch(url, { headers: authHeader });
        const data = await res.json();
        if (!res.ok) return;
        if (data.messages.length > 0) {
          setMessages((prev) => {
            if (initial) return data.messages;
            return [...prev, ...data.messages];
          });
          lastMsgTimeRef.current =
            data.messages[data.messages.length - 1].createdAt;
        }
      } catch {
        /* silent */
      } finally {
        if (initial) setLoadingMsgs(false);
      }
    },
    [project._id],
  );

  useEffect(() => {
    fetchTasks();
    fetchMessages(true);

    pollRef.current = setInterval(() => fetchMessages(false), 5000);
    return () => clearInterval(pollRef.current);
  }, [fetchTasks, fetchMessages]);

  /* scroll chat to bottom when new messages arrive */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ── Task CRUD ── */
  const openAddForm = () => {
    setEditingTaskId(null);
    setTaskForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEditForm = (task) => {
    setEditingTaskId(task._id);
    setTaskForm({
      title: task.title,
      description: task.description || "",
      assignedTo:
        task.assignedTo?.map((a) => a._id?.toString() || a.toString()) || [],
      deadline: task.deadline
        ? new Date(task.deadline).toISOString().split("T")[0]
        : "",
      priority: task.priority,
      status: task.status,
    });
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingTaskId(null);
    setTaskForm(EMPTY_FORM);
  };

  const handleFormChange = (e) => {
    setTaskForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;
    setSavingTask(true);
    try {
      const body = {
        projectId: project._id,
        title: taskForm.title.trim(),
        description: taskForm.description.trim(),
        assignedTo: taskForm.assignedTo,
        deadline: taskForm.deadline || null,
        priority: taskForm.priority,
        status: taskForm.status,
      };

      const url = editingTaskId
        ? `${API_URL}/api/tasks/${editingTaskId}`
        : `${API_URL}/api/tasks`;
      const method = editingTaskId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { ...authHeader, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save task");

      if (editingTaskId) {
        setTasks((prev) =>
          prev.map((t) => (t._id === editingTaskId ? data.task : t)),
        );
      } else {
        setTasks((prev) => [data.task, ...prev]);
      }
      cancelForm();
    } catch (err) {
      alert(err.message);
    } finally {
      setSavingTask(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
    try {
      const res = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: authHeader,
      });
      if (!res.ok) fetchTasks();
    } catch {
      fetchTasks();
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)),
    );
    try {
      const res = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { ...authHeader, "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setTasks((prev) => prev.map((t) => (t._id === taskId ? data.task : t)));
      }
    } catch {
      /* silent */
    }
  };

  /* ── Send message ── */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const content = chatInput.trim();
    if (!content) return;
    setSending(true);
    setChatInput("");
    try {
      const res = await fetch(`${API_URL}/api/messages`, {
        method: "POST",
        headers: { ...authHeader, "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project._id, content }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, data.message]);
        lastMsgTimeRef.current = data.message.createdAt;
      }
    } catch {
      /* silent */
    } finally {
      setSending(false);
    }
  };

  /* ── Project members for assign-to ── */
  const assignableMembers = project.members || [];

  const handleAssigneeToggle = (memberId) => {
    setTaskForm((prev) => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(memberId)
        ? prev.assignedTo.filter((id) => id !== memberId)
        : [...prev.assignedTo, memberId],
    }));
  };

  const handleSelectAll = () => {
    const allIds = assignableMembers.map((m) => m._id);
    const allSelected =
      allIds.length > 0 &&
      allIds.every((id) => taskForm.assignedTo.includes(id));
    setTaskForm((prev) => ({
      ...prev,
      assignedTo: allSelected ? [] : allIds,
    }));
  };

  /* ══ Render ══ */
  return (
    <div className="pd-page">
      {/* Single merged narrow header */}
      <div className="pd-header">
        <div className="pd-header-left">
          <button className="pd-back-btn" onClick={onBack}>
            ← Back
          </button>
          <div className={`pd-title-dot proj-stripe-${project.color}`} />
          <h1 className="pd-title">{project.title}</h1>
          <span className={`pd-status-badge pd-status-${project.status}`}>
            {PROJECT_STATUS_LABEL[project.status]}
          </span>
          <span className="pd-member-count">
            👥 {project.members?.length || 0}
          </span>
        </div>
        <div className="pd-header-right">
          <span className="pd-tasks-label">
            Tasks <span className="pd-task-count">{tasks.length}</span>
          </span>
          {isAdmin && !showForm && (
            <button className="pd-add-btn" onClick={openAddForm}>
              + Add Task
            </button>
          )}
        </div>
      </div>

      {/* Two-panel body */}
      <div className="pd-body">
        {/* ── Left: Tasks ── */}
        <div className="pd-tasks">
          {/* Add / Edit task form */}
          {showForm && isAdmin && (
            <form className="pd-task-form" onSubmit={handleSaveTask}>
              <div className="pd-form-row">
                <div className="pd-form-group pd-form-grow">
                  <label className="pd-form-label">
                    Title <span className="pd-required">*</span>
                  </label>
                  <input
                    className="pd-form-input"
                    name="title"
                    value={taskForm.title}
                    onChange={handleFormChange}
                    placeholder="Task title"
                    maxLength={150}
                    required
                  />
                </div>
              </div>

              <div className="pd-form-group">
                <label className="pd-form-label">Description</label>
                <textarea
                  className="pd-form-input pd-form-textarea"
                  name="description"
                  value={taskForm.description}
                  onChange={handleFormChange}
                  placeholder="Describe the task…"
                  rows={3}
                  maxLength={2000}
                />
              </div>

              <div className="pd-form-group">
                <label className="pd-form-label">Assign To</label>
                <div className="pd-assignee-list">
                  {assignableMembers.length === 0 ? (
                    <span className="pd-assignee-empty">
                      No members added to this project yet
                    </span>
                  ) : (
                    <>
                      <label className="pd-assignee-item pd-assignee-all-row">
                        <input
                          type="checkbox"
                          checked={
                            assignableMembers.length > 0 &&
                            assignableMembers.every((m) =>
                              taskForm.assignedTo.includes(m._id),
                            )
                          }
                          onChange={handleSelectAll}
                        />
                        <span>All members</span>
                      </label>
                      {assignableMembers.map((m) => (
                        <label key={m._id} className="pd-assignee-item">
                          <input
                            type="checkbox"
                            checked={taskForm.assignedTo.includes(m._id)}
                            onChange={() => handleAssigneeToggle(m._id)}
                          />
                          <AvatarBubble avatarId={m.avatar} size={20} />
                          <span>{m.fullName}</span>
                        </label>
                      ))}
                    </>
                  )}
                </div>
              </div>

              <div className="pd-form-row pd-form-row-2">
                <div className="pd-form-group">
                  <label className="pd-form-label">Deadline</label>
                  <input
                    className="pd-form-input"
                    type="date"
                    name="deadline"
                    value={taskForm.deadline}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="pd-form-group">
                  <label className="pd-form-label">Priority</label>
                  <select
                    className="pd-form-input"
                    name="priority"
                    value={taskForm.priority}
                    onChange={handleFormChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="pd-form-actions">
                <button
                  type="button"
                  className="pd-form-cancel"
                  onClick={cancelForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="pd-form-save"
                  disabled={savingTask}
                >
                  {savingTask
                    ? "Saving…"
                    : editingTaskId
                      ? "Save Changes"
                      : "Add Task"}
                </button>
              </div>
            </form>
          )}

          {/* Task list */}
          <div className="pd-task-list">
            {loadingTasks ? (
              <p className="pd-state-msg">Loading tasks…</p>
            ) : taskError ? (
              <p className="pd-state-msg pd-state-error">{taskError}</p>
            ) : tasks.length === 0 ? (
              <div className="pd-empty">
                <span className="pd-empty-icon">📋</span>
                <p>
                  {isAdmin
                    ? "No tasks yet. Click «+ Add Task» to create one."
                    : "No tasks assigned yet."}
                </p>
              </div>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  isAdmin={isAdmin}
                  currentUserId={currentUserId}
                  onEdit={() => openEditForm(task)}
                  onDelete={() => handleDeleteTask(task._id)}
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </div>
        </div>

        {/* ── Right: Chat ── */}
        <div className="pd-chat">
          <div className="pd-chat-messages">
            {loadingMsgs ? (
              <p className="pd-state-msg">Loading messages…</p>
            ) : messages.length === 0 ? (
              <div className="pd-chat-empty">
                <span>💬</span>
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <ChatMessage
                  key={msg._id}
                  msg={msg}
                  currentUserId={user?._id}
                />
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          <form className="pd-chat-form" onSubmit={handleSendMessage}>
            <input
              className="pd-chat-input"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Write a message…"
              maxLength={1000}
              disabled={sending}
            />
            <button
              type="submit"
              className="pd-chat-send"
              disabled={sending || !chatInput.trim()}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ══ TaskCard sub-component ══ */
const TaskCard = ({
  task,
  isAdmin,
  currentUserId,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const overdue = isOverdue(task.deadline, task.status);
  const isAssigned = task.assignedTo?.some(
    (a) => (a?._id ?? a?.id)?.toString() === currentUserId?.toString(),
  );
  const canChangeStatus = isAssigned;

  return (
    <div className={`pd-task-card pd-task-${task.status}`}>
      <div className="pd-task-top">
        <div className="pd-task-badges">
          <span className={`pd-priority-badge pd-priority-${task.priority}`}>
            {PRIORITY_CFG[task.priority]?.label}
          </span>
          <span
            className={`pd-task-status-badge pd-task-status-${task.status}`}
          >
            {TASK_STATUS_CFG[task.status]?.label}
          </span>
        </div>
        {(isAdmin || isAssigned) && (
          <div className="pd-task-actions">
            {canChangeStatus && (
              <select
                className="pd-status-select"
                value={task.status}
                onChange={(e) => onStatusChange(task._id, e.target.value)}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            )}
            {isAdmin && (
              <>
                <button
                  className="pd-icon-btn"
                  onClick={onEdit}
                  title="Edit task"
                >
                  ✏️
                </button>
                <button
                  className="pd-icon-btn danger"
                  onClick={onDelete}
                  title="Delete task"
                >
                  🗑️
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <h3 className="pd-task-title">{task.title}</h3>

      {task.description && <p className="pd-task-desc">{task.description}</p>}

      <div className="pd-task-meta">
        {task.assignedTo?.length > 0 ? (
          <div className="pd-task-assignees">
            {task.assignedTo.slice(0, 3).map((a) => (
              <AvatarBubble key={a._id} avatarId={a.avatar} size={22} />
            ))}
            <span className="pd-task-assignee-name">
              {task.assignedTo[0].fullName}
              {task.assignedTo.length > 1 && ` +${task.assignedTo.length - 1}`}
            </span>
          </div>
        ) : (
          <span className="pd-task-unassigned">Unassigned</span>
        )}

        <div className="pd-task-dates">
          {task.assignedBy && (
            <span className="pd-date-item">
              <span className="pd-date-label">By</span>{" "}
              {task.assignedBy.fullName}
            </span>
          )}
          <span className="pd-date-item">
            <span className="pd-date-label">Given</span>{" "}
            {formatDate(task.createdAt)}
          </span>
          {task.deadline && (
            <span className={`pd-date-item${overdue ? " pd-overdue" : ""}`}>
              <span className="pd-date-label">Due</span> {overdue && "⚠ "}
              {formatDate(task.deadline)}
            </span>
          )}
        </div>

        {task.status === "completed" && task.completedBy && (
          <div className="pd-completed-by">
            <AvatarBubble avatarId={task.completedBy.avatar} size={18} />
            <span className="pd-completed-by-text">
              Completed by <strong>{task.completedBy.fullName}</strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

/* ══ ChatMessage sub-component ══ */
const ChatMessage = ({ msg, currentUserId }) => {
  const isMine = msg.sender?._id?.toString() === currentUserId?.toString();
  const av = getAvatarById(msg.sender?.avatar);
  return (
    <div className={`pd-msg${isMine ? " pd-msg-mine" : ""}`}>
      {!isMine && (
        <div className="pd-msg-avatar" style={{ background: av.bg }}>
          {av.icon}
        </div>
      )}
      <div className="pd-msg-bubble">
        {!isMine && <div className="pd-msg-sender">{msg.sender?.fullName}</div>}
        <div className="pd-msg-text">{msg.content}</div>
        <div className="pd-msg-time">{formatMsgTime(msg.createdAt)}</div>
      </div>
      {isMine && (
        <div className="pd-msg-avatar" style={{ background: av.bg }}>
          {av.icon}
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;

import jwt from "jsonwebtoken";
import Task from "../models/Task.js";
import Project from "../models/Project.js";

const decodeToken = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw new Error("No token provided");
  return jwt.verify(token, process.env.JWT_SECRET);
};

const verifyProjectAccess = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) throw new Error("Project not found.");
  const isAdmin = project.adminId.toString() === userId.toString();
  const isMember = project.members.map(String).includes(userId.toString());
  if (!isAdmin && !isMember) throw new Error("Access denied.");
  return { project, isAdmin };
};

// GET /api/tasks?projectId=&view=admin|member
export const getTasks = async (req, res) => {
  try {
    const decoded = decodeToken(req);
    const { projectId, view } = req.query;
    if (!projectId)
      return res.status(400).json({ message: "projectId is required." });

    await verifyProjectAccess(projectId, decoded.userId);

    const taskFilter = { projectId };
    if (view === "member") {
      taskFilter.assignedTo = decoded.userId;
    }

    const tasks = await Task.find(taskFilter)
      .sort({ createdAt: -1 })
      .populate("assignedTo", "fullName email avatar")
      .populate("assignedBy", "fullName avatar")
      .populate("completedBy", "fullName avatar");

    res.json({ tasks });
  } catch (err) {
    const status = err.message === "Access denied." ? 403 : 500;
    res.status(status).json({ message: err.message });
  }
};

// POST /api/tasks
export const createTask = async (req, res) => {
  try {
    const decoded = decodeToken(req);
    const { projectId, title, description, assignedTo, deadline, priority, status } = req.body;

    if (!projectId || !title)
      return res.status(400).json({ message: "projectId and title are required." });

    const { isAdmin } = await verifyProjectAccess(projectId, decoded.userId);
    if (!isAdmin)
      return res.status(403).json({ message: "Only the project admin can create tasks." });

    const task = await Task.create({
      projectId,
      title: title.trim(),
      description: description?.trim() || "",
      assignedTo: Array.isArray(assignedTo) ? assignedTo.filter(Boolean) : [],
      assignedBy: decoded.userId,
      deadline: deadline || null,
      priority: priority || "medium",
      status: status || "todo",
    });

    const populated = await Task.findById(task._id)
      .populate("assignedTo", "fullName email avatar")
      .populate("assignedBy", "fullName avatar");

    res.status(201).json({ task: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/tasks/:id
export const updateTask = async (req, res) => {
  try {
    const decoded = decodeToken(req);
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found." });

    const { isAdmin } = await verifyProjectAccess(task.projectId, decoded.userId);
    const isAssigned = task.assignedTo?.map(String).includes(decoded.userId.toString());

    if (!isAdmin && !isAssigned)
      return res.status(403).json({ message: "Access denied." });

    if (isAdmin) {
      const { title, description, assignedTo, deadline, priority, status } = req.body;
      if (title !== undefined) task.title = title.trim();
      if (description !== undefined) task.description = description.trim();
      if (assignedTo !== undefined)
        task.assignedTo = Array.isArray(assignedTo) ? assignedTo.filter(Boolean) : [];
      if (deadline !== undefined) task.deadline = deadline || null;
      if (priority !== undefined) task.priority = priority;
      if (status !== undefined) {
        task.status = status;
        if (status === "completed") task.completedBy = decoded.userId;
        else task.completedBy = null;
      }
    } else {
      if (req.body.status) {
        task.status = req.body.status;
        if (req.body.status === "completed") task.completedBy = decoded.userId;
        else task.completedBy = null;
      }
    }

    await task.save();

    const populated = await Task.findById(task._id)
      .populate("assignedTo", "fullName email avatar")
      .populate("assignedBy", "fullName avatar")
      .populate("completedBy", "fullName avatar");

    res.json({ task: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const decoded = decodeToken(req);
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found." });

    const { isAdmin } = await verifyProjectAccess(task.projectId, decoded.userId);
    if (!isAdmin)
      return res.status(403).json({ message: "Only the project admin can delete tasks." });

    await task.deleteOne();
    res.json({ message: "Task deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/tasks/my-tasks
export const getMyTasks = async (req, res) => {
  try {
    const { userId } = decodeToken(req);

    const tasks = await Task.find({ assignedTo: userId })
      .populate("projectId", "title color")
      .populate("assignedBy", "fullName avatar");

    const withDeadline = tasks
      .filter((t) => t.deadline)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    const withoutDeadline = tasks
      .filter((t) => !t.deadline)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const sorted = [...withDeadline, ...withoutDeadline];

    res.json({
      tasks: sorted.map((t) => ({
        _id: t._id,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        deadline: t.deadline,
        createdAt: t.createdAt,
        project: t.projectId
          ? { _id: t.projectId._id, title: t.projectId.title, color: t.projectId.color }
          : null,
        assignedBy: t.assignedBy
          ? { _id: t.assignedBy._id, fullName: t.assignedBy.fullName, avatar: t.assignedBy.avatar }
          : null,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/tasks/calendar?view=admin|member
export const getCalendarTasks = async (req, res) => {
  try {
    const { userId } = decodeToken(req);
    const { view } = req.query;

    let tasks;
    if (view === "admin") {
      const projects = await Project.find({ adminId: userId }).select("_id");
      const projectIds = projects.map((p) => p._id);
      tasks = await Task.find({ projectId: { $in: projectIds }, deadline: { $ne: null } })
        .populate("projectId", "title color")
        .select("title description deadline projectId status");
    } else {
      tasks = await Task.find({ assignedTo: userId, deadline: { $ne: null } })
        .populate("projectId", "title color")
        .select("title description deadline projectId status");
    }

    res.json({
      tasks: tasks.map((t) => ({
        _id: t._id,
        title: t.title,
        description: t.description,
        deadline: t.deadline,
        status: t.status,
        project: t.projectId
          ? { _id: t.projectId._id, title: t.projectId.title, color: t.projectId.color }
          : null,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
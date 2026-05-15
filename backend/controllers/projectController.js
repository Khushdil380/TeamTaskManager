import jwt from "jsonwebtoken";
import Project from "../models/Project.js";
import User from "../models/User.js";

const decodeToken = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw new Error("No token provided");
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Auto-assign color cycling 1–8
const COLORS = 8;
let _colorSeed = 0;
const nextColor = () => {
  _colorSeed = (_colorSeed % COLORS) + 1;
  return _colorSeed;
};

// POST /api/projects
export const createProject = async (req, res) => {
  try {
    const decoded = decodeToken(req);
    const { title, description, priority, dueDate, status } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required." });
    }
    if (description.length < 20 || description.length > 200) {
      return res.status(400).json({
        message: "Description must be between 20 and 200 characters.",
      });
    }

    // Auto-cycle color based on admin's existing project count
    const count = await Project.countDocuments({ adminId: decoded.userId });
    const color = (count % COLORS) + 1;

    const project = await Project.create({
      adminId: decoded.userId,
      title,
      description,
      priority: priority || "medium",
      dueDate: dueDate || null,
      status: status || "in-progress",
      color,
      members: [],
    });

    res.status(201).json({ project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/projects?priority=&status=&sort=dueDate
export const getProjects = async (req, res) => {
  try {
    const decoded = decodeToken(req);
    const { priority, status, sort, view } = req.query;

    // Scope projects by role: admin sees own projects, member sees joined projects
    const filter =
      view === "member"
        ? { members: decoded.userId }
        : { adminId: decoded.userId };

    if (priority) filter.priority = priority;
    if (status) filter.status = status;

    const sortOpt = sort === "dueDate" ? { dueDate: 1 } : { createdAt: -1 };

    const projects = await Project.find(filter)
      .sort(sortOpt)
      .populate("members", "fullName email avatar");

    res.json({ projects });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/projects/:id
export const updateProject = async (req, res) => {
  try {
    const decoded = decodeToken(req);
    const { title, description, priority, dueDate, status } = req.body;

    if (description !== undefined) {
      if (description.length < 20 || description.length > 200) {
        return res.status(400).json({
          message: "Description must be between 20 and 200 characters.",
        });
      }
    }

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, adminId: decoded.userId },
      { title, description, priority, dueDate, status },
      { new: true, runValidators: true },
    ).populate("members", "fullName email avatar");

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    res.json({ project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/projects/:id
export const deleteProject = async (req, res) => {
  try {
    const decoded = decodeToken(req);
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      adminId: decoded.userId,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    res.json({ message: "Project deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/projects/:id/members  { email }
export const addProjectMember = async (req, res) => {
  try {
    const decoded = decodeToken(req);
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No account found for this email." });
    }

    const project = await Project.findOne({
      _id: req.params.id,
      adminId: decoded.userId,
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    if (project.members.map(String).includes(user._id.toString())) {
      return res
        .status(409)
        .json({ message: "This user is already in the project." });
    }

    project.members.push(user._id);
    await project.save();

    const updated = await Project.findById(project._id).populate(
      "members",
      "fullName email avatar",
    );

    res.json({ project: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/projects/:id/members/:userId
export const removeProjectMember = async (req, res) => {
  try {
    const decoded = decodeToken(req);

    const project = await Project.findOne({
      _id: req.params.id,
      adminId: decoded.userId,
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    project.members = project.members.filter(
      (m) => m.toString() !== req.params.userId,
    );
    await project.save();

    const updated = await Project.findById(project._id).populate(
      "members",
      "fullName email avatar",
    );

    res.json({ project: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/projects/check-user?email=  (reuse for member add flow)
export const checkProjectUser = async (req, res) => {
  try {
    decodeToken(req);
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No account found for this email." });
    }

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/projects/member-teams — project-wise co-members for member view
export const getMemberTeams = async (req, res) => {
  try {
    const decoded = decodeToken(req);

    const projects = await Project.find({ members: decoded.userId })
      .select("_id title color status priority adminId members")
      .populate("members", "fullName email avatar")
      .populate("adminId", "fullName email avatar")
      .sort({ createdAt: -1 });

    const result = projects.map((p) => ({
      _id: p._id,
      title: p.title,
      color: p.color,
      status: p.status,
      priority: p.priority,
      admin: p.adminId
        ? {
            _id: p.adminId._id,
            fullName: p.adminId.fullName,
            email: p.adminId.email,
            avatar: p.adminId.avatar,
          }
        : null,
      members: p.members.map((m) => ({
        _id: m._id,
        fullName: m.fullName,
        email: m.email,
        avatar: m.avatar,
      })),
    }));

    res.json({ projects: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getProjectTeamMembers = async (req, res) => {
  try {
    const decoded = decodeToken(req);

    const projects = await Project.find({ adminId: decoded.userId })
      .select("_id title color status priority members")
      .populate("members", "fullName email avatar");

    // Build a map: userId → { user info + list of projects they're in }
    const memberMap = new Map();

    for (const project of projects) {
      for (const member of project.members) {
        const uid = member._id.toString();
        if (!memberMap.has(uid)) {
          memberMap.set(uid, {
            _id: member._id,
            fullName: member.fullName,
            email: member.email,
            avatar: member.avatar,
            projects: [],
          });
        }
        memberMap.get(uid).projects.push({
          _id: project._id,
          title: project.title,
          color: project.color,
          status: project.status,
          priority: project.priority,
        });
      }
    }

    const members = Array.from(memberMap.values()).map((m) => ({
      ...m,
      projectCount: m.projects.length,
      completedCount: m.projects.filter((p) => p.status === "completed").length,
      inProgressCount: m.projects.filter((p) => p.status === "in-progress")
        .length,
    }));

    // Sort by most projects first
    members.sort((a, b) => b.projectCount - a.projectCount);

    res.json({ members });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

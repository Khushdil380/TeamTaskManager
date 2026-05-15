import jwt from "jsonwebtoken";
import Message from "../models/Message.js";
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

// GET /api/messages?projectId=&since=<ISO timestamp>
export const getMessages = async (req, res) => {
  try {
    const decoded = decodeToken(req);
    const { projectId, since } = req.query;
    if (!projectId)
      return res.status(400).json({ message: "projectId is required." });

    await verifyProjectAccess(projectId, decoded.userId);

    const filter = { projectId };
    if (since) filter.createdAt = { $gt: new Date(since) };

    const messages = await Message.find(filter)
      .sort({ createdAt: 1 })
      .limit(200)
      .populate("sender", "fullName avatar");

    res.json({ messages });
  } catch (err) {
    const status = err.message === "Access denied." ? 403 : 500;
    res.status(status).json({ message: err.message });
  }
};

// POST /api/messages
export const sendMessage = async (req, res) => {
  try {
    const decoded = decodeToken(req);
    const { projectId, content } = req.body;

    if (!projectId || !content?.trim())
      return res
        .status(400)
        .json({ message: "projectId and content are required." });

    await verifyProjectAccess(projectId, decoded.userId);

    const msg = await Message.create({
      projectId,
      sender: decoded.userId,
      content: content.trim(),
    });

    const populated = await Message.findById(msg._id).populate(
      "sender",
      "fullName avatar",
    );

    res.status(201).json({ message: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

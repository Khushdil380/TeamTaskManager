import jwt from "jsonwebtoken";
import User from "../models/User.js";
import TeamMember from "../models/TeamMember.js";

const decodeToken = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw new Error("No token provided");
  return jwt.verify(token, process.env.JWT_SECRET);
};

// GET /api/team/check-user?email=...
export const checkUser = async (req, res) => {
  try {
    const decoded = decodeToken(req);
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(404).json({
        message:
          "No account found for this email. They must register first.",
      });
    }

    if (user._id.toString() === decoded.userId) {
      return res
        .status(400)
        .json({ message: "You cannot add yourself as a member." });
    }

    const existing = await TeamMember.findOne({
      adminId: decoded.userId,
      memberId: user._id,
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "This user is already in your team." });
    }

    return res.status(200).json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
    });
  } catch (error) {
    console.error("Check user error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// GET /api/team/members
export const getMembers = async (req, res) => {
  try {
    const decoded = decodeToken(req);
    const members = await TeamMember.find({ adminId: decoded.userId })
      .populate("memberId", "fullName email avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      members: members.map((m) => ({
        _id: m._id,
        memberId: m.memberId._id,
        fullName: m.memberId.fullName,
        email: m.memberId.email,
        avatar: m.memberId.avatar,
        addedAt: m.createdAt,
        priority: m.priority,
      })),
    });
  } catch (error) {
    console.error("Get members error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// POST /api/team/add { email }
export const addMember = async (req, res) => {
  try {
    const decoded = decodeToken(req);
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(404).json({
        message: "No account found for this email.",
      });
    }

    if (user._id.toString() === decoded.userId) {
      return res.status(400).json({ message: "You cannot add yourself." });
    }

    const existing = await TeamMember.findOne({
      adminId: decoded.userId,
      memberId: user._id,
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "User is already in your team." });
    }

    const member = await TeamMember.create({
      adminId: decoded.userId,
      memberId: user._id,
    });

    await member.populate("memberId", "fullName email avatar");

    return res.status(201).json({
      message: "Member added successfully",
      member: {
        _id: member._id,
        memberId: member.memberId._id,
        fullName: member.memberId.fullName,
        email: member.memberId.email,
        avatar: member.memberId.avatar,
        addedAt: member.createdAt,
        priority: member.priority,
      },
    });
  } catch (error) {
    console.error("Add member error:", error);
    return res.status(500).json({ message: "Failed to add member" });
  }
};

// DELETE /api/team/members/:id
export const removeMember = async (req, res) => {
  try {
    const decoded = decodeToken(req);
    const { id } = req.params;

    const result = await TeamMember.findOneAndDelete({
      _id: id,
      adminId: decoded.userId,
    });

    if (!result) {
      return res.status(404).json({ message: "Member not found." });
    }

    return res.status(200).json({ message: "Member removed successfully." });
  } catch (error) {
    console.error("Remove member error:", error);
    return res.status(500).json({ message: "Failed to remove member" });
  }
};

// PATCH /api/team/members/:id/priority { priority }
export const updateMemberPriority = async (req, res) => {
  try {
    const decoded = decodeToken(req);
    const { id } = req.params;
    const { priority } = req.body;

    if (!["low", "medium", "high"].includes(priority)) {
      return res.status(400).json({ message: "Invalid priority value." });
    }

    const member = await TeamMember.findOneAndUpdate(
      { _id: id, adminId: decoded.userId },
      { priority },
      { new: true },
    );

    if (!member) {
      return res.status(404).json({ message: "Member not found." });
    }

    return res.status(200).json({ message: "Priority updated." });
  } catch (error) {
    console.error("Update priority error:", error);
    return res.status(500).json({ message: "Failed to update priority" });
  }
};

// POST /api/team/bulk-add { emails: [] }
export const bulkAddMembers = async (req, res) => {
  try {
    const decoded = decodeToken(req);
    const { emails } = req.body;

    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ message: "No emails provided." });
    }

    const results = { added: [], alreadyAdded: [], notFound: [] };

    for (const rawEmail of emails) {
      const email = rawEmail.trim().toLowerCase();
      if (!email) continue;

      const user = await User.findOne({ email });

      if (!user) {
        results.notFound.push(email);
        continue;
      }

      if (user._id.toString() === decoded.userId) continue;

      const existing = await TeamMember.findOne({
        adminId: decoded.userId,
        memberId: user._id,
      });

      if (existing) {
        results.alreadyAdded.push(email);
        continue;
      }

      await TeamMember.create({ adminId: decoded.userId, memberId: user._id });
      results.added.push({ fullName: user.fullName, email });
    }

    return res.status(200).json({ message: "Bulk import complete.", results });
  } catch (error) {
    console.error("Bulk add error:", error);
    return res.status(500).json({ message: "Bulk import failed" });
  }
};

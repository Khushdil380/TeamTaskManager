import jwt from "jsonwebtoken";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import TeamMember from "../models/TeamMember.js";

const decodeToken = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw new Error("No token provided");
  return jwt.verify(token, process.env.JWT_SECRET);
};

// GET /api/dashboard/stats?view=admin|member
export const getDashboardStats = async (req, res) => {
  try {
    const { userId } = decodeToken(req);
    const viewMode = req.query.view === "member" ? "member" : "admin";

    // All projects the user administers or is a member of
    const projects = await Project.find({
      $or: [{ adminId: userId }, { members: userId }],
    })
      .sort({ createdAt: -1 })
      .populate("members", "fullName avatar");

    const projectIds = projects.map((p) => p._id);

    // All tasks across those projects
    const allTasks = await Task.find({ projectId: { $in: projectIds } })
      .populate("assignedTo", "fullName avatar")
      .populate("projectId", "title color");

    // Member view: scope to only tasks assigned to this user
    const scopedTasks =
      viewMode === "member"
        ? allTasks.filter((t) =>
            t.assignedTo?.some((a) => a._id?.toString() === userId.toString()),
          )
        : allTasks;

    // Unique team members added by this admin
    const teamMemberCount = await TeamMember.countDocuments({
      adminId: userId,
    });

    // Aggregate task stats
    const tasksByStatus = { todo: 0, "in-progress": 0, completed: 0 };
    const tasksByPriority = { low: 0, medium: 0, high: 0 };
    const tasksByProject = {};
    const now = new Date();
    let overdueTasks = 0;

    scopedTasks.forEach((t) => {
      tasksByStatus[t.status] = (tasksByStatus[t.status] || 0) + 1;
      tasksByPriority[t.priority] = (tasksByPriority[t.priority] || 0) + 1;

      if (
        t.deadline &&
        new Date(t.deadline) < now &&
        t.status !== "completed"
      ) {
        overdueTasks++;
      }

      const pid = t.projectId?._id?.toString() || t.projectId?.toString();
      if (pid) {
        if (!tasksByProject[pid])
          tasksByProject[pid] = { total: 0, completed: 0 };
        tasksByProject[pid].total++;
        if (t.status === "completed") tasksByProject[pid].completed++;
      }
    });

    const totalTasks = scopedTasks.length;
    const completedTasks = tasksByStatus.completed;
    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Project status distribution
    const projectsByStatus = {};
    projects.forEach((p) => {
      projectsByStatus[p.status] = (projectsByStatus[p.status] || 0) + 1;
    });

    // Projects enriched with task progress (up to 6 most recent)
    const projectsWithStats = projects.slice(0, 6).map((p) => {
      const ts = tasksByProject[p._id.toString()] || {
        total: 0,
        completed: 0,
      };
      return {
        _id: p._id,
        title: p.title,
        color: p.color,
        status: p.status,
        priority: p.priority,
        dueDate: p.dueDate,
        memberCount: p.members.length,
        taskStats: {
          ...ts,
          pct: ts.total > 0 ? Math.round((ts.completed / ts.total) * 100) : 0,
        },
      };
    });

    // 6 most recently created tasks
    const recentTasks = [...scopedTasks]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6)
      .map((t) => ({
        _id: t._id,
        title: t.title,
        status: t.status,
        priority: t.priority,
        deadline: t.deadline,
        createdAt: t.createdAt,
        projectTitle: t.projectId?.title || "—",
        projectColor: t.projectId?.color,
        assignedTo: t.assignedTo,
      }));

    res.json({
      stats: {
        totalProjects: projects.length,
        totalTasks,
        completedTasks,
        completionRate,
        overdueTasks,
        teamMemberCount,
        tasksByStatus,
        tasksByPriority,
        projectsByStatus,
      },
      projects: projectsWithStats,
      recentTasks,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

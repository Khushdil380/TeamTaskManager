// TASK CONFIG — shared constants for task/project status, priority, and stripe colors

// Project stripe colors — matches .proj-stripe-1..8 in Projects.css
export const STRIPE_COLORS = [
  "", // index 0 unused
  "#ff6a33", // 1 orange
  "#6366f1", // 2 indigo
  "#22c55e", // 3 green
  "#ef4444", // 4 red
  "#f59e0b", // 5 amber
  "#3b82f6", // 6 blue
  "#8b5cf6", // 7 purple
  "#14b8a6", // 8 teal
];

// Task status config — label, text color, background chip color
export const TASK_STATUS_CFG = {
  todo: { label: "To Do", color: "#94a3b8", bg: "rgba(148,163,184,0.12)" },
  "in-progress": {
    label: "In Progress",
    color: "#60a5fa",
    bg: "rgba(59,130,246,0.15)",
  },
  completed: {
    label: "Completed",
    color: "#4ade80",
    bg: "rgba(34,197,94,0.15)",
  },
};

// Task priority config — label, text color, background chip color
export const PRIORITY_CFG = {
  high: { label: "High", color: "#f87171", bg: "rgba(239,68,68,0.18)" },
  medium: { label: "Medium", color: "#fbbf24", bg: "rgba(245,158,11,0.18)" },
  low: { label: "Low", color: "#4ade80", bg: "rgba(34,197,94,0.18)" },
};

// Project status display labels
export const PROJECT_STATUS_LABEL = {
  "in-progress": "In Progress",
  completed: "Completed",
  "on-hold": "On Hold",
  cancelled: "Cancelled",
};

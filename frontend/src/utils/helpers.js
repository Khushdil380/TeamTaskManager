// GENERAL HELPERS — shared utility functions

export const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Greeting based on time of day
export const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

// Today's date formatted as long string
export const formatToday = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// Short date string (e.g. "Jan 5, 2025")
export const formatDate = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Deadline with overdue flag — returns { label, overdue } or null
export const formatDeadline = (d) => {
  if (!d) return null;
  const date = new Date(d);
  const diff = Math.floor((date - new Date()) / 86400000);
  if (diff < 0) return { label: "Overdue", overdue: true };
  if (diff === 0) return { label: "Today", overdue: false };
  if (diff === 1) return { label: "Tomorrow", overdue: false };
  return {
    label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    overdue: false,
  };
};

// True when a date is past today and status is not completed/cancelled
export const isOverdue = (dateStr, status) => {
  if (!dateStr || status === "completed" || status === "cancelled") return false;
  return new Date(dateStr) < new Date();
};
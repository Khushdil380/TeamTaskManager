// AVATAR CONFIG - 10 preset avatar color options (5x2 grid)

export const AVATAR_OPTIONS = [
  { id: 1, bg: "linear-gradient(135deg, #ff6a33, #ff8b60)" },
  { id: 2, bg: "linear-gradient(135deg, #6366f1, #818cf8)" },
  { id: 3, bg: "linear-gradient(135deg, #22c55e, #4ade80)" },
  { id: 4, bg: "linear-gradient(135deg, #ef4444, #f87171)" },
  { id: 5, bg: "linear-gradient(135deg, #f59e0b, #fbbf24)" },
  { id: 6, bg: "linear-gradient(135deg, #3b82f6, #60a5fa)" },
  { id: 7, bg: "linear-gradient(135deg, #8b5cf6, #a78bfa)" },
  { id: 8, bg: "linear-gradient(135deg, #ec4899, #f472b6)" },
  { id: 9, bg: "linear-gradient(135deg, #14b8a6, #2dd4bf)" },
  { id: 10, bg: "linear-gradient(135deg, #f97316, #fb923c)" },
];

export const DEFAULT_AVATAR_ID = 1;

export const getAvatarById = (id) =>
  AVATAR_OPTIONS.find((a) => a.id === Number(id)) || AVATAR_OPTIONS[0];

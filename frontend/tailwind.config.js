/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        primary: "#FF6A33",
        "primary-hover": "#E85A26",
        accent: "#FF8B60",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#3B82F6",

        // Background Colors
        "bg-main": "#0F1115",
        "bg-secondary": "#161A22",
        "bg-sidebar": "#11151C",
        "bg-card": "#1B2230",
        "bg-elevated": "#222B3A",
        "bg-surface": "#1E2635",

        // Text Colors
        "text-primary": "#F8FAFC",
        "text-secondary": "#CBD5E1",
        "text-muted": "#94A3B8",
        "text-disabled": "#64748B",

        // Border Colors
        "border-primary": "#2D3748",
        "border-active": "#FF6A33",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "heading-xl": "36px",
        "heading-lg": "30px",
        "heading-md": "24px",
        body: "16px",
        small: "14px",
        caption: "12px",
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        card: "20px",
      },
      boxShadow: {
        "soft-card": "0 4px 20px rgba(0,0,0,0.18)",
        elevated: "0 10px 40px rgba(0,0,0,0.28)",
        hover: "0 12px 32px rgba(0,0,0,0.30)",
        "glow-primary": "0 0 20px rgba(255,106,51,0.18)",
        "glow-strong": "0 0 32px rgba(255,106,51,0.28)",
      },
    },
  },
  plugins: [],
};

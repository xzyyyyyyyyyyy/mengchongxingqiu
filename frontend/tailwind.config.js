/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF6F61",
        secondary: "#33C8A0",
        accent: "#FFC94A",
        background: {
          light: "#F7F7F9",
          dark: "#1F2328",
        },
        text: {
          primary: "#1F2328",
          secondary: "#6B7280",
        },
      },
      fontFamily: {
        display: ["Noto Sans SC", "SF Pro", "sans-serif"],
      },
      borderRadius: {
        none: "0",
        sm: "0.125rem",
        DEFAULT: "0.5rem",
        md: "0.375rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
        "3xl": "3rem",
        full: "9999px",
      },
      boxShadow: {
        soft: "0 4px 12px 0 rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};

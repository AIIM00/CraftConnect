/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0D3B66",
        "primary-light": "#3A86B5",

        accent: "#F4A261",
        "accent-hover": "#E76F51",
        "accent-soft": "#FFD6A5",

        bg: "#F5F7FA",
        surface: "#FFFFFF",

        text: "#1A202C",
        "text-muted": "#A0AEC0",

        success: "#48BB78",
        warning: "#F6AD55",
        info: "#4299E1",
        error: "#F56565",
      },
    },
  },
  plugins: [],
};

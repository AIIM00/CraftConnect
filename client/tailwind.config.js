/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        body: ["Inter", "sans-serif"],
        heading: ["Playfair Display", "serif"],
        display: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: "#133A63",
        "primary-light": "#A9D1E8",
        "primary-dark": "#0B2540",

        accent: "#DAA520",
        "accent-hover": "#B8860B",
        "accent-soft": "#F6E7B4",

        bg: "#F7F4ED",
        "bg-soft": "#EAE3D4",

        surface: "#FFFFFF",
        "surface-soft": "#F3EFE6",
        "surface-dark": "#133A63",

        text: "#1F2933",
        "text-muted": "#8C99A8",
        "text-light": "#F7F4ED",

        navy: "#133A63",
        gold: "#DAA520",
        sky: "#A9D1E8",
        sandstone: "#EAE3D4",
        steel: "#8C99A8",
        teal: "#008080",
        rust: "#C0504D",
        olive: "#556B2F",

        success: "#556B2F",
        warning: "#DAA520",
        info: "#008080",
        error: "#C0504D",
      },

      boxShadow: {
        soft: "0 12px 35px rgba(19, 58, 99, 0.12)",
        card: "0 18px 45px rgba(19, 58, 99, 0.14)",
        glass: "0 25px 70px rgba(19, 58, 99, 0.22)",
        glow: "0 0 30px rgba(218, 165, 32, 0.28)",
      },

      backgroundImage: {
        "craft-gradient":
          "linear-gradient(135deg, #133A63 0%, #0B2540 45%, #008080 100%)",
        "gold-gradient": "linear-gradient(180deg, #DAA520 0%, #B8860B 100%)",
        "soft-gradient":
          "linear-gradient(135deg, #F7F4ED 0%, #EAE3D4 55%, #A9D1E8 100%)",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },

      colors: {
        primary: {
          DEFAULT: "#0f4c8c",
          hover: "#12365c",
        },

        secondary: {
          DEFAULT: "#e1a50d",
          hover: "#987806",
          soft: "#F6E7B4",
        },

        background: {
          DEFAULT: "#F2F2F2",
          dark: "#FFFFFF",
          light: "#E6E6E6",
        },

        text: {
          DEFAULT: "#1F2933",
          muted: "#8C99A8",
        },

        border: {
          DEFAULT: "#8e8b86",
          soft: "#dad4ca",
        },

        success: {
          DEFAULT: "#2f7721",
        },

        warning: {
          DEFAULT: "#dabb20",
        },

        danger: {
          DEFAULT: "#c12020",
        },

        info: {
          DEFAULT: "#794ece",
        },
      },

      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "32px",
      },

      boxShadow: {
        soft: "0 8px 24px rgba(19, 58, 99, 0.08)",
        card: "0 18px 45px rgba(19, 58, 99, 0.12)",
        elevated: "0 24px 60px rgba(19, 58, 99, 0.16)",
        glass: "0 25px 70px rgba(19, 58, 99, 0.18)",
        glow: "0 0 30px rgba(218, 165, 32, 0.25)",
      },

      backgroundImage: {
        "primary-gradient":
          "linear-gradient(135deg, #133A63 0%, #0B2540 55%, #008080 100%)",

        "secondary-gradient":
          "linear-gradient(180deg, #DAA520 0%, #B8860B 100%)",

        "soft-gradient":
          "linear-gradient(135deg, #F7F4ED 0%, #EAE3D4 55%, #A9D1E8 100%)",
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },

      transitionDuration: {
        250: "250ms",
        400: "400ms",
      },

      backdropBlur: {
        xs: "2px",
      },

      maxWidth: {
        container: "1280px",
      },
    },
  },

  plugins: [],
};

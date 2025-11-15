import { heroui } from "@heroui/theme";
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },

      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            lineHeight: "1.8",
            p: {
              marginTop: "0",
              marginBottom: "1em",
            },
            h1: {
              fontWeight: "700",
              fontSize: "2.25rem",
              marginTop: "0",
            },
            h2: {
              fontWeight: "600",
              fontSize: "1.75rem",
              marginTop: "2rem",
              marginBottom: "1rem",
            },
            a: {
              color: "#2563eb", // blue-600
              textDecoration: "underline",
              "&:hover": {
                color: "#1d4ed8", // blue-700
              },
            },
            ul: {
              paddingLeft: "1.25rem",
              marginBottom: "1rem",
            },
            li: {
              marginBottom: "0.5rem",
            },
          },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [heroui(), typography],
};

module.exports = config;

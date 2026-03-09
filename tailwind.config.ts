import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff8ff",
          100: "#d8ecff",
          200: "#b6dcff",
          300: "#84c4ff",
          400: "#4aa3ff",
          500: "#1f85ff",
          600: "#0f67d7",
          700: "#1054ad",
          800: "#144a8f",
          900: "#164076",
        },
      },
      boxShadow: {
        glow: "0 10px 30px -12px rgb(31 133 255 / 0.45)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 350ms ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;

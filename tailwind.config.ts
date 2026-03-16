import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      colors: {
        wizard: {
          ink: "#1a1a2e",
          slate: "#16213e",
          accent: "#e94560",
          gold: "#f0b429",
          mint: "#a8e6cf",
          primary: "#14b8a6",
          "primary-hover": "#0d9488",
        },
      },
      borderRadius: {
        "form": "1rem",
        "card": "1.25rem",
      },
      boxShadow: {
        "card": "0 4px 24px -4px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.04)",
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          950: "#0a0a0a",
          900: "#121212",
          800: "#1f1f1f",
          700: "#2e2e2e",
          600: "#484848",
          500: "#666666",
          400: "#8a8a8a",
          300: "#b0b0b0",
          200: "#d6d6d6",
          100: "#e8e8e8",
        },
        blue: {
          600: "#2563eb",
          500: "#3b82f6",
          400: "#60a5fa",
        }
      },
    },
  },
  plugins: [],
};

export default config;

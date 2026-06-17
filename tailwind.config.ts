import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      darkMode: "class",
      colors: {
        surface: "var(--surface)",
        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",
        title: "var(--title)",
        subtitle: "var(--subtitle)",
        content: "var(--text)",
        brand: "var(--brand)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        theme: "linear-gradient(180deg, var(--grad-1) 0%, var(--grad-2) 55%, var(--grad-3) 100%)",
      },
      keyframes: {
        "color-change": {
          "0%": { borderColor: "#19dcea" },
          "25%": { borderColor: "#b22cff" },
          "50%": { borderColor: "#ea2222" },
          "75%": { borderColor: "#f5be10" },
          "100%": { borderColor: "#3bd80d" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        colorChange: "color-change 5s linear infinite alternate both",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-out": "fade-out 0.5s ease-out",
      },
    },
  },
  plugins: [],
}
export default config

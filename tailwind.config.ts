
import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { 500: "#6D4AFF", 600: "#5A36FF" }
      },
      borderRadius: { xl: "1.25rem", "2xl": "1.5rem" },
      boxShadow: { soft: "0 4px 24px rgba(0,0,0,0.06)" }
    }
  },
  plugins: []
};
export default config;

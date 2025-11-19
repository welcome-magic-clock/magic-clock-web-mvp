import type { Config } from "tailwindcss"
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#2563eb", 2: "#7c3aed" },
      },
      boxShadow: {
        soft: "0 10px 28px rgba(30,64,175,.08), 0 6px 16px rgba(124,58,237,.06)",
      }
    },
  },
  plugins: [],
}
export default config
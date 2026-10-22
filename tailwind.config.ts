import type { Config } from "tailwindcss";

const config: Config = { content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"], theme: { extend: { colors: { ink: "#15211d", moss: { 50: "#f2f7f1", 100: "#e4eee1", 500: "#4f825b", 600: "#3c6e4b", 700: "#28543a" } }, boxShadow: { soft: "0 12px 32px rgba(21,33,29,.08)" } }, }, plugins: [] };
export default config;

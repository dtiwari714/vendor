import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Simple Vite config - React plugin only, no extra complexity needed.
export default defineConfig({
  plugins: [react()],
});

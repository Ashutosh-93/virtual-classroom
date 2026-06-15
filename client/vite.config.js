// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // CRITICAL FOR TAILWIND V4

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // This forces Vite to compile your CSS theme variants!
  ],
});
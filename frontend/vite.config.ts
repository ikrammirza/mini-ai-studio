import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  test: {
    globals: true,           // so you can use test(), expect(), vi() globally
    environment: 'jsdom',    // ✅ needed for React Testing Library
    setupFiles: './tests/setup.ts', // optional, for jest-dom matchers
  },
});

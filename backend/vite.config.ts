import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: [],
  },
  resolve: {
    alias: {
      '@controllers': path.resolve(__dirname, 'src/controllers'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@middleware': path.resolve(__dirname, 'src/middleware'),
      '@validators': path.resolve(__dirname, 'src/validators'),
      '@types': path.resolve(__dirname, 'src/types'),
    },
  },
});

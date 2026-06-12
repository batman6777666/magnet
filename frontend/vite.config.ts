import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 5173,
    proxy: {
      '/auth': 'http://localhost:3000',
      '/v1': 'http://localhost:3000',
      '/health': 'http://localhost:3000',
      '/inspect': 'http://localhost:3000',
    },
  },
  build: {
    outDir: 'dist',
  },
});

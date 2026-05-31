import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  define: {
    global: 'globalThis',
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core
          if (
            id.includes('react') ||
            id.includes('react-dom') ||
            id.includes('react-router-dom')
          ) {
            return 'vendor';
          }

          // UI libraries
          if (
            id.includes('lucide-react') ||
            id.includes('framer-motion')
          ) {
            return 'ui';
          }

          // Form libraries
          if (
            id.includes('react-hook-form') ||
            id.includes('@hookform/resolvers') ||
            id.includes('zod')
          ) {
            return 'forms';
          }

          // Charts
          if (id.includes('recharts')) {
            return 'charts';
          }

          // WebSocket / STOMP
          if (
            id.includes('@stomp/stompjs') ||
            id.includes('sockjs-client')
          ) {
            return 'stomp';
          }

          // Remaining node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },

  server: {
    port: 5173,
  },
});

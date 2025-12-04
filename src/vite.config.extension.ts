import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Chrome Extension용 Vite 설정
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        // Background Service Worker
        background: resolve(__dirname, 'src/background/background.ts'),
        // Content Script
        content: resolve(__dirname, 'src/content/content.tsx'),
        // Side Panel
        sidepanel: resolve(__dirname, 'src/sidepanel/sidepanel.html'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // background.ts → background.js
          // content.tsx → content.js
          return '[name].js';
        },
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // CSS 파일은 content.css로
          if (assetInfo.name === 'content.css') {
            return 'content.css';
          }
          return 'assets/[name]-[hash].[ext]';
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});

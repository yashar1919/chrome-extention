import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    tailwindcss(),
    crx({ manifest })
  ],
  build: {
    outDir: 'dist', // خروجی build برای Chrome Extension
  }
});


/* import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        //eslint-disable-next-line
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  publicDir: 'public',
}) */

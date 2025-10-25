import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: "./",
  plugins: [
    react({
      // بهینه‌سازی React برای production
      babel: {
        plugins: []
      }
    }),
    tailwindcss(),
    crx({ manifest })
  ],
  build: {
    outDir: 'dist',
    // بهینه‌سازی build برای Chrome Extension
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // حذف console.log ها
        drop_debugger: true, // حذف debugger ها
        pure_funcs: ['console.log', 'console.warn', 'console.error'], // حذف console functions
      },
      format: {
        comments: false, // حذف کامنت‌ها
      },
    },
    rollupOptions: {
      output: {
        // بهینه‌سازی chunk splitting
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'antd': ['antd'],
          'dnd': ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
          'calendar': ['react-multi-date-picker', 'react-date-object'],
        },
        // کاهش نام فایل‌ها برای کروم اکستنشن
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
    // حداقل سایز برای warning
    chunkSizeWarningLimit: 1000,
  },
  // بهینه‌سازی dependency pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'antd',
      '@dnd-kit/core',
      '@dnd-kit/sortable',
      'react-multi-date-picker',
      'vanilla-tilt',
      'zustand'
    ],
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

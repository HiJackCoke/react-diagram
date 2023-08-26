import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
   plugins: react(),

   resolve: {
      alias: {
         components: path.resolve(__dirname, 'src/components'),
         container: path.resolve(__dirname, 'src/container'),
         utils: path.resolve(__dirname, 'src/utils'),
         types: path.resolve(__dirname, 'src/types'),
         hooks: path.resolve(__dirname, 'src/hooks'),
         contexts: path.resolve(__dirname, 'src/contexts'),
         store: path.resolve(__dirname, 'src/store'),
      },
   },

   build: {
      minify: 'terser',
      terserOptions: {
         compress: {
            drop_console: true,
         },
      },
      outDir: path.resolve(__dirname, 'dist'),
   },
});

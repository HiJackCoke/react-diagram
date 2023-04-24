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
      },
   },
});

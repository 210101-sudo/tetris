import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: '/tetris/',
  root: path.resolve(__dirname, 'src'),
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  server: {
    open: true,
  },
});

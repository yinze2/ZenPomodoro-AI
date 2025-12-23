import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // 确保在 GitHub Pages 或其他子目录下资源路径正确
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'esbuild',
    target: 'modules'
  },
  server: {
    port: 3000,
    strictPort: true
  }
});
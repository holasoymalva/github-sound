import { defineConfig } from 'vite';

export default defineConfig({
  base: '/github-sound/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  }
});

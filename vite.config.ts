import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages project site: https://<user>.github.io/MultiverseOfMadness/
const base =
  process.env.GITHUB_PAGES === 'true' ? '/MultiverseOfMadness/' : '/';

export default defineConfig({
  plugins: [react()],
  base,
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  server: { host: '0.0.0.0' },
  preview: { host: '0.0.0.0' },
});

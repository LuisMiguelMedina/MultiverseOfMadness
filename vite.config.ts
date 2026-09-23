import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

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
    rollupOptions: {
      input: {
        index: path.resolve(rootDir, 'index.dev.html'),
      },
    },
  },
  server: { host: '0.0.0.0' },
  preview: { host: '0.0.0.0' },
});

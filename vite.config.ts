import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Standalone Multiverse of Madness portal, served at the domain root.
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  server: { host: '0.0.0.0' },
  preview: { host: '0.0.0.0' },
});

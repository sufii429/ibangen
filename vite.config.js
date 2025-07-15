import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/ibangen/',      // ← بالکل یہی لائن لازم
  plugins: [react()],
});

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Served from https://byocao.github.io/game-store/
export default defineConfig({
  base: '/game-store/',
  plugins: [react()],
  test: {
    environment: 'node',
  },
});

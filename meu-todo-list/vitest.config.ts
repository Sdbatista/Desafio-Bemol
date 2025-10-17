/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Permite usar 'describe', 'it', 'expect' sem importar
    environment: 'jsdom', // Simula o navegador
    setupFiles: './src/setupTests.ts', // Arquivo de setup (vamos criar)
    css: true, // Habilita o parsing de CSS (para CSS Modules)
  },
});
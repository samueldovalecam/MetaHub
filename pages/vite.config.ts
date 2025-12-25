import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.'),
        'react': path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'node_modules/react'),
        'react-dom': path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'node_modules/react-dom'),
        'react/jsx-runtime': path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'node_modules/react/jsx-runtime.js'),
        'lucide-react': path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'node_modules/lucide-react'),
      }
    }
  };
});

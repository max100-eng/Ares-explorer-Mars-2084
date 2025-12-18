import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 1. Escuchar en 0.0.0.0 para que el contenedor sea accesible
    host: '0.0.0.0',
    
    // 2. Usar la variable de entorno PORT (que Cloud Run establece a 8080)
    port: process.env.PORT ? parseInt(process.env.PORT) : 5173, 
    // Usamos 5173 como fallback local, pero Cloud Run usará 8080
  },
});
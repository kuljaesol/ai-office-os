import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        react()
    ],
    server: {
        port: 5173,
        host: true, // bind 0.0.0.0 — required for Codespaces/remote port forwarding (avoids IPv6 ::1-only binding)
        proxy: {
            '/api': 'http://localhost:3000',
        }
    },
    build: {
        outDir: 'dist'
    }
});

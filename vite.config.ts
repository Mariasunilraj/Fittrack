import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import {
  handleAnalyzeFoodPhoto,
  handleAiChat,
  handleCalisthenicsApi,
  handleGymApi,
  handleVaultStatus,
  handleNeonHealth,
  handleNeonSync
} from './server/apiHandler.js';

dotenv.config();

function secureVaultApiPlugin(): Plugin {
  return {
    name: 'fittrack-secure-vault-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];

        if (url?.startsWith('/api/')) {
          res.setHeader('Content-Type', 'application/json');

          // Helper to parse JSON body for POST requests
          const getBody = () =>
            new Promise<any>((resolve) => {
              let raw = '';
              req.on('data', chunk => {
                raw += chunk;
              });
              req.on('end', () => {
                try {
                  resolve(raw ? JSON.parse(raw) : {});
                } catch {
                  resolve({});
                }
              });
            });

          // Mock express res helper
          const mockRes: any = {
            status(code: number) {
              res.statusCode = code;
              return mockRes;
            },
            json(data: any) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return mockRes;
            }
          };

          if (req.method === 'POST' && url === '/api/nutrition/analyze-photo') {
            const body = await getBody();
            return handleAnalyzeFoodPhoto({ body } as any, mockRes);
          }

          if (req.method === 'POST' && url === '/api/ai/chat') {
            const body = await getBody();
            return handleAiChat({ body } as any, mockRes);
          }

          if (req.method === 'GET' && url === '/api/exercises/calisthenics') {
            return handleCalisthenicsApi({} as any, mockRes);
          }

          if (req.method === 'GET' && url === '/api/exercises/gym') {
            return handleGymApi({} as any, mockRes);
          }

          if (req.method === 'GET' && url === '/api/vault/status') {
            return handleVaultStatus({} as any, mockRes);
          }

          if (req.method === 'GET' && url === '/api/db/health') {
            return handleNeonHealth({} as any, mockRes);
          }

          if (req.method === 'POST' && url === '/api/db/sync') {
            const body = await getBody();
            return handleNeonSync({ body } as any, mockRes);
          }
        }

        next();
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), secureVaultApiPlugin()],
  server: {
    port: 5173,
    host: true
  }
});

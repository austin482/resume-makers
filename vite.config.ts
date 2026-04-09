import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-routes',
      configureServer(server) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const syncRicebowl = require('./api/sync-ricebowl.js').default;
        server.middlewares.use(async (req: any, res, next) => {
          if (req.url === '/api/sync-ricebowl' && req.method === 'POST') {
            let body = '';
            req.on('data', (chunk: string) => body += chunk);
            req.on('end', async () => {
              try { req.body = JSON.parse(body); } catch(e) { req.body = {}; }
              await syncRicebowl(req, res);
            });
          } else {
            next();
          }
        });
      }
    }
  ],
})

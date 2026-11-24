import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express, { type Request, type Response } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

async function startServer(): Promise<void> {
  const app = express();
  app.disable('x-powered-by');

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'tatkhalsa-pothi-sahib',
    });
  });

  // Consolidate legacy /pothi paths cleanly to root
  app.use((req: Request, res: Response, next) => {
    if (req.path === '/pothi' || req.path.startsWith('/pothi/')) {
      const target = req.path.replace(/^\/pothi\/?/, '/') || '/';
      res.redirect(301, target);
      return;
    }
    next();
  });

  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(
      '/assets',
      express.static(path.join(distDir, 'assets'), {
        maxAge: '1y',
        immutable: true,
        fallthrough: false,
      }),
    );
    app.use(express.static(distDir, { index: false }));

    app.use((req: Request, res: Response, next) => {
      if (req.method !== 'GET' || req.path.startsWith('/api/')) {
        next();
        return;
      }
      const cleanSeg = req.path.replace(/^\/+|\/+$/g, '');
      const allowedPrerenderRoutes = new Set([
        'searcher',
        'gurbani',
        'gutka',
        'reader',
        'pothi-present',
      ]);
      const candidateHtml = allowedPrerenderRoutes.has(cleanSeg)
        ? path.join(distDir, cleanSeg, 'index.html')
        : path.join(distDir, 'index.html');
      const resolvedHtml = fs.existsSync(candidateHtml)
        ? candidateHtml
        : path.join(distDir, 'index.html');

      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
      res.sendFile(resolvedHtml);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tatkhalsa Pothi Sahib server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Tatkhalsa Pothi Sahib server:', err);
  process.exit(1);
});

import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';

import express, { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import cors from 'cors';
import fs from 'fs';
import http from 'http';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';
import bootstrap from './src/main.server';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

const commonEngine = new CommonEngine();

// Function to determine if compression should be applied
function shouldCompress(req: Request, res: Response) {
  if (req.headers['x-no-compression']) {
    return false;
  }
  return compression.filter(req, res);
}

// Build the main SSR app
export function app() {
  const server = express();

  // Middleware: Compression, CORS
  server.use(compression({ filter: shouldCompress, threshold: 0 }));
  server.use(cors());

  // Serve static files
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y',
    index: false
  }));

  // Proxy setup (for /api requests)
  server.use('/api/**', createProxyMiddleware({
    target: 'http://66.179.188.169:8090',
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/api': '/api' },
    ws: true
  }));

  // SSR Route handler (for all non-static routes)
  server.get('*', async (req: Request, res: Response, next: NextFunction) => {
    try {
      //consolie.log(`✅ SSR Rendering for: ${req.originalUrl}`);

      if (!fs.existsSync(indexHtml)) {
        //consolie.error('❌ SSR template missing:', indexHtml);
        return res.status(500).send('SSR template not found.');
      }

      const html = await commonEngine.render({
        bootstrap, // This is your AppServerModule or standalone bootstrap function
        documentFilePath: indexHtml,
        url: req.originalUrl,
        publicPath: browserDistFolder,
        providers: [
          { provide: APP_BASE_HREF, useValue: req.baseUrl }
        ]
      });

      return res.status(200).send(html);
    } catch (err) {
      //consolie.error('❌ SSR Rendering Error:', err);
      return res.status(500).send('Internal Server Error');
    }
  });

  return server;
}

// Entry point
function run(): void {
  const port = process.env['PORT'] || 4000;

  const ssrApp = app(); // Create SSR app once

  // Optional: Redirect naked domain to www.
  const appWithRedirect = express();
  appWithRedirect.use((req, res, next) => {
    const host = req.headers.host;
    if (host === 'naarideals.com') {
      return res.redirect(301, 'https://www.naarideals.com' + req.url);
    }
    next();
  });

  appWithRedirect.use(ssrApp); // Use the SSR app

  const server = http.createServer(appWithRedirect);
  server.listen(port, () => {
    //consolie.log(`🚀 Node SSR server listening at http://localhost:${port}`);
  });
}

run();

// Required export for SSR build
// export * from './src/main.server';
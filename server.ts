import { APP_BASE_HREF } from '@angular/common';
import { renderApplication } from '@angular/platform-server';

import { CommonEngine } from '@angular/ssr/node';
import express, { Express, Request, Response, NextFunction } from 'express';
import compression from 'compression';
import cors from 'cors';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import fs from 'fs';
import http from 'http';
import { createProxyMiddleware, Options } from 'http-proxy-middleware'; 

// Function to determine if compression should be applied
function shouldCompress(req: Request, res: Response) {
  if (req.headers['x-no-compression']) {
    return false;
  }
  return compression.filter(req, res);
}


// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
    const server = express();
    const options: compression.CompressionOptions = {
        filter: shouldCompress,
        threshold: 0
    };
    server.use(compression(options));
    server.use(cors());
    
    const serverDistFolder = dirname(fileURLToPath(import.meta.url));
    const browserDistFolder = resolve(serverDistFolder, '../browser');
    const indexHtml = join(serverDistFolder, 'index.server.html');

    const commonEngine = new CommonEngine();

    server.set('view engine', 'html');
    server.set('views', browserDistFolder);

    // Example Express Rest API endpoints
    // server.get('/api/**', (req, res) => { });
    // Serve static files from /browser
    server.get('**', express.static(browserDistFolder, {
        maxAge: '1y',
        index: 'index.html',
    }));

    const proxyOptions: any = {
        target: "http://66.179.188.169:8090",
        changeOrigin: true,
        secure: false,  // Ensure HTTPS does not interfere
        logLevel: "debug",  // Logs details for debugging
        pathRewrite: {
            [`^/api`]: '/api',
        },
        ws: true
        };

    // Use proxy middleware in Express server
    server.use('/api/**', createProxyMiddleware(proxyOptions));


    // All regular routes use the Angular engine
    // server.get('**', (req, res, next) => {
    //     const { protocol, originalUrl, baseUrl, headers } = req;

    //     commonEngine
    //     .render({
    //         bootstrap,
    //         documentFilePath: indexHtml,
    //         url: `${protocol}://${headers.host}${originalUrl}`,
    //         publicPath: browserDistFolder,
    //         providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
    //     })
    //     .then((html) => res.send(html))
    //     .catch((err) => next(err));
    // });

    
    server.get('*', async (req: Request, res: Response, next: NextFunction) => {
        try {
        console.log(`SSR Rendering for: ${req.originalUrl}`);
    
        if (!fs.existsSync(indexHtml)) {
            console.error("SSR template missing:", indexHtml);
            return res.status(500).send("SSR template not found.");
        }
    
        const html = await renderApplication(bootstrap, {
            document: fs.readFileSync(indexHtml, 'utf8'),
            url: req.originalUrl,
            platformProviders: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
        });
        console.log(`SERVER: Received Request for Page`);
        return res.send(html); // ✅ Ensure the function always returns
        } catch (err) {
        console.error("SSR Rendering Error:", err);
        return res.status(500).send("Internal Server Error"); // ✅ Ensure return on error
        }
    });

    return server;
}

// function run(): void {
//     const port = process.env['PORT'] || 4000;

//     // Start up the Node server
//     const server = app();
//     server.listen(port, () => {
//         console.log(`Node Express server listening on http://localhost:${port}`);
//     });
// }

function run(): void {
  const port = Number(process.env['PORT']) || 4000;

    const appWithRedirect = express();
    
      appWithRedirect.use((req, res, next) => {
        const host = req.headers.host;
        if (host === 'naarideals.com') {
          return res.redirect(301, 'https://www.naarideals.com' + req.url);
        }
        next();
      });
    
      appWithRedirect.use(app());

  // HTTP Server
  const server = http.createServer(app());
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}


run();

export * from './src/main.server';
export { renderApplication } from '@angular/platform-server';
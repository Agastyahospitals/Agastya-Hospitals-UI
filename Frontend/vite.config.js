import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync, existsSync } from 'fs';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');

const mimeTypes = {
  css: 'text/css',
  js: 'application/javascript',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  woff: 'font/woff',
  woff2: 'font/woff2',
  ttf: 'font/ttf',
};

/**
 * Vite Dev Plugin: SSG Pre-render Preview
 *
 * Serves pre-rendered HTML with full DOM and compiled CSS stylesheets from dist/,
 * while keeping Vite dev scripts active for HMR.
 */
function ssgDevPreviewPlugin() {
  const distDir = resolve(__dirname, 'dist');

  return {
    name: 'vite-plugin-ssg-dev-preview',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Serve static compiled assets from dist/assets (e.g. index-CsLPPKvc.css)
        if (req.url.startsWith('/assets/')) {
          const assetName = req.url.split('?')[0].replace(/^\/assets\//, '');
          const assetPath = join(distDir, 'assets', assetName);
          if (existsSync(assetPath)) {
            const ext = assetName.split('.').pop()?.toLowerCase();
            res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
            res.statusCode = 200;
            res.end(readFileSync(assetPath));
            return;
          }
        }

        // Only intercept GET HTML navigation requests (skip static files, assets, @vite, /src)
        const accept = req.headers.accept || '';
        const isHtmlNav =
          req.method === 'GET' &&
          (!accept || accept.includes('text/html') || accept.includes('*/*')) &&
          !req.url.startsWith('/@') &&
          !req.url.startsWith('/src') &&
          !req.url.startsWith('/assets') &&
          !req.url.startsWith('/favicon') &&
          !req.url.includes('.js') &&
          !req.url.includes('.css') &&
          !req.url.includes('.png') &&
          !req.url.includes('.jpg') &&
          !req.url.includes('.webp') &&
          !req.url.includes('.svg');

        if (isHtmlNav) {
          const cleanUrl = req.url.split('?')[0].replace(/^\/|\/$/g, '');
          let candidatePath = cleanUrl
            ? join(distDir, cleanUrl, 'index.html')
            : join(distDir, 'index.html');

          // Check singular / plural aliases if direct path not found
          if (!existsSync(candidatePath) && cleanUrl) {
            const aliasPairs = [
              ['specialties/', 'specialty/'],
              ['specialty/', 'specialties/'],
              ['doctors/', 'doctor/'],
              ['doctor/', 'doctors/'],
              ['blogs/', 'blog/'],
              ['blog/', 'blogs/'],
            ];
            for (const [prefix, target] of aliasPairs) {
              if (cleanUrl.startsWith(prefix)) {
                const alt = join(distDir, target, cleanUrl.slice(prefix.length), 'index.html');
                if (existsSync(alt)) {
                  candidatePath = alt;
                  break;
                }
              }
            }
          }

          if (existsSync(candidatePath)) {
            try {
              let html = readFileSync(candidatePath, 'utf-8');

              // Replace production hashed JS bundle script with Vite dev entry script for live HMR
              // Note: We keep the production CSS stylesheet link intact so view-source and initial render have full CSS styles!
              html = html.replace(
                /<script\s+type="module"\s+crossorigin(?:="")?\s+src="\/assets\/index-[^"]+\.js"><\/script>/gi,
                '<script type="module" src="/src/main.jsx"></script>'
              );

              // Transform with Vite to inject @vite/client and React Refresh
              html = await server.transformIndexHtml(req.url, html);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'text/html; charset=utf-8');
              res.end(html);
              return;
            } catch (err) {
              console.error('[SSG Dev Preview] Error serving pre-rendered HTML:', err);
            }
          } else if (
            cleanUrl.startsWith('specialty/') ||
            cleanUrl.startsWith('specialties/') ||
            cleanUrl.startsWith('doctor/') ||
            cleanUrl.startsWith('doctors/') ||
            cleanUrl.startsWith('blog/') ||
            cleanUrl.startsWith('blogs/')
          ) {
            // For known dynamic prefixes that are missing, return true 404
            const notFoundPath = join(distDir, '404.html');
            if (existsSync(notFoundPath)) {
              let html = readFileSync(notFoundPath, 'utf-8');
              res.statusCode = 404;
              res.setHeader('Content-Type', 'text/html; charset=utf-8');
              res.end(html);
              return;
            }
          }
        }
        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ssgDevPreviewPlugin(),
  ],
  server: {
    port: 3002,
    open: true,
  },
});

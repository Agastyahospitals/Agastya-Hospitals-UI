/**
 * Post-build Pre-render Script for Agastya Hospitals
 *
 * Runs after `vite build` to generate fully-rendered static HTML for every route.
 * Uses Puppeteer to visit each page, wait for React + API data to render,
 * then saves the rendered HTML as static files in dist/.
 *
 * Usage: node scripts/prerender.js
 */

import puppeteer from "puppeteer";
import { createServer } from "http";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { getPrerenderRoutes } from "./get-prerender-routes.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = resolve(__dirname, "../dist");
const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

/**
 * Static file server for serving dist/ during pre-rendering.
 * Serves files if present; falls back to dist/index.html for SPA routes.
 */
function createStaticServer() {
  const mimeTypes = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".xml": "application/xml",
    ".txt": "text/plain",
  };

  // Keep a copy of initial SPA index.html template for fallback routing
  const initialIndexHtml = readFileSync(join(DIST_DIR, "index.html"), "utf-8");

  const server = createServer((req, res) => {
    let reqUrl = req.url.split("?")[0];
    let filePath = join(DIST_DIR, reqUrl === "/" ? "index.html" : reqUrl);

    // If path is a directory or has no extension and file doesn't exist, try index.html in subfolder or fallback
    if (!existsSync(filePath) || statSyncQuiet(filePath)?.isDirectory()) {
      const subIndex = join(filePath, "index.html");
      if (existsSync(subIndex)) {
        filePath = subIndex;
      } else {
        // Fallback to original SPA index.html template
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(initialIndexHtml);
        return;
      }
    }

    try {
      const content = readFileSync(filePath);
      const ext = "." + filePath.split(".").pop();
      const contentType = mimeTypes[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    } catch {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(initialIndexHtml);
    }
  });

  return server;
}

function statSyncQuiet(path) {
  try {
    const fs = awaitImportFs();
    return fs.statSync(path);
  } catch {
    return null;
  }
}

import fs from "fs";
function awaitImportFs() {
  return fs;
}

/**
 * Renders a single route and writes output to dist/
 */
async function renderRoute(page, route) {
  const url = `${BASE_URL}${route}`;
  console.log(`  [prerender] Rendering: ${route}`);

  try {
    // Navigate with generous timeout
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });

    // Wait until root has content AND helmet meta tags settled or network is idle
    await Promise.race([
      page.waitForFunction(
        () => {
          const root = document.getElementById("root");
          const hasMeta = document.querySelector('meta[data-rh="true"]') || document.querySelector('meta[name="description"]');
          return root && root.innerHTML.length > 300 && hasMeta;
        },
        { timeout: 15000 }
      ),
      new Promise((resolve) => setTimeout(resolve, 6000)),
    ]);

    // Give 1 second for final DOM updates
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Get full HTML
    let html = await page.content();

    // Remove any remaining raw Vite preview livereload scripts if present
    html = html.replace(/<script type="module" src="\/@vite\/client"><\/script>/g, "");

    // Determine output file path
    let outputPath;
    if (route === "/") {
      outputPath = join(DIST_DIR, "index.html");
    } else {
      const cleanRoute = route.startsWith("/") ? route.slice(1) : route;
      const dir = join(DIST_DIR, cleanRoute);
      mkdirSync(dir, { recursive: true });
      outputPath = join(dir, "index.html");
    }

    writeFileSync(outputPath, html, "utf-8");
    return { route, success: true };
  } catch (err) {
    console.warn(`  ⚠ Failed to render ${route}: ${err.message}`);
    return { route, success: false, error: err.message };
  }
}

async function prerender() {
  console.log("\n🚀 Starting pre-render process...\n");

  const routes = await getPrerenderRoutes();

  const server = createStaticServer();
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`📦 Static preview server running on ${BASE_URL}\n`);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-gpu",
      ],
    });
  } catch (launchErr) {
    console.error("⚠ Failed to launch Puppeteer Chrome:", launchErr.message);
    console.warn("Skipping prerender step. SPA build will remain intact.");
    server.close();
    return;
  }

  const results = [];

  try {
    const CONCURRENCY = 3;
    for (let i = 0; i < routes.length; i += CONCURRENCY) {
      const batch = routes.slice(i, i + CONCURRENCY);
      const batchResults = await Promise.all(
        batch.map(async (route) => {
          let page;
          try {
            page = await browser.newPage();
            await page.setViewport({ width: 1280, height: 800 });

            // Suppress heavy resource requests (images, fonts, media) to speed up rendering
            await page.setRequestInterception(true);
            page.on("request", (req) => {
              const resourceType = req.resourceType();
              if (["image", "stylesheet", "font", "media"].includes(resourceType)) {
                req.abort();
              } else {
                req.continue();
              }
            });

            const res = await renderRoute(page, route);
            await page.close();
            return res;
          } catch (err) {
            if (page) try { await page.close(); } catch {}
            return { route, success: false, error: err.message };
          }
        })
      );
      results.push(...batchResults);
    }
  } finally {
    await browser.close();
    server.close();
  }

  const succeeded = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success);

  console.log(`\n✅ Pre-rendered ${succeeded}/${routes.length} routes successfully.`);
  if (failed.length > 0) {
    console.log(`⚠ Failed routes (${failed.length}):`);
    failed.slice(0, 10).forEach((r) => console.log(`   - ${r.route}: ${r.error}`));
  }
  console.log("");
}

prerender().catch((err) => {
  console.error("Pre-render script encountered an error:", err);
  // Don't fail the build completely if prerender fails
  process.exit(0);
});

/**
 * Local Static Preview Server for Agastya Hospitals
 *
 * Serves the pre-rendered static HTML files from the dist/ folder.
 * Matches clean URLs (e.g. /about -> dist/about/index.html) so that
 * "View Source" in the browser shows full HTML content locally.
 *
 * Usage: node scripts/serve-dist.js
 */

import { createServer } from "http";
import { readFileSync, existsSync, statSync } from "fs";
import { join, dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = resolve(__dirname, "../dist");
// On Render.com (and most cloud platforms), PORT env var is injected automatically.
// Fall back to local dev ports when running locally.
const PREFERRED_PORTS = process.env.PORT
  ? [parseInt(process.env.PORT, 10)]
  : [3003, 3002, 4173, 5000];

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

if (!existsSync(DIST_DIR)) {
  console.error("❌ dist/ folder not found. Please run 'npm run build' first!");
  process.exit(1);
}

const server = createServer((req, res) => {
  const reqUrl = req.url.split("?")[0];
  let filePath = join(DIST_DIR, reqUrl === "/" ? "index.html" : reqUrl);

  // If path has an asset extension (.css, .js, images, fonts) but doesn't exist, return 404 instead of index.html
  const hasAssetExt = /\.(css|js|png|jpg|jpeg|webp|svg|ico|woff|woff2|ttf|json|xml|txt)$/i.test(reqUrl);
  if (hasAssetExt && !existsSync(filePath)) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Asset Not Found");
    return;
  }

  // Clean URL handling (e.g., /about -> dist/about/index.html)
  if (!existsSync(filePath) || (existsSync(filePath) && statSync(filePath).isDirectory())) {
    const subIndex = join(filePath, "index.html");
    const htmlFile = filePath + ".html";
    if (existsSync(subIndex)) {
      filePath = subIndex;
    } else if (existsSync(htmlFile)) {
      filePath = htmlFile;
    } else {
      filePath = join(DIST_DIR, "index.html");
    }
  }

  try {
    const content = readFileSync(filePath);
    const ext = "." + filePath.split(".").pop();
    const contentType = mimeTypes[ext] || "application/octet-stream";
    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0"
    });
    res.end(content);
  } catch (err) {
    res.writeHead(500);
    res.end(`Server Error: ${err.message}`);
  }
});

function listenOnAvailablePort(portsIndex = 0) {
  if (portsIndex >= PREFERRED_PORTS.length) {
    console.error("❌ Could not find an open port.");
    process.exit(1);
  }

  const port = PREFERRED_PORTS[portsIndex];
  server.listen(port, () => {
    console.log(`\n🌐 Local Pre-rendered Preview Server running at:`);
    console.log(`   > http://localhost:${port}`);
    console.log(`\n💡 Open any route in browser (e.g. http://localhost:${port}/about)`);
    console.log(`   Press Ctrl+U (or Right-Click -> View Page Source) to view full pre-rendered HTML!\n`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      listenOnAvailablePort(portsIndex + 1);
    } else {
      console.error("Server error:", err);
    }
  });
}

listenOnAvailablePort();

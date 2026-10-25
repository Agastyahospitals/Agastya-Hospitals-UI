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
// Parse port and host from CLI args (e.g. --port 5137, --port=5137, 5137, --host 127.0.0.1)
let cliPort = null;
let cliHost = "0.0.0.0";
for (let i = 2; i < process.argv.length; i++) {
  const arg = process.argv[i];
  if (arg === "--port" && process.argv[i + 1]) {
    cliPort = parseInt(process.argv[i + 1], 10);
    i++;
  } else if (arg.startsWith("--port=")) {
    cliPort = parseInt(arg.split("=")[1], 10);
  } else if (arg === "--host" && process.argv[i + 1]) {
    cliHost = process.argv[i + 1];
    i++;
  } else if (arg.startsWith("--host=")) {
    cliHost = arg.split("=")[1];
  } else if (/^\d+$/.test(arg)) {
    cliPort = parseInt(arg, 10);
  }
}

// On Render.com (and most cloud platforms), PORT env var is injected automatically.
// Fall back to CLI port or local dev ports when running locally.
const PREFERRED_PORTS = (process.env.PORT || cliPort)
  ? [parseInt(process.env.PORT || cliPort, 10)]
  : [5137, 3003, 3002, 4173, 5000];

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
  let isNotFound = false;
  if (!existsSync(filePath) || (existsSync(filePath) && statSync(filePath).isDirectory())) {
    const subIndex = join(filePath, "index.html");
    const htmlFile = filePath + ".html";
    if (existsSync(subIndex)) {
      filePath = subIndex;
    } else if (existsSync(htmlFile)) {
      filePath = htmlFile;
    } else {
      // Check singular / plural aliases
      let foundAlias = false;
      const cleanReq = reqUrl.replace(/^\/|\/$/g, "");
      const aliasPairs = [
        ["specialties/", "specialty/"],
        ["specialty/", "specialties/"],
        ["doctors/", "doctor/"],
        ["doctor/", "doctors/"],
        ["blogs/", "blog/"],
        ["blog/", "blogs/"],
      ];
      for (const [prefix, target] of aliasPairs) {
        if (cleanReq.startsWith(prefix)) {
          const rest = cleanReq.slice(prefix.length);
          const candidate1 = join(DIST_DIR, target, rest, "index.html");
          const candidate2 = join(DIST_DIR, target, rest + ".html");
          if (existsSync(candidate1)) {
            filePath = candidate1;
            foundAlias = true;
            break;
          } else if (existsSync(candidate2)) {
            filePath = candidate2;
            foundAlias = true;
            break;
          }
        }
      }

      if (!foundAlias) {
        isNotFound = true;
        const notFoundPath = join(DIST_DIR, "404.html");
        filePath = existsSync(notFoundPath) ? notFoundPath : join(DIST_DIR, "index.html");
      }
    }
  }

  try {
    const content = readFileSync(filePath);
    const ext = "." + filePath.split(".").pop();
    const contentType = mimeTypes[ext] || "application/octet-stream";
    res.writeHead(isNotFound ? 404 : 200, {
      "Content-Type": contentType,
      "Cache-Control": isNotFound
        ? "no-cache, no-store, must-revalidate"
        : ext === ".html"
          ? "public, max-age=0, must-revalidate"
          : "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff"
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
  server.listen(port, cliHost, () => {
    const displayHost = cliHost === "0.0.0.0" ? "localhost" : cliHost;
    console.log(`\n🌐 Local Pre-rendered Preview Server running at:`);
    console.log(`   > http://${displayHost}:${port}`);
    console.log(`\n💡 Open any route in browser (e.g. http://${displayHost}:${port}/about)`);
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

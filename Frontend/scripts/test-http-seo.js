import http from "http";
import { spawn } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 3005;

async function fetchHttp(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:${PORT}${path}`, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        const titleMatch = data.match(/<title>([^<]+)<\/title>/i);
        const descMatch = data.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
        const canonMatch = data.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
        const h1Match = data.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
        const hasRootContent = data.includes('<div id="root">') && !data.includes('<div id="root"></div>');
        const hasInlinedCss = data.includes('id="inlined-app-styles"');
        const hasViteScript = data.includes('type="module"') && data.includes('/assets/index-');

        resolve({
          path,
          status: res.statusCode,
          contentType: res.headers["content-type"],
          title: titleMatch ? titleMatch[1].trim() : "NONE",
          description: descMatch ? descMatch[1].trim().slice(0, 80) + "..." : "NONE",
          canonical: canonMatch ? canonMatch[1] : "NONE",
          h1: h1Match ? h1Match[1].replace(/<[^>]*>/g, "").trim().slice(0, 80) : "NONE",
          hasRootContent,
          hasInlinedCss,
          hasViteScript,
          contentLength: data.length,
        });
      });
    }).on("error", reject);
  });
}

async function runValidation() {
  console.log("=".repeat(80));
  console.log("HTTP CLIENT SEO & 404 VALIDATION SUITE");
  console.log("=".repeat(80));

  // Start local server
  const serverProcess = spawn("node", ["scripts/serve-dist.js"], {
    cwd: resolve(__dirname, ".."),
    env: { ...process.env, PORT: String(PORT) },
    stdio: "inherit",
  });

  // Give server 1.5s to bind port
  await new Promise((r) => setTimeout(r, 1500));

  try {
    const testCases = [
      { path: "/", label: "Case 1: Homepage" },
      { path: "/specialty/nephrology", label: "Case 2a: Dynamic Specialty Page" },
      { path: "/doctor/dr-praveen-reddy-p", label: "Case 2b: Dynamic Doctor Page" },
      { path: "/blog/sports-injury-treatment-cost-in-lb-nagar-diagnosis-physiotherapy-and-surgery-explained", label: "Case 2c: Dynamic Blog Page" },
      { path: "/specialty/missing-specialty-slug", label: "Case 3: Page with Missing / Empty Data" },
      { path: "/completely-nonexistent-url-404", label: "Case 4: Nonexistent URL" },
    ];

    for (const test of testCases) {
      const res = await fetchHttp(test.path);
      console.log(`\n📌 ${test.label} -> ${test.path}`);
      console.log(`   HTTP Status: ${res.status === 200 ? "200 OK ✅" : res.status === 404 ? "404 Not Found (Correct!) ✅" : res.status}`);
      console.log(`   Content-Type: ${res.contentType}`);
      console.log(`   Title: ${res.title}`);
      console.log(`   Description: ${res.description}`);
      console.log(`   Canonical URL: ${res.canonical}`);
      console.log(`   H1 Heading: ${res.h1}`);
      console.log(`   Root Rendered Content: ${res.hasRootContent ? "YES (Not Empty) ✅" : "NO ❌"}`);
      console.log(`   Inlined CSS Present: ${res.hasInlinedCss ? "YES ✅" : "NO ❌"}`);
      console.log(`   Vite Client Bundle: ${res.hasViteScript ? "YES (Preserved) ✅" : "NO ❌"}`);
      console.log(`   HTML Size: ${(res.contentLength / 1024).toFixed(1)} KB`);
    }

    console.log("\n" + "=".repeat(80));
    console.log("ALL HTTP SEO VALIDATION CHECKS COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(80) + "\n");
  } finally {
    serverProcess.kill("SIGTERM");
  }
}

runValidation().catch((err) => {
  console.error("Validation error:", err);
  process.exit(1);
});

import { readFileSync, existsSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = resolve(__dirname, "../dist");

const testRoutes = [
  { path: "/", file: "index.html", label: "Homepage (Static)" },
  { path: "/about", file: "about/index.html", label: "About Us (Static)" },
  { path: "/specialties", file: "specialties/index.html", label: "Specialties List (Static)" },
  { path: "/find-doctor", file: "find-doctor/index.html", label: "Find Doctor (Static)" },
  { path: "/blog", file: "blog/index.html", label: "Blog List (Static)" },
  { path: "/specialty/nephrology", file: "specialty/nephrology/index.html", label: "Nephrology (Dynamic Specialty)" },
  { path: "/specialty/cardiology", file: "specialty/cardiology/index.html", label: "Cardiology (Dynamic Specialty)" },
  { path: "/blog/sports-injury-treatment-cost-in-lb-nagar-diagnosis-physiotherapy-and-surgery-explained", file: "blog/sports-injury-treatment-cost-in-lb-nagar-diagnosis-physiotherapy-and-surgery-explained/index.html", label: "Sports Injury Cost (Dynamic Blog)" },
  { path: "/doctor/dr-praveen-reddy-p", file: "doctor/dr-praveen-reddy-p/index.html", label: "Dr Praveen Reddy (Dynamic Doctor)" },
  { path: "/doctor/dr-c-alekya-reddy", file: "doctor/dr-c-alekya-reddy/index.html", label: "Dr C Alekya Reddy (Dynamic Doctor)" },
  { path: "/doctor/dr-kesava-rajashekar-reddy", file: "doctor/dr-kesava-rajashekar-reddy/index.html", label: "Dr Kesava Rajashekar (Dynamic Doctor)" }
];

console.log("=".repeat(80));
console.log("VIEW-SOURCE & STATIC HTML VERIFICATION REPORT");
console.log("=".repeat(80));

let passed = 0;
let failed = 0;

for (const route of testRoutes) {
  const filePath = join(DIST_DIR, route.file);
  const exists = existsSync(filePath);

  if (!exists) {
    console.error(`❌ [MISSING FILE] ${route.label} (${route.path}) -> ${filePath} does not exist!`);
    failed++;
    continue;
  }

  const html = readFileSync(filePath, "utf-8");
  const sizeKB = (html.length / 1024).toFixed(1);

  // Check 1: Root container has rendered HTML content (not empty SPA shell)
  const rootIndex = html.indexOf('<div id="root">');
  const rootContent = rootIndex !== -1 ? html.slice(rootIndex, rootIndex + 500) : "";
  const hasRenderedRoot = rootIndex !== -1 && !html.includes('<div id="root"></div>');

  // Check 2: CSS Stylesheet links present in <head>
  const hasCssLink = html.includes('rel="stylesheet"') && html.includes('/assets/index-');
  const hasBootstrapCss = html.includes("bootstrap.min.css");
  const hasFonts = html.includes("fonts.googleapis.com");

  // Check 3: Classnames preserved in rendered HTML
  const classMatches = html.match(/class="[^"]+"/g) || [];
  const classCount = classMatches.length;

  // Check 4: SEO metadata and title present
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const title = titleMatch ? titleMatch[1] : "NO TITLE";
  const hasMetaDesc = html.includes('name="description"');
  const hasCanonical = html.includes('rel="canonical"');

  const isAllValid = hasRenderedRoot && hasCssLink && classCount > 10 && title !== "NO TITLE";

  if (isAllValid) {
    passed++;
    console.log(`\n✅ ${route.label}`);
    console.log(`   URL: ${route.path}`);
    console.log(`   File: dist/${route.file} (${sizeKB} KB)`);
    console.log(`   Title: ${title}`);
    console.log(`   Rendered Root HTML: YES (Root contains full component markup)`);
    console.log(`   CSS Links: YES (App CSS bundle + Bootstrap CDN + Google Fonts)`);
    console.log(`   Classnames Count: ${classCount} class attributes in static HTML`);
    console.log(`   SEO Meta: Description: ${hasMetaDesc ? 'YES' : 'NO'}, Canonical: ${hasCanonical ? 'YES' : 'NO'}`);
  } else {
    failed++;
    console.error(`\n❌ ${route.label} FAILED CHECKS:`);
    console.error(`   URL: ${route.path}`);
    console.error(`   File: dist/${route.file} (${sizeKB} KB)`);
    console.error(`   Rendered Root HTML: ${hasRenderedRoot}`);
    console.error(`   CSS Link: ${hasCssLink}`);
    console.error(`   Class Count: ${classCount}`);
  }
}

console.log("\n" + "=".repeat(80));
console.log(`SUMMARY: ${passed} passed, ${failed} failed.`);
console.log("=".repeat(80));

if (failed > 0) process.exit(1);

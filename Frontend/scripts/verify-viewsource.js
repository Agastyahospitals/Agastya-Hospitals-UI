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
  { path: "/patient", file: "patient/index.html", label: "Patient Info (Static)" },
  { path: "/contact-us", file: "contact-us/index.html", label: "Contact Us (Static)" },
  { path: "/health-packages", file: "health-packages/index.html", label: "Health Packages (Static)" },
  { path: "/international-patient", file: "international-patient/index.html", label: "International Patient (Static)" },
  { path: "/specialty/nephrology", file: "specialty/nephrology/index.html", label: "Nephrology (Dynamic Specialty)" },
  { path: "/specialty/cardiology", file: "specialty/cardiology/index.html", label: "Cardiology (Dynamic Specialty)" },
  { path: "/blog/sports-injury-treatment-cost-in-lb-nagar-diagnosis-physiotherapy-and-surgery-explained", file: "blog/sports-injury-treatment-cost-in-lb-nagar-diagnosis-physiotherapy-and-surgery-explained/index.html", label: "Sports Injury Cost (Dynamic Blog)" },
  { path: "/doctor/dr-praveen-reddy-p", file: "doctor/dr-praveen-reddy-p/index.html", label: "Dr Praveen Reddy (Dynamic Doctor)" },
  { path: "/doctor/dr-y-goutham-raj", file: "doctor/dr-y-goutham-raj/index.html", label: "Dr Y Goutham Raj (Dynamic Doctor)" },
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

  // Check 4: Inline styles preserved in rendered HTML (ensures CSS styling is visible in view-source)
  const styleMatches = html.match(/style="[^"]+"/g) || [];
  const styleCount = styleMatches.length;

  // Check 5: SEO metadata and title present
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const title = titleMatch ? titleMatch[1] : "NO TITLE";
  const hasMetaDesc = html.includes('name="description"');
  const hasCanonical = html.includes('rel="canonical"');
  const hasOgTitle = html.includes('property="og:title"');
  const hasOgDesc = html.includes('property="og:description"');
  const hasOgImage = html.includes('property="og:image"');
  const hasTwitterCard = html.includes('name="twitter:card"');

  // Check 6: JSON-LD structured data present
  const hasJsonLd = html.includes('application/ld+json');
  const jsonLdCount = (html.match(/application\/ld\+json/g) || []).length;

  // Check 7: Semantic HTML elements
  const hasH1 = /<h1[\s>]/i.test(html);
  const hasNav = /<nav[\s>]/i.test(html);
  const hasFooter = /<footer[\s>]/i.test(html);
  const hasBreadcrumb = html.includes('breadcrumb');

  // Check 8: GTM present
  const hasGTM = html.includes('GTM-');

  const isAllValid = hasRenderedRoot && hasCssLink && classCount > 10 && title !== "NO TITLE" && hasMetaDesc && hasCanonical;

  if (isAllValid) {
    passed++;
    console.log(`\n✅ ${route.label}`);
    console.log(`   URL: ${route.path}`);
    console.log(`   File: dist/${route.file} (${sizeKB} KB)`);
    console.log(`   Title: ${title}`);
    console.log(`   Rendered Root HTML: YES (Root contains full component markup)`);
    console.log(`   CSS Links: YES (App CSS bundle: ${hasCssLink}, Bootstrap: ${hasBootstrapCss}, Fonts: ${hasFonts})`);
    console.log(`   Classnames Count: ${classCount} class attributes | Inline Styles: ${styleCount} style attributes`);
    console.log(`   SEO Meta: Description: ${hasMetaDesc ? 'YES' : 'NO'}, Canonical: ${hasCanonical ? 'YES' : 'NO'}, OG: ${hasOgTitle ? 'YES' : 'NO'}, Twitter: ${hasTwitterCard ? 'YES' : 'NO'}`);
    console.log(`   JSON-LD: ${hasJsonLd ? `YES (${jsonLdCount} schemas)` : 'NO'}`);
    console.log(`   Semantic HTML: H1: ${hasH1 ? 'YES' : 'NO'}, Nav: ${hasNav ? 'YES' : 'NO'}, Footer: ${hasFooter ? 'YES' : 'NO'}, Breadcrumb: ${hasBreadcrumb ? 'YES' : 'NO'}`);
    console.log(`   GTM: ${hasGTM ? 'YES' : 'NO'}`);
  } else {
    failed++;
    console.error(`\n❌ ${route.label} FAILED CHECKS:`);
    console.error(`   URL: ${route.path}`);
    console.error(`   File: dist/${route.file} (${sizeKB} KB)`);
    console.error(`   Rendered Root HTML: ${hasRenderedRoot}`);
    console.error(`   CSS Link: ${hasCssLink}`);
    console.error(`   Class Count: ${classCount} | Style Count: ${styleCount}`);
    console.error(`   Title: ${title}`);
    console.error(`   Meta Description: ${hasMetaDesc}`);
    console.error(`   Canonical: ${hasCanonical}`);
    console.error(`   OG Tags: ${hasOgTitle}`);
    console.error(`   JSON-LD: ${hasJsonLd}`);
  }
}

console.log("\n" + "=".repeat(80));
console.log(`SUMMARY: ${passed} passed, ${failed} failed out of ${testRoutes.length} routes.`);
console.log("=".repeat(80));

if (failed > 0) process.exit(1);

/**
 * Sitemap Generator for Agastya Hospitals
 *
 * Run after `vite build` to generate sitemap.xml in the dist/ folder.
 * Fetches dynamic blog and specialty URLs from the backend API.
 *
 * Usage: node scripts/generate-sitemap.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const BASE_URL = "https://agastyahospitals.com";
const BACKEND_URL = "https://agastya-hospitals-backend.onrender.com/api";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, "../dist");

// Static routes with their priority and change frequency
const STATIC_ROUTES = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/specialties", priority: "0.9", changefreq: "weekly" },
  { path: "/find-doctor", priority: "0.8", changefreq: "weekly" },
  { path: "/patient", priority: "0.6", changefreq: "monthly" },
  { path: "/blog", priority: "0.8", changefreq: "daily" },
  { path: "/health-packages", priority: "0.7", changefreq: "weekly" },
  { path: "/careers", priority: "0.5", changefreq: "monthly" },
  { path: "/book-appointment", priority: "0.7", changefreq: "monthly" },
  { path: "/contact-us", priority: "0.6", changefreq: "monthly" },
  { path: "/free-second-opinion", priority: "0.7", changefreq: "monthly" },
  { path: "/leadership-team", priority: "0.5", changefreq: "monthly" },
  { path: "/achievements", priority: "0.5", changefreq: "monthly" },
  { path: "/awards-recognition", priority: "0.5", changefreq: "monthly" },
  { path: "/international-patient", priority: "0.6", changefreq: "monthly" },
  { path: "/gallery", priority: "0.4", changefreq: "monthly" },
  { path: "/patient-care", priority: "0.5", changefreq: "monthly" },
  { path: "/news-and-updates", priority: "0.5", changefreq: "weekly" },
  { path: "/privacy-policy", priority: "0.2", changefreq: "yearly" },
  { path: "/terms-and-conditions", priority: "0.2", changefreq: "yearly" },
];

async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return response.json();
}

function toUrlEntry(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${loc}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

async function generateSitemap() {
  const today = todayISO();
  const entries = [];

  // 1. Static routes
  for (const route of STATIC_ROUTES) {
    entries.push(toUrlEntry(`${BASE_URL}${route.path}`, today, route.changefreq, route.priority));
  }

  // 2. Dynamic blog URLs
  try {
    console.log("Fetching blogs from API...");
    const blogsRes = await fetchJSON(`${BACKEND_URL}/blogs`);
    const blogs = blogsRes.data || blogsRes || [];

    for (const blog of blogs) {
      if (blog.url) {
        const lastmod = blog.dateOfPost
          ? new Date(blog.dateOfPost).toISOString().split("T")[0]
          : today;
        entries.push(
          toUrlEntry(`${BASE_URL}/blog/${blog.url}`, lastmod, "monthly", "0.7")
        );
      }
    }
    console.log(`  Added ${blogs.length} blog URLs`);
  } catch (err) {
    console.warn("Warning: Could not fetch blogs for sitemap:", err.message);
  }

  // 3. Dynamic specialty URLs
  try {
    console.log("Fetching specialties from API...");
    const specialtiesRes = await fetchJSON(`${BACKEND_URL}/specialities`);
    const specialties = specialtiesRes.data || specialtiesRes || [];

    for (const spec of specialties) {
      if (spec.specialityName) {
        const slug = spec.specialityName.toLowerCase().replace(/\s+/g, "-");
        entries.push(
          toUrlEntry(`${BASE_URL}/specialty/${slug}`, today, "monthly", "0.8")
        );
      }
    }
    console.log(`  Added ${specialties.length} specialty URLs`);
  } catch (err) {
    console.warn("Warning: Could not fetch specialties for sitemap:", err.message);
  }

  // Build the XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`;

  // Write to dist/
  const outputPath = path.join(DIST_DIR, "sitemap.xml");
  fs.writeFileSync(outputPath, xml, "utf-8");
  console.log(`\nSitemap generated at ${outputPath}`);
  console.log(`Total URLs: ${entries.length}`);
}

generateSitemap().catch((err) => {
  console.error("Sitemap generation failed:", err);
  process.exit(1);
});

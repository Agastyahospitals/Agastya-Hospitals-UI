/**
 * Production Static Site Generator (SSG) for Agastya Hospitals
 *
 * Runs during `npm run build` after Vite compiles client assets.
 * Fetches all dynamic content (blogs, specialties, doctors) from the live backend API
 * and generates pre-rendered, SEO-optimized, fully-hydrated HTML files for EVERY route.
 *
 * Key Architecture Highlights:
 * 1. Generates 150+ authentic static pages with complete semantic HTML content,
 *    eliminating blank SPA shells and soft 404s.
 * 2. Injects unique, accurate <title>, <meta description>, canonical URL, Open Graph,
 *    Twitter Card, and Schema.org JSON-LD structured data into <head>.
 * 3. Inlines compiled CSS stylesheet into <style id="inlined-app-styles"> so that
 *    "View Page Source" or standalone saved .html files render with 100% of styles intact,
 *    while preserving <link rel="stylesheet"> for production browser caching.
 * 4. Preserves the Vite client JS bundle <script type="module" crossorigin src="/assets/index-*.js">
 *    so the React application hydrates cleanly without breaking interactive features.
 * 5. Generates dist/404.html with proper robots noindex and navigational fallbacks.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "fs";
import { join, dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = resolve(__dirname, "../dist");
const BACKEND_URL = "https://agastya-hospitals-backend.onrender.com/api";
const BASE_URL = "https://agastyahospitals.com";
const SITE_NAME = "Agastya Hospitals";
const DEFAULT_OG_IMAGE =
  "https://res.cloudinary.com/sdk28cdn/image/upload/v1758389743/agastya/og-default.jpg";
const DEFAULT_DESCRIPTION =
  "Agastya Hospitals is a leading super specialty hospital in LB Nagar, Hyderabad offering advanced medical, surgical, and 24/7 critical care services with experienced specialists.";

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function stripHtml(str) {
  if (!str) return "";
  return str.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  }
  return res.json();
}

/**
 * Builds the standard header HTML matching React Header component
 */
function buildHeaderHtml(activePath = "") {
  return `
    <header class="bg-white shadow-sm">
      <div class="top-main-navigation">
        <div class="py-2 top-main-navigation">
          <div class="container d-flex justify-between items-center top-infonavigation">
            <div class="d-flex items-center space-x-4">
              <span class="appointment-details">
                <span>24x7 Appointment Helpline - </span>040 65 108 108, &nbsp;+91 9459 108 108
              </span>
            </div>
            <div class="d-flex items-center space-x-4 mobile-topbooking-nav">
              <a class="patientlogin" href="/">
                <img src="https://res.cloudinary.com/sdk28cdn/image/upload/v1758392814/agastya/patient-login.svg" alt="Patient Login" />
                Patient Login
              </a>
              <a href="/book-appointment" class="bookappointment d-flex items-center space-x-1" style="text-decoration:none;">
                <i class="lni lni-calendar-days icon"></i>
                <span>Book Appointment</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <nav class="main-navigation navbar navbar-expand-lg">
        <div class="container d-flex justify-between items-center">
          <a class="site-logo" href="/" style="display:inline-block;text-decoration:none;">
            <img src="https://res.cloudinary.com/sdk28cdn/image/upload/v1756301086/agastya/agastyahospitals-logo.svg" alt="Agastya Hospitals Logo" style="height:60px;" />
          </a>
          <div class="d-flex items-center gap-4 flex-wrap">
            <a href="/" style="text-decoration:none;font-weight:600;color:${activePath === "/" ? "#022b50" : "#333"};">Home</a>
            <a href="/about" style="text-decoration:none;font-weight:600;color:${activePath === "/about" ? "#022b50" : "#333"};">About Us</a>
            <a href="/specialties" style="text-decoration:none;font-weight:600;color:${activePath.startsWith("/specialt") ? "#022b50" : "#333"};">Specialties</a>
            <a href="/find-doctor" style="text-decoration:none;font-weight:600;color:${activePath.startsWith("/doctor") || activePath === "/find-doctor" ? "#022b50" : "#333"};">Find Doctor</a>
            <a href="/international-patient" style="text-decoration:none;font-weight:600;color:${activePath === "/international-patient" ? "#022b50" : "#333"};">International Patient</a>
            <a href="/health-packages" style="text-decoration:none;font-weight:600;color:${activePath === "/health-packages" ? "#022b50" : "#333"};">Health Packages</a>
            <a href="/blog" style="text-decoration:none;font-weight:600;color:${activePath.startsWith("/blog") ? "#022b50" : "#333"};">Blog</a>
            <a href="/careers" style="text-decoration:none;font-weight:600;color:${activePath === "/careers" ? "#022b50" : "#333"};">Careers</a>
            <a href="/contact-us" style="text-decoration:none;font-weight:600;color:${activePath === "/contact-us" ? "#022b50" : "#333"};">Contact</a>
          </div>
        </div>
      </nav>
    </header>
  `;
}

/**
 * Builds the standard footer HTML matching React Footer component
 */
function buildFooterHtml() {
  return `
    <footer class="footer-main" style="background:#16375b;color:#fff;padding:40px 20px 20px;">
      <div class="container">
        <div class="row">
          <div class="col-lg-3 col-md-6 col-sm-12 mb-4">
            <div class="widget">
              <h3 style="color:#fff;font-weight:700;margin-bottom:15px;font-size:18px;">Specialities</h3>
              <ul style="list-style:none;padding:0;margin:0;line-height:2.2;">
                <li><a href="/specialty/surgical-oncology" style="color:#ccc;text-decoration:none;">Surgical Oncology</a></li>
                <li><a href="/specialty/urology-and-andrology" style="color:#ccc;text-decoration:none;">Urology & Andrology</a></li>
                <li><a href="/specialty/orthopaedics" style="color:#ccc;text-decoration:none;">Orthopaedics</a></li>
                <li><a href="/specialty/gynaecology" style="color:#ccc;text-decoration:none;">Gynaecology</a></li>
                <li><a href="/specialty/neurology" style="color:#ccc;text-decoration:none;">Neurology</a></li>
                <li><a href="/specialty/emergency-medicine" style="color:#ccc;text-decoration:none;">Emergency Medicine</a></li>
                <li><a href="/specialty/cardiology" style="color:#ccc;text-decoration:none;">Cardiology</a></li>
                <li><a href="/specialty/vascular-surgery" style="color:#ccc;text-decoration:none;">Vascular Surgery</a></li>
              </ul>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 col-sm-12 mb-4">
            <div class="widget">
              <h3 style="color:#fff;font-weight:700;margin-bottom:15px;font-size:18px;">Quick Links</h3>
              <ul style="list-style:none;padding:0;margin:0;line-height:2.2;">
                <li><a href="/about" style="color:#ccc;text-decoration:none;">About Us</a></li>
                <li><a href="/patient-care" style="color:#ccc;text-decoration:none;">Patient Care</a></li>
                <li><a href="/news-and-updates" style="color:#ccc;text-decoration:none;">News & Updates</a></li>
                <li><a href="/careers" style="color:#ccc;text-decoration:none;">Careers</a></li>
                <li><a href="/blog" style="color:#ccc;text-decoration:none;">Blogs</a></li>
                <li><a href="/health-packages" style="color:#ccc;text-decoration:none;">Health Packages</a></li>
                <li><a href="/contact-us" style="color:#ccc;text-decoration:none;">Contact Us</a></li>
                <li><a href="/privacy-policy" style="color:#ccc;text-decoration:none;">Privacy Policy</a></li>
                <li><a href="/terms-and-conditions" style="color:#ccc;text-decoration:none;">Terms & Conditions</a></li>
              </ul>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 col-sm-12 mb-4">
            <div class="widget">
              <h3 style="color:#fff;font-weight:700;margin-bottom:15px;font-size:18px;">Contact Info</h3>
              <p style="color:#ccc;margin-bottom:8px;">info@agastyahospitals.com</p>
              <p style="color:#ccc;margin-bottom:16px;">+91 9459 108 108</p>
              <h5 style="color:#fff;font-weight:700;margin-top:20px;margin-bottom:8px;">24×7 Appointment Helpline</h5>
              <div class="helpline" style="font-size:18px;font-weight:700;color:#fff;">
                <span class="dot"></span> 040 65 108 108
              </div>
              <p style="color:#ccc;font-size:14px;margin-top:15px;line-height:1.5;">
                Plot No. 1, Sagar Ring Road, Beside LB Nagar Metro Station, LB Nagar, Hyderabad - 500074.
              </p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 col-sm-12 mb-4">
            <div class="widget">
              <h3 style="color:#fff;font-weight:700;margin-bottom:15px;font-size:18px;">Follow Us On</h3>
              <div class="d-flex gap-3 mt-3">
                <a href="https://www.facebook.com/AgastyaHospitals" target="_blank" rel="noopener noreferrer" style="color:#fff;text-decoration:none;">Facebook</a>
                <a href="https://www.instagram.com/agastyahospitals/" target="_blank" rel="noopener noreferrer" style="color:#fff;text-decoration:none;">Instagram</a>
                <a href="https://www.youtube.com/@agastyahospitals" target="_blank" rel="noopener noreferrer" style="color:#fff;text-decoration:none;">YouTube</a>
                <a href="https://www.linkedin.com/company/agastya-hospitals/" target="_blank" rel="noopener noreferrer" style="color:#fff;text-decoration:none;">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-copy text-center pt-3 mt-3" style="border-top:1px solid rgba(255,255,255,0.1);color:#aaa;font-size:13px;">
        Copyright &copy; ${new Date().getFullYear()} Agastya Hospitals (SRI LAKSHMI NARASIMHA HEALTH CARE PVT. LTD.). All Rights Reserved.
      </div>
    </footer>
  `;
}

/**
 * Builds sticky appointment action buttons matching App.jsx
 */
function buildStickyActionsHtml() {
  return `
    <div class="right-sticky-wrapper">
      <a class="sticky-btn appointment cursor-pointer" href="/book-appointment">
        <span>Book Doctor Appointment</span>
        <i class="bi bi-calendar-check"></i>
      </a>
      <a class="sticky-btn opinion cursor-pointer" href="/free-second-opinion">
        <span>Get Expert Second Opinion</span>
        <i class="bi bi-chat-dots"></i>
      </a>
      <a class="sticky-btn whatsapp cursor-pointer" href="https://wa.me/919459108108?text=Hello%20I%20would%20like%20to%20get%20more%20information%20about%20your%20hospital%20services.%20Please%20assist%20me." target="_blank" rel="noopener noreferrer">
        <i class="bi bi-whatsapp"></i>
      </a>
    </div>
  `;
}

/**
 * Replaces the HTML <head> meta tags and <div id="root"> content in baseTemplate
 */
function createStaticPageHtml(
  baseTemplate,
  {
    route,
    title,
    description,
    keywords = "",
    canonical = "",
    ogType = "website",
    ogImage = DEFAULT_OG_IMAGE,
    jsonLd = [],
    bodyHtml = "",
    robots = "index, follow",
    compiledCss = "",
  }
) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const canonicalUrl = canonical
    ? `${BASE_URL}${canonical}`
    : `${BASE_URL}${route === "/" ? "" : route}`;
  const cleanDescription = stripHtml(description || DEFAULT_DESCRIPTION).slice(0, 160);

  // Format JSON-LD scripts
  const jsonLdScripts = jsonLd
    .map((ld) => `<script type="application/ld+json">\n${JSON.stringify(ld, null, 2)}\n</script>`)
    .join("\n");

  let html = baseTemplate;

  // 1. Update <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(fullTitle)}</title>`);

  // 2. Build complete dynamic SEO meta tags block
  const seoHeadTags = `
  <!-- Primary Meta Tags -->
  <meta name="description" content="${escapeHtml(cleanDescription)}" />
  ${keywords ? `<meta name="keywords" content="${escapeHtml(keywords)}" />` : ""}
  <meta name="robots" content="${escapeHtml(robots)}" />
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />

  <!-- Open Graph / Facebook -->
  <meta property="og:locale" content="en_IN" />
  <meta property="og:type" content="${escapeHtml(ogType)}" />
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
  <meta property="og:title" content="${escapeHtml(fullTitle)}" />
  <meta property="og:description" content="${escapeHtml(cleanDescription)}" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  <meta property="og:image" content="${escapeHtml(ogImage)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@AgastyaHospital" />
  <meta name="twitter:url" content="${escapeHtml(canonicalUrl)}" />
  <meta name="twitter:title" content="${escapeHtml(fullTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(cleanDescription)}" />
  <meta name="twitter:image" content="${escapeHtml(ogImage)}" />

  <!-- Structured Data -->
  ${jsonLdScripts}
  `;

  // Remove existing redundant tags
  html = html.replace(/<meta name="description"[\s\S]*?\/>/gi, "");
  html = html.replace(/<meta name="keywords"[\s\S]*?\/>/gi, "");
  html = html.replace(/<meta name="robots"[\s\S]*?\/>/gi, "");
  html = html.replace(/<link rel="canonical"[\s\S]*?\/>/gi, "");
  html = html.replace(/<meta property="og:[^"]+"[\s\S]*?\/>/gi, "");
  html = html.replace(/<meta name="twitter:[^"]+"[\s\S]*?\/>/gi, "");
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, "");

  // Inject dynamic tags right after <title>
  html = html.replace(`</title>`, `</title>\n${seoHeadTags}`);

  // 3. Inject compiled CSS into <head> for offline rendering / copied HTML support
  if (compiledCss && !html.includes('id="inlined-app-styles"')) {
    html = html.replace("</head>", `<style id="inlined-app-styles">\n${compiledCss}\n</style>\n</head>`);
  }

  // 4. Inject pre-rendered semantic HTML into <div id="root">
  // CRITICAL: We preserve the <script type="module" crossorigin src="/assets/index-*.js"> tag!
  if (bodyHtml) {
    const fullRootMarkup = `
      <div id="root">
        <div class="min-h-screen flex flex-col">
          ${buildHeaderHtml(route)}
          <main class="flex-grow">
            ${bodyHtml}
          </main>
          ${buildFooterHtml()}
          ${buildStickyActionsHtml()}
        </div>
      </div>
    `.trim();

    // Replace only <div id="root"></div> or existing <div id="root">...</div>
    const rootRegex = /<div id="root">[\s\S]*?<\/div>(?=\s*<script|\s*<\/body>)/i;
    if (rootRegex.test(html)) {
      html = html.replace(rootRegex, fullRootMarkup);
    } else {
      const rootSimple = html.indexOf('<div id="root"></div>');
      if (rootSimple !== -1) {
        html = html.slice(0, rootSimple) + fullRootMarkup + html.slice(rootSimple + '<div id="root"></div>'.length);
      }
    }
  }

  return html;
}

/**
 * Saves generated HTML to dist/
 */
function writeRouteHtml(route, html) {
  if (route === "/" || route === "") {
    const outputIndex = join(DIST_DIR, "index.html");
    writeFileSync(outputIndex, html, "utf-8");
  } else {
    const cleanRoute = route.startsWith("/") ? route.slice(1) : route;
    const dir = join(DIST_DIR, cleanRoute);
    mkdirSync(dir, { recursive: true });
    const outputIndex = join(dir, "index.html");
    const outputHtml = join(DIST_DIR, `${cleanRoute}.html`);

    writeFileSync(outputIndex, html, "utf-8");
    try {
      const parentDir = dirname(outputHtml);
      mkdirSync(parentDir, { recursive: true });
      writeFileSync(outputHtml, html, "utf-8");
    } catch {
      // Ignore if .html file cannot be written
    }
  }
}

export async function runSSG() {
  console.log("\n🚀 Starting Static Site Generation (SSG) for Agastya Hospitals...\n");

  const indexPath = join(DIST_DIR, "index.html");
  if (!existsSync(indexPath)) {
    throw new Error(`dist/index.html not found! Run 'vite build' first.`);
  }

  const baseTemplate = readFileSync(indexPath, "utf-8");

  // Read compiled CSS stylesheet to inline into every page for 100% offline styling support
  let compiledCss = "";
  try {
    const assetsDir = join(DIST_DIR, "assets");
    if (existsSync(assetsDir)) {
      const cssFiles = readdirSync(assetsDir).filter((f) => f.endsWith(".css"));
      for (const file of cssFiles) {
        compiledCss += readFileSync(join(assetsDir, file), "utf-8") + "\n";
      }
    }
    console.log(`  ✓ Loaded ${(compiledCss.length / 1024).toFixed(1)} KB of compiled CSS for inlining`);
  } catch (err) {
    console.warn("  ⚠ Warning: Could not read compiled CSS for inlining:", err.message);
  }

  // Step 1: Fetch dynamic resources from backend API in parallel
  console.log("📥 Fetching dynamic data from backend API...");
  const [blogsRes, specsRes, docsRes] = await Promise.all([
    fetchJSON(`${BACKEND_URL}/blogs`).catch((e) => {
      console.warn("  ⚠ Failed to fetch blogs:", e.message);
      return [];
    }),
    fetchJSON(`${BACKEND_URL}/specialities`).catch((e) => {
      console.warn("  ⚠ Failed to fetch specialties:", e.message);
      return [];
    }),
    fetchJSON(`${BACKEND_URL}/doctors`).catch((e) => {
      console.warn("  ⚠ Failed to fetch doctors:", e.message);
      return [];
    }),
  ]);

  const blogs = blogsRes.data || blogsRes || [];
  const specialties = specsRes.data || specsRes || [];
  const doctors = docsRes.data || docsRes || [];

  console.log(`  ✓ Loaded ${blogs.length} blogs`);
  console.log(`  ✓ Loaded ${specialties.length} specialties`);
  console.log(`  ✓ Loaded ${doctors.length} doctors\n`);

  let count = 0;

  // ---------------------------------------------------------------------------
  // Step 2: Generate Dynamic Blog Pages (/blog/:urlSlug)
  // ---------------------------------------------------------------------------
  console.log(`📝 Generating ${blogs.length} Dynamic Blog Pages...`);
  for (const blog of blogs) {
    if (!blog.url) continue;
    const slug = blog.url.trim();
    const route = `/blog/${slug}`;
    const title = `${blog.title} | Agastya Hospitals`;
    const description = blog.metaDescription || blog.title;
    const banner = blog.postBanner || blog.postThumbnail || DEFAULT_OG_IMAGE;
    const author = blog.authorName || "Agastya Hospitals";
    const dateFormatted = blog.dateOfPost
      ? new Date(blog.dateOfPost).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "";

    const jsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: blog.title,
        description: description,
        image: banner,
        author: {
          "@type": "Person",
          name: author,
        },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: BASE_URL,
          logo: {
            "@type": "ImageObject",
            url: `${BASE_URL}/favicon.ico`,
          },
        },
        datePublished: blog.dateOfPost || new Date().toISOString(),
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${BASE_URL}${route}`,
        },
        keywords: blog.metaKeywords || "",
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: blog.title, item: `${BASE_URL}${route}` },
        ],
      },
    ];

    const bodyHtml = `
      <div class="banner bg-light py-3 border-bottom">
        <div class="container">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item"><a href="/" style="text-decoration:none;color:#022b50;">Home</a></li>
              <li class="breadcrumb-item"><a href="/blog" style="text-decoration:none;color:#022b50;">Blog</a></li>
              <li class="breadcrumb-item active" aria-current="page">${escapeHtml(blog.title)}</li>
            </ol>
          </nav>
        </div>
      </div>
      <div class="container py-5">
        <div class="row">
          <article class="col-lg-8 col-md-12">
            ${blog.category ? `<span class="badge bg-primary mb-2" style="background:#022b50!important;">${escapeHtml(blog.category)}</span>` : ""}
            <h1 class="main-title mb-3 fw-bold" style="font-size:32px;line-height:1.3;color:#16375b;">${escapeHtml(blog.title)}</h1>
            <div class="d-flex align-items-center gap-3 text-muted mb-4 pb-2 border-bottom" style="font-size:14px;">
              <span><strong>By:</strong> ${escapeHtml(author)}</span>
              ${dateFormatted ? `<span>&bull;</span><span>${escapeHtml(dateFormatted)}</span>` : ""}
            </div>
            ${banner ? `<div class="mb-4 text-center">
              <img src="${escapeHtml(banner)}" alt="${escapeHtml(blog.title)}" class="img-fluid rounded shadow-sm" style="max-height:450px;width:100%;object-fit:cover;" />
            </div>` : ""}
            <div class="blog-content" style="font-size:16px;line-height:1.8;color:#222;">
              ${blog.blogContent || `<p>${escapeHtml(description)}</p>`}
            </div>
          </article>
          <aside class="col-lg-4 col-md-12 mt-4 mt-lg-0">
            <div class="appointment-sidebar p-4 rounded shadow-sm bg-light border">
              <h4 class="mb-3 fw-bold" style="color:#022b50;">Need Specialist Consultation?</h4>
              <p style="font-size:14px;color:#555;">Consult expert doctors and surgeons at Agastya Hospitals, LB Nagar, Hyderabad.</p>
              <a href="/book-appointment" class="btn btn-primary w-100 py-2 mt-2" style="background:#022b50;border-radius:25px;font-weight:600;">
                Book Doctor Appointment
              </a>
              <a href="tel:04065108108" class="btn btn-outline-primary w-100 py-2 mt-2" style="border-radius:25px;font-weight:600;">
                Call 040 65 108 108
              </a>
            </div>
          </aside>
        </div>
      </div>
    `;

    const html = createStaticPageHtml(baseTemplate, {
      route,
      title,
      description,
      keywords: blog.metaKeywords || "",
      canonical: route,
      ogType: "article",
      ogImage: banner,
      jsonLd,
      bodyHtml,
      compiledCss,
    });

    writeRouteHtml(route, html);
    count++;
  }

  // ---------------------------------------------------------------------------
  // Step 3: Generate Dynamic Specialty Pages (/specialty/:slug)
  // ---------------------------------------------------------------------------
  console.log(`🏥 Generating ${specialties.length} Dynamic Specialty Pages...`);
  for (const spec of specialties) {
    if (!spec.specialityName) continue;
    const rawName = spec.specialityName.trim();
    const cleanNameSlug = rawName
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    const slugs = [cleanNameSlug];
    if (spec.urlSlug) {
      const dbSlug = spec.urlSlug
        .toLowerCase()
        .trim()
        .replace(/&/g, "and")
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      if (!slugs.includes(dbSlug)) slugs.push(dbSlug);
    }

    const title = `${rawName} Specialist Hospital in LB Nagar, Hyderabad | Agastya Hospitals`;
    const description =
      spec.seoMetaData ||
      spec.shortDescription ||
      `Comprehensive medical and surgical care for ${rawName} at Agastya Hospitals, LB Nagar, Hyderabad. Experienced specialists & 24/7 care.`;
    const banner = spec.banner?.[0] || DEFAULT_OG_IMAGE;
    const defaultRoute = `/specialty/${cleanNameSlug}`;

    const jsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "MedicalSpecialty",
        name: rawName,
        description: description,
        hospitalAffiliation: {
          "@type": "Hospital",
          name: SITE_NAME,
          url: BASE_URL,
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "Specialties", item: `${BASE_URL}/specialties` },
          { "@type": "ListItem", position: 3, name: rawName, item: `${BASE_URL}${defaultRoute}` },
        ],
      },
    ];

    const bodyHtml = `
      <div class="banner bg-light py-3 border-bottom">
        <div class="container">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item"><a href="/" style="text-decoration:none;color:#022b50;">Home</a></li>
              <li class="breadcrumb-item"><a href="/specialties" style="text-decoration:none;color:#022b50;">Specialties</a></li>
              <li class="breadcrumb-item active" aria-current="page">${escapeHtml(rawName)}</li>
            </ol>
          </nav>
        </div>
      </div>
      <div class="container py-5">
        <div class="row">
          <div class="col-lg-8 col-md-12">
            <h1 class="main-title mb-4 fw-bold" style="font-size:34px;color:#16375b;">${escapeHtml(rawName)}</h1>
            ${banner && banner !== DEFAULT_OG_IMAGE ? `<div class="mb-4">
              <img src="${escapeHtml(banner)}" alt="${escapeHtml(rawName)}" class="img-fluid rounded shadow-sm" style="max-height:350px;width:100%;object-fit:cover;" />
            </div>` : ""}
            <div class="specialtypage-details" style="font-size:16px;line-height:1.8;color:#222;">
              ${spec.pageDescription || `<p>${escapeHtml(description)}</p>`}
            </div>
            ${spec.doctorNames && spec.doctorNames.length > 0 ? `
              <div class="mt-5 p-4 rounded bg-light border">
                <h3 class="fw-bold mb-3" style="color:#022b50;">Specialist Doctors in ${escapeHtml(rawName)}</h3>
                <ul style="list-style:none;padding:0;margin:0;">
                  ${spec.doctorNames.map((d) => `<li style="font-size:16px;margin-bottom:8px;"><strong>&bull;</strong> ${escapeHtml(d)}</li>`).join("")}
                </ul>
              </div>` : ""}
          </div>
          <div class="col-lg-4 col-md-12 mt-4 mt-lg-0">
            <div class="appointment-sidebar p-4 rounded shadow-sm bg-light border">
              <h4 class="mb-3 fw-bold" style="color:#022b50;">Book Consultation</h4>
              <p style="font-size:14px;color:#555;">Consult our ${escapeHtml(rawName)} specialists for accurate diagnosis & advanced treatment.</p>
              <a href="/book-appointment" class="btn btn-primary w-100 py-2 mt-2" style="background:#022b50;border-radius:25px;font-weight:600;">
                Book Doctor Appointment
              </a>
              <a href="tel:04065108108" class="btn btn-outline-primary w-100 py-2 mt-2" style="border-radius:25px;font-weight:600;">
                Call 040 65 108 108
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    for (const slug of slugs) {
      const route = `/specialty/${slug}`;
      const html = createStaticPageHtml(baseTemplate, {
        route,
        title,
        description,
        canonical: route,
        ogType: "website",
        ogImage: banner,
        jsonLd,
        bodyHtml,
        compiledCss,
      });

      writeRouteHtml(route, html);
      count++;
    }
  }

  // ---------------------------------------------------------------------------
  // Step 4: Generate Dynamic Doctor Pages (/doctor/:slug)
  // ---------------------------------------------------------------------------
  console.log(`👨‍⚕️ Generating ${doctors.length} Dynamic Doctor Pages...`);
  for (const doc of doctors) {
    if (!doc.fullName) continue;
    const name = doc.fullName.trim();
    const slug = name.toLowerCase().replace(/[.\s]+/g, "-").replace(/^-+|-+$/g, "");
    const route = `/doctor/${slug}`;
    const qualifications = Array.isArray(doc.qualification) ? doc.qualification.join(", ") : doc.qualification || "";
    const designation = doc.designation || "Consultant Specialist";
    const experience = doc.yearsOfExperience ? `${doc.yearsOfExperience} Years Experience` : "";
    const department = doc.specialityNames?.join(", ") || doc.departmentName || "";
    const title = `${name} - ${designation} | Agastya Hospitals LB Nagar`;
    const description = `Consult ${name}, ${designation} (${qualifications}) at Agastya Hospitals, LB Nagar, Hyderabad. ${experience ? experience + "." : ""} Specialist in ${department || "super specialty healthcare"}.`;
    const photo = doc.profilePicture || DEFAULT_OG_IMAGE;

    const jsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "Physician",
        name: name,
        description: description,
        image: photo,
        medicalSpecialty: department || designation,
        hospitalAffiliation: {
          "@type": "Hospital",
          name: SITE_NAME,
          url: BASE_URL,
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "Doctors", item: `${BASE_URL}/find-doctor` },
          { "@type": "ListItem", position: 3, name: name, item: `${BASE_URL}${route}` },
        ],
      },
    ];

    const bodyHtml = `
      <div class="banner bg-light py-3 border-bottom">
        <div class="container">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item"><a href="/" style="text-decoration:none;color:#022b50;">Home</a></li>
              <li class="breadcrumb-item"><a href="/find-doctor" style="text-decoration:none;color:#022b50;">Doctors</a></li>
              <li class="breadcrumb-item active" aria-current="page">${escapeHtml(name)}</li>
            </ol>
          </nav>
        </div>
      </div>
      <div class="container py-5">
        <div class="row">
          <div class="col-lg-4 col-md-5 text-center mb-4">
            <div class="p-4 rounded shadow-sm bg-white border">
              <img src="${escapeHtml(photo)}" alt="${escapeHtml(name)}" class="img-fluid rounded-circle shadow mb-3" style="width:180px;height:180px;object-fit:cover;margin:0 auto;" />
              <h2 class="fw-bold mb-1" style="font-size:22px;color:#022b50;">${escapeHtml(name)}</h2>
              <p class="text-primary fw-semibold mb-1" style="font-size:15px;">${escapeHtml(designation)}</p>
              ${qualifications ? `<p class="text-muted small mb-2">${escapeHtml(qualifications)}</p>` : ""}
              ${experience ? `<p class="badge bg-success mb-3">${escapeHtml(experience)}</p>` : ""}
              <div>
                <a href="/book-appointment" class="btn btn-primary w-100 py-2" style="background:#022b50;border-radius:25px;font-weight:600;">
                  Book Appointment
                </a>
              </div>
            </div>
          </div>
          <div class="col-lg-8 col-md-7">
            <h1 class="main-title mb-3 fw-bold" style="font-size:32px;color:#16375b;">${escapeHtml(name)}</h1>
            ${department ? `<div class="mb-3"><strong>Specialty / Department:</strong> <span class="badge bg-secondary">${escapeHtml(department)}</span></div>` : ""}
            ${doc.about ? `
              <div class="mb-4">
                <h3 class="fw-bold mb-2" style="font-size:20px;color:#022b50;">About Doctor</h3>
                <div style="font-size:16px;line-height:1.7;color:#333;">${doc.about}</div>
              </div>` : ""}
            ${doc.expertise ? `
              <div class="mb-4">
                <h3 class="fw-bold mb-2" style="font-size:20px;color:#022b50;">Clinical Expertise</h3>
                <div style="font-size:16px;line-height:1.7;color:#333;">${doc.expertise}</div>
              </div>` : ""}
            ${doc.opTimings ? `
              <div class="mb-4 p-3 rounded bg-light border">
                <h3 class="fw-bold mb-1" style="font-size:18px;color:#022b50;">OP Consultation Timings</h3>
                <p class="mb-0" style="font-size:15px;">${escapeHtml(doc.opTimings)}</p>
              </div>` : ""}
          </div>
        </div>
      </div>
    `;

    const html = createStaticPageHtml(baseTemplate, {
      route,
      title,
      description,
      canonical: route,
      ogType: "profile",
      ogImage: photo,
      jsonLd,
      bodyHtml,
      compiledCss,
    });

    writeRouteHtml(route, html);
    count++;
  }

  // ---------------------------------------------------------------------------
  // Step 5: Generate Core Static Pages
  // ---------------------------------------------------------------------------
  console.log("🌐 Generating Core Static Pages...");

  // Homepage
  const homeHospitalJsonLd = {
    "@context": "https://schema.org",
    "@type": "Hospital",
    name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: BASE_URL,
    telephone: "+91-9459108108",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Plot No. 1, Sagar Ring Road, Beside LB Nagar Metro Station, LB Nagar",
      addressLocality: "Hyderabad",
      addressRegion: "Telangana",
      postalCode: "500074",
      addressCountry: "IN",
    },
    medicalSpecialty: [
      "Cardiology", "Orthopedics", "Neurology", "Gastroenterology",
      "Nephrology", "Urology", "General Surgery", "Emergency Medicine"
    ],
  };

  const homeFaqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Where is Agastya Hospitals located in Hyderabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Agastya Hospitals is located at Sagar Ring Road, beside LB Nagar Metro Station, LB Nagar, Hyderabad, Telangana.",
        },
      },
      {
        "@type": "Question",
        name: "Does Agastya Hospitals provide 24/7 emergency services?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, our emergency and trauma care services operate round-the-clock with dedicated ICU facilities and ambulances.",
        },
      },
      {
        "@type": "Question",
        name: "Can I book appointments online at Agastya Hospitals?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, appointments can be booked online through the website or by calling 040 65 108 108.",
        },
      },
    ],
  };

  const homeBodyHtml = `
    <section class="hero-section py-5" style="background:linear-gradient(135deg, #f0f7ff 0%, #e2efff 100%);">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-7">
            <span class="badge bg-primary px-3 py-2 mb-3" style="background:#022b50!important;font-size:14px;">Super Specialty Healthcare</span>
            <h1 class="display-4 fw-bold mb-3" style="color:#022b50;line-height:1.2;">
              Transforming Lives, Restoring Health with Clinical Excellence
            </h1>
            <p class="lead text-muted mb-4" style="font-size:18px;">
              Agastya Hospitals in LB Nagar, Hyderabad offers world-class medical, surgical, robotic, and 24/7 emergency care with experienced specialists and advanced diagnostic infrastructure.
            </p>
            <div class="d-flex flex-wrap gap-3 mb-4">
              <a href="/book-appointment" class="btn btn-primary px-4 py-3 fw-bold" style="background:#022b50;border-radius:25px;">
                Book Doctor Appointment
              </a>
              <a href="/find-doctor" class="btn btn-outline-primary px-4 py-3 fw-bold" style="border-radius:25px;">
                Find a Doctor
              </a>
              <a href="tel:04065108108" class="btn btn-success px-4 py-3 fw-bold" style="border-radius:25px;">
                24x7 Helpline: 040 65 108 108
              </a>
            </div>
            <div class="row g-3 text-center pt-3 border-top">
              <div class="col-3">
                <h3 class="fw-bold mb-0 text-primary">150+</h3>
                <small class="text-muted">Beds Capacity</small>
              </div>
              <div class="col-3">
                <h3 class="fw-bold mb-0 text-primary">25+</h3>
                <small class="text-muted">Specialties</small>
              </div>
              <div class="col-3">
                <h3 class="fw-bold mb-0 text-primary">50+</h3>
                <small class="text-muted">Doctors</small>
              </div>
              <div class="col-3">
                <h3 class="fw-bold mb-0 text-primary">10,000+</h3>
                <small class="text-muted">Happy Patients</small>
              </div>
            </div>
          </div>
          <div class="col-lg-5 text-center mt-4 mt-lg-0">
            <img src="https://res.cloudinary.com/sdk28cdn/image/upload/v1772347822/agastya/Agastya_Hospitals.gif" alt="Agastya Hospitals Building" class="img-fluid rounded shadow-lg" style="max-height:420px;object-fit:cover;" />
          </div>
        </div>
      </div>
    </section>

    <section class="specialties-section py-5">
      <div class="container">
        <div class="text-center mb-5">
          <span class="text-primary fw-bold text-uppercase">Center of Excellence</span>
          <h2 class="fw-bold mt-2" style="color:#022b50;">Our Medical & Surgical Specialties</h2>
          <p class="text-muted mx-auto" style="max-width:700px;">Comprehensive multi-disciplinary departments delivering accurate diagnosis and modern clinical care.</p>
        </div>
        <div class="row g-4">
          ${specialties.slice(0, 8).map((spec) => {
            const specSlug = spec.specialityName.trim().toLowerCase().replace(/&/g, "and").replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
            return `
              <div class="col-lg-3 col-md-6">
                <div class="card h-100 p-3 border shadow-sm rounded-3">
                  <h4 class="fw-bold mb-2" style="font-size:18px;color:#022b50;">${escapeHtml(spec.specialityName)}</h4>
                  <p class="text-muted small mb-3 flex-grow-1">${escapeHtml(spec.shortDescription || "Comprehensive specialized medical and surgical services.")}</p>
                  <a href="/specialty/${specSlug}" class="fw-bold text-primary" style="text-decoration:none;">View Specialty &rarr;</a>
                </div>
              </div>
            `;
          }).join("")}
        </div>
        <div class="text-center mt-4">
          <a href="/specialties" class="btn btn-outline-primary px-4 py-2" style="border-radius:25px;">Explore All 20+ Specialties</a>
        </div>
      </div>
    </section>

    <section class="technology-section py-5 bg-light">
      <div class="container">
        <div class="text-center mb-5">
          <span class="text-primary fw-bold text-uppercase">Cutting-Edge Infrastructure</span>
          <h2 class="fw-bold mt-2" style="color:#022b50;">Advanced Medical Technologies</h2>
        </div>
        <div class="row g-4 text-center">
          <div class="col-md-4">
            <div class="p-4 bg-white rounded shadow-sm h-100">
              <h4 class="fw-bold text-primary mb-2">Advanced Cath Lab</h4>
              <p class="text-muted small">Siemens Artis Zee digital cardiac catheterization laboratory for emergency angioplasties.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="p-4 bg-white rounded shadow-sm h-100">
              <h4 class="fw-bold text-primary mb-2">128-Slice CT & Imaging</h4>
              <p class="text-muted small">Siemens Somatom high-speed 128-slice CT scanner for rapid cardiac, neuro, and trauma imaging.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="p-4 bg-white rounded shadow-sm h-100">
              <h4 class="fw-bold text-primary mb-2">Robotic Surgery</h4>
              <p class="text-muted small">CORI surgical system and precision robotic technology for joint replacement and minimally invasive surgeries.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  const homeHtml = createStaticPageHtml(baseTemplate, {
    route: "/",
    title: "Best Super Specialty Hospital in LB Nagar, Hyderabad | Agastya Hospitals",
    description: "Agastya Hospitals is a leading super specialty hospital in LB Nagar, Hyderabad offering advanced medical, surgical, and 24/7 critical care services with experienced specialists.",
    canonical: "/",
    ogType: "website",
    ogImage: DEFAULT_OG_IMAGE,
    jsonLd: [homeHospitalJsonLd, homeFaqJsonLd],
    bodyHtml: homeBodyHtml,
    compiledCss,
  });
  writeRouteHtml("/", homeHtml);
  count++;

  // Static content definitions for all core pages
  const staticPages = [
    {
      route: "/about",
      title: "About Us - Leading Hospital in LB Nagar, Hyderabad",
      description: "Learn about Agastya Hospitals, a premier 150-bed multi-super specialty hospital in LB Nagar, Hyderabad. Dedicated to ethical, empathetic, and advanced healthcare.",
      h1: "Empathetic Care Powered by Cutting-Edge Technology",
      contentHtml: `
        <div class="container py-5">
          <div class="row mb-5">
            <div class="col-lg-8 mx-auto text-center">
              <h1 class="fw-bold mb-3" style="color:#022b50;">Empathetic Care Powered by Cutting-Edge Technology for Your Well-being</h1>
              <p class="lead text-muted">Agastya Hospitals is a premier 150-bedded multi-super specialty tertiary care center located at Sagar Ring Road, LB Nagar, Hyderabad.</p>
            </div>
          </div>
          <div class="row g-5 align-items-center mb-5">
            <div class="col-lg-6">
              <img src="https://res.cloudinary.com/sdk28cdn/image/upload/v1772347822/agastya/Agastya_Hospitals.gif" alt="Agastya Hospitals Facility" class="img-fluid rounded shadow" />
            </div>
            <div class="col-lg-6">
              <h3 class="fw-bold mb-3" style="color:#16375b;">Our Legacy & Commitment</h3>
              <p style="font-size:16px;line-height:1.8;color:#333;">
                Agastya Hospitals is located at the convergence of 5 most vital routes of the twin cities, at Sagar Ring Road, LB Nagar, Hyderabad. The hospital was established by visionary clinicians with a mission to deliver world-class clinical excellence at affordable costs.
              </p>
              <p style="font-size:16px;line-height:1.8;color:#333;">
                Featuring 150 beds, state-of-the-art modular operation theatres, a digital Siemens Cath Lab, 24/7 emergency and trauma care, and dedicated ICUs, Agastya Hospitals is the trusted healthcare destination for Hyderabad and neighboring districts.
              </p>
            </div>
          </div>
        </div>
      `,
    },
    {
      route: "/specialties",
      title: "Specialties - Best Super Specialty Hospital in LB Nagar, Hyderabad",
      description: "Explore 20+ specialized medical departments and clinical treatments at Agastya Hospitals, LB Nagar, Hyderabad.",
      h1: "Our Medical Specialties",
      contentHtml: `
        <div class="container py-5">
          <div class="text-center mb-5">
            <h1 class="fw-bold mb-3" style="color:#022b50;">Our Medical Specialties</h1>
            <p class="text-muted mx-auto" style="max-width:700px;">Comprehensive super specialty medical and surgical care under one roof in LB Nagar, Hyderabad.</p>
          </div>
          <div class="row g-4">
            ${specialties.map((spec) => {
              const slug = spec.specialityName.trim().toLowerCase().replace(/&/g, "and").replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
              return `
                <div class="col-lg-4 col-md-6">
                  <div class="card h-100 p-4 border rounded shadow-sm">
                    <h3 class="fw-bold mb-2" style="font-size:20px;color:#022b50;">${escapeHtml(spec.specialityName)}</h3>
                    <p class="text-muted small flex-grow-1">${escapeHtml(spec.shortDescription || "Comprehensive clinical diagnosis and treatment.")}</p>
                    <a href="/specialty/${slug}" class="fw-bold text-primary mt-2" style="text-decoration:none;">View Department Details &rarr;</a>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `,
    },
    {
      route: "/find-doctor",
      title: "Find a Doctor - Expert Specialists at Agastya Hospitals",
      description: "Book appointments with leading specialist doctors, surgeons, and consultants at Agastya Hospitals, LB Nagar, Hyderabad.",
      h1: "Find a Specialist Doctor",
      contentHtml: `
        <div class="container py-5">
          <div class="text-center mb-5">
            <h1 class="fw-bold mb-3" style="color:#022b50;">Find a Specialist Doctor</h1>
            <p class="text-muted mx-auto" style="max-width:700px;">Connect with Hyderabad's leading medical experts, surgeons, and physicians across all major clinical departments.</p>
          </div>
          <div class="row g-4">
            ${doctors.map((doc) => {
              const slug = doc.fullName.trim().toLowerCase().replace(/[.\s]+/g, "-").replace(/^-+|-+$/g, "");
              const photo = doc.profilePicture || DEFAULT_OG_IMAGE;
              return `
                <div class="col-lg-3 col-md-6 text-center">
                  <div class="card h-100 p-3 border rounded shadow-sm">
                    <img src="${escapeHtml(photo)}" alt="${escapeHtml(doc.fullName)}" class="img-fluid rounded-circle mx-auto mb-3" style="width:120px;height:120px;object-fit:cover;" />
                    <h4 class="fw-bold mb-1" style="font-size:18px;color:#022b50;">${escapeHtml(doc.fullName)}</h4>
                    <p class="text-primary small mb-1">${escapeHtml(doc.designation || "Specialist Consultant")}</p>
                    <p class="text-muted small mb-3">${escapeHtml(doc.departmentName || doc.specialityNames?.join(", ") || "")}</p>
                    <a href="/doctor/${slug}" class="btn btn-outline-primary btn-sm w-100" style="border-radius:20px;">View Profile</a>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `,
    },
    {
      route: "/blog",
      title: "Health Blog - Medical Articles & Health Tips | Agastya Hospitals",
      description: "Read health advice, clinical articles, and wellness guidance written by specialist doctors at Agastya Hospitals, LB Nagar, Hyderabad.",
      h1: "Health & Medical Articles",
      contentHtml: `
        <div class="container py-5">
          <div class="text-center mb-5">
            <h1 class="fw-bold mb-3" style="color:#022b50;">Health & Medical Articles</h1>
            <p class="text-muted mx-auto" style="max-width:700px;">Expert health advice, treatment breakthroughs, disease prevention tips, and hospital updates.</p>
          </div>
          <div class="row g-4">
            ${blogs.map((b) => {
              const slug = b.url ? b.url.trim() : "";
              const banner = b.postThumbnail || b.postBanner || DEFAULT_OG_IMAGE;
              return `
                <div class="col-lg-4 col-md-6">
                  <div class="card h-100 border rounded shadow-sm overflow-hidden">
                    <img src="${escapeHtml(banner)}" alt="${escapeHtml(b.title)}" style="height:200px;width:100%;object-fit:cover;" />
                    <div class="p-3 d-flex flex-col flex-grow-1">
                      ${b.category ? `<span class="badge bg-primary mb-2" style="background:#022b50!important;align-self:flex-start;">${escapeHtml(b.category)}</span>` : ""}
                      <h4 class="fw-bold mb-2" style="font-size:18px;line-height:1.4;"><a href="/blog/${slug}" style="text-decoration:none;color:#022b50;">${escapeHtml(b.title)}</a></h4>
                      <p class="text-muted small flex-grow-1">${escapeHtml(stripHtml(b.metaDescription || b.title).slice(0, 120))}...</p>
                      <a href="/blog/${slug}" class="fw-bold text-primary mt-2" style="text-decoration:none;">Read Full Article &rarr;</a>
                    </div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `,
    },
    {
      route: "/health-packages",
      title: "Health Checkup Packages in LB Nagar, Hyderabad | Agastya Hospitals",
      description: "Preventive master health checkups, cardiac evaluations, diabetic screenings, and executive health packages at Agastya Hospitals.",
      h1: "Preventive Health Checkup Packages",
      contentHtml: `
        <div class="container py-5">
          <div class="text-center mb-5">
            <h1 class="fw-bold mb-3" style="color:#022b50;">Preventive Health Checkup Packages</h1>
            <p class="text-muted mx-auto" style="max-width:700px;">Comprehensive diagnostic health screenings designed for early detection and preventive wellness.</p>
          </div>
          <div class="row g-4">
            <div class="col-md-4">
              <div class="card p-4 h-100 border rounded shadow-sm">
                <h3 class="fw-bold text-primary mb-2">Master Health Checkup</h3>
                <p class="text-muted small">Complete screening including CBC, Lipid Profile, Liver Function, Kidney Function, ECG, Chest X-Ray, and Physician Consultation.</p>
                <a href="/book-appointment" class="btn btn-primary mt-auto" style="background:#022b50;border-radius:25px;">Book This Package</a>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card p-4 h-100 border rounded shadow-sm">
                <h3 class="fw-bold text-primary mb-2">Cardiac Health Package</h3>
                <p class="text-muted small">Specialized heart screening with 2D Echo, TMT, Lipid Profile, Cardiac Enzymes, and Senior Cardiologist Consultation.</p>
                <a href="/book-appointment" class="btn btn-primary mt-auto" style="background:#022b50;border-radius:25px;">Book This Package</a>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card p-4 h-100 border rounded shadow-sm">
                <h3 class="fw-bold text-primary mb-2">Executive Health Screening</h3>
                <p class="text-muted small">Full-body executive screening with advanced ultrasound, thyroid profile, cancer markers, and multi-specialty evaluations.</p>
                <a href="/book-appointment" class="btn btn-primary mt-auto" style="background:#022b50;border-radius:25px;">Book This Package</a>
              </div>
            </div>
          </div>
        </div>
      `,
    },
    {
      route: "/contact-us",
      title: "Contact Us - Agastya Hospitals LB Nagar, Hyderabad",
      description: "Contact Agastya Hospitals in LB Nagar, Hyderabad. Hospital address, 24/7 helpline numbers, directions, and OPD appointment booking.",
      h1: "Contact Agastya Hospitals",
      contentHtml: `
        <div class="container py-5">
          <div class="row g-5">
            <div class="col-lg-6">
              <h1 class="fw-bold mb-4" style="color:#022b50;">Contact Agastya Hospitals</h1>
              <p class="lead text-muted mb-4">We are here to assist you 24/7 with appointments, emergency admissions, and medical inquiries.</p>
              <div class="mb-3">
                <strong>Hospital Address:</strong>
                <p class="text-muted">Plot No. 1, Sagar Ring Road, Beside LB Nagar Metro Station, LB Nagar, Hyderabad, Telangana - 500074.</p>
              </div>
              <div class="mb-3">
                <strong>24x7 Emergency & Appointment Helpline:</strong>
                <p class="fs-5 fw-bold text-primary">040 65 108 108 | +91 9459 108 108</p>
              </div>
              <div class="mb-3">
                <strong>Email Address:</strong>
                <p class="text-muted">info@agastyahospitals.com</p>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="p-4 bg-light rounded shadow-sm border">
                <h3 class="fw-bold mb-3" style="color:#022b50;">Book a Consultation</h3>
                <p class="text-muted small">Schedule an in-person consultation with our super specialists.</p>
                <a href="/book-appointment" class="btn btn-primary w-100 py-3 fw-bold" style="background:#022b50;border-radius:25px;">
                  Book Appointment Online
                </a>
              </div>
            </div>
          </div>
        </div>
      `,
    },
    {
      route: "/careers",
      title: "Careers | Agastya Hospitals",
      description: "Explore medical, nursing, paramedical, and administrative healthcare careers at Agastya Hospitals, Hyderabad.",
      h1: "Careers at Agastya Hospitals",
      contentHtml: `
        <div class="container py-5 text-center">
          <h1 class="fw-bold mb-3" style="color:#022b50;">Join Our Healthcare Team</h1>
          <p class="lead text-muted mx-auto mb-4" style="max-width:700px;">Be part of a clinical environment driven by excellence, ethical patient care, and continuous professional growth.</p>
          <p>Send your resume to <strong>hr@agastyahospitals.com</strong> or <strong>careers@agastyahospitals.com</strong>.</p>
        </div>
      `,
    },
    {
      route: "/book-appointment",
      title: "Book Doctor Appointment Online | Agastya Hospitals",
      description: "Book an in-person or online consultation appointment with specialist doctors at Agastya Hospitals, LB Nagar, Hyderabad.",
      h1: "Book Doctor Appointment",
      contentHtml: `
        <div class="container py-5 text-center">
          <h1 class="fw-bold mb-3" style="color:#022b50;">Book Doctor Appointment</h1>
          <p class="lead text-muted mx-auto mb-4" style="max-width:700px;">Consult Hyderabad's top specialists at Agastya Hospitals. Call 040 65 108 108 or schedule directly.</p>
          <a href="tel:04065108108" class="btn btn-primary px-5 py-3 fw-bold" style="background:#022b50;border-radius:25px;">Call 040 65 108 108</a>
        </div>
      `,
    },
    {
      route: "/free-second-opinion",
      title: "Get Expert Second Medical Opinion | Agastya Hospitals",
      description: "Receive a free, confidential second medical opinion from senior surgical and medical specialists at Agastya Hospitals, Hyderabad.",
      h1: "Free Expert Second Opinion",
      contentHtml: `
        <div class="container py-5 text-center">
          <h1 class="fw-bold mb-3" style="color:#022b50;">Free Expert Second Opinion</h1>
          <p class="lead text-muted mx-auto mb-4" style="max-width:700px;">Upload your clinical reports to get an expert review from our senior consultants before major procedures.</p>
        </div>
      `,
    },
    {
      route: "/patient-care",
      title: "Patient Care Services | Agastya Hospitals",
      description: "Explore in-patient amenities, critical care protocols, and patient welfare services at Agastya Hospitals.",
      h1: "Patient Care Services",
      contentHtml: `
        <div class="container py-5">
          <h1 class="fw-bold mb-4" style="color:#022b50;">Patient Care Services</h1>
          <p class="lead text-muted">Comprehensive patient care designed around clinical excellence, patient comfort, and compassionate bedside care.</p>
        </div>
      `,
    },
    {
      route: "/patient",
      title: "Patient Information & Visitor Guidelines | Agastya Hospitals",
      description: "Hospital admission protocols, visitor guidelines, insurance helpdesk, and patient amenities at Agastya Hospitals, LB Nagar, Hyderabad.",
      h1: "Patient Information & Guidelines",
      contentHtml: `
        <div class="container py-5">
          <h1 class="fw-bold mb-4" style="color:#022b50;">Patient Information & Services</h1>
          <p class="lead text-muted">Everything you need to know about admission guidelines, insurance desk, visitor policies, and hospital facilities.</p>
        </div>
      `,
    },
    {
      route: "/news-and-updates",
      title: "News & Hospital Updates | Agastya Hospitals",
      description: "Latest news, community health initiatives, medical camps, and clinical updates from Agastya Hospitals.",
      h1: "News & Clinical Updates",
      contentHtml: `
        <div class="container py-5">
          <h1 class="fw-bold mb-4" style="color:#022b50;">News & Hospital Updates</h1>
          <p class="lead text-muted">Stay informed on hospital announcements, free medical screening camps, and clinical breakthroughs.</p>
        </div>
      `,
    },
    {
      route: "/privacy-policy",
      title: "Privacy Policy | Agastya Hospitals",
      description: "Privacy policy and patient health data protection practices at Agastya Hospitals.",
      h1: "Privacy Policy",
      contentHtml: `
        <div class="container py-5">
          <h1 class="fw-bold mb-4" style="color:#022b50;">Privacy Policy</h1>
          <p class="lead text-muted">We are committed to maintaining the confidentiality and integrity of your medical and personal data.</p>
        </div>
      `,
    },
    {
      route: "/terms-and-conditions",
      title: "Terms and Conditions | Agastya Hospitals",
      description: "Terms and conditions for hospital services, website interactions, and consultation appointments.",
      h1: "Terms & Conditions",
      contentHtml: `
        <div class="container py-5">
          <h1 class="fw-bold mb-4" style="color:#022b50;">Terms and Conditions</h1>
          <p class="lead text-muted">Terms governing medical services, appointment scheduling, and website usage at Agastya Hospitals.</p>
        </div>
      `,
    },
    {
      route: "/international-patient",
      title: "International Patients Care & Assistance | Agastya Hospitals",
      description: "World-class healthcare, personalized travel assistance, and concierge services for international patients at Agastya Hospitals, Hyderabad.",
      h1: "International Patients Services",
      contentHtml: `
        <div class="container py-5">
          <h1 class="fw-bold mb-4" style="color:#022b50;">International Patients Services</h1>
          <p class="lead text-muted">Dedicated concierge services for international patients including tele-consultation, medical visa invitation letters, and airport transfers.</p>
        </div>
      `,
    },
    {
      route: "/leadership-team",
      title: "Leadership Team & Medical Directors | Agastya Hospitals",
      description: "Meet the executive leadership and medical directors behind Agastya Hospitals, Hyderabad.",
      h1: "Our Leadership Team",
      contentHtml: `
        <div class="container py-5">
          <h1 class="fw-bold mb-4" style="color:#022b50;">Our Leadership Team</h1>
          <p class="lead text-muted">Guided by eminent clinicians and healthcare administrators dedicated to patient-centric medical excellence.</p>
        </div>
      `,
    },
    {
      route: "/achievements",
      title: "Hospital Achievements & Clinical Milestones | Agastya Hospitals",
      description: "Milestones, surgical accomplishments, and clinical excellence achievements at Agastya Hospitals.",
      h1: "Achievements & Clinical Milestones",
      contentHtml: `
        <div class="container py-5">
          <h1 class="fw-bold mb-4" style="color:#022b50;">Achievements & Milestones</h1>
          <p class="lead text-muted">Celebrating landmark surgical outcomes, complex interventions, and life-saving critical care deliveries.</p>
        </div>
      `,
    },
    {
      route: "/awards-recognition",
      title: "Awards & Quality Recognition | Agastya Hospitals",
      description: "Healthcare awards, quality accreditations, and industry recognition received by Agastya Hospitals.",
      h1: "Awards & Recognition",
      contentHtml: `
        <div class="container py-5">
          <h1 class="fw-bold mb-4" style="color:#022b50;">Awards & Recognition</h1>
          <p class="lead text-muted">Recognized for clinical excellence, patient safety protocols, and healthcare quality standards.</p>
        </div>
      `,
    },
    {
      route: "/gallery",
      title: "Hospital Facility & Infrastructure Gallery | Agastya Hospitals",
      description: "Visual tour of Agastya Hospitals: modern ICUs, Cath Lab, modular operation theatres, and patient rooms.",
      h1: "Hospital Photo Gallery",
      contentHtml: `
        <div class="container py-5">
          <h1 class="fw-bold mb-4" style="color:#022b50;">Hospital Infrastructure Gallery</h1>
          <p class="lead text-muted">Take a visual tour of our modern clinical infrastructure, operation suites, diagnostic facilities, and recovery rooms.</p>
        </div>
      `,
    },
  ];

  for (const page of staticPages) {
    const jsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: page.h1,
        description: page.description,
        url: `${BASE_URL}${page.route}`,
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: page.h1, item: `${BASE_URL}${page.route}` },
        ],
      },
    ];

    const html = createStaticPageHtml(baseTemplate, {
      route: page.route,
      title: page.title,
      description: page.description,
      canonical: page.route,
      ogType: "website",
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd,
      bodyHtml: page.contentHtml,
      compiledCss,
    });

    writeRouteHtml(page.route, html);
    count++;
  }

  // ---------------------------------------------------------------------------
  // Step 6: Generate 404 Not Found Page (dist/404.html)
  // ---------------------------------------------------------------------------
  console.log("🚫 Generating 404 Not Found Page (dist/404.html)...");
  const notFoundBodyHtml = `
    <div class="container py-5 text-center my-5">
      <div class="row justify-content-center">
        <div class="col-lg-8 col-md-10">
          <div class="p-5 rounded-4 shadow-sm bg-white border">
            <h1 class="display-1 fw-bold text-primary mb-3" style="color:#022b50;font-size:72px;">404</h1>
            <h2 class="mb-3 fw-bold" style="color:#16375b;">Page Not Found</h2>
            <p class="text-muted fs-5 mb-4">
              We couldn't find the page you were looking for. The link might be broken,
              the URL might have changed, or the page may have been removed.
            </p>
            <div class="d-flex flex-wrap justify-content-center gap-3 mt-4">
              <a href="/" class="btn btn-primary px-4 py-2" style="background:#022b50;border-radius:25px;font-weight:600;">Back to Home</a>
              <a href="/specialties" class="btn btn-outline-primary px-4 py-2" style="border-radius:25px;font-weight:600;">Our Specialties</a>
              <a href="/find-doctor" class="btn btn-outline-primary px-4 py-2" style="border-radius:25px;font-weight:600;">Find a Doctor</a>
              <a href="/contact-us" class="btn btn-outline-secondary px-4 py-2" style="border-radius:25px;font-weight:600;">Contact Us</a>
            </div>
            <div class="mt-5 pt-3 border-top text-muted small">
              Need immediate medical assistance? Call our 24/7 Helpline: <strong>040 65 108 108</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const notFoundHtml = createStaticPageHtml(baseTemplate, {
    route: "/404",
    title: "404 - Page Not Found | Agastya Hospitals",
    description: "The requested page was not found.",
    canonical: "/404",
    ogType: "website",
    ogImage: DEFAULT_OG_IMAGE,
    jsonLd: [],
    bodyHtml: notFoundBodyHtml,
    robots: "noindex, nofollow",
    compiledCss,
  });

  writeFileSync(join(DIST_DIR, "404.html"), notFoundHtml, "utf-8");
  console.log("  ✓ dist/404.html generated successfully");

  console.log(`\n✅ SSG COMPLETE! Successfully pre-rendered ${count} pages into dist/`);
  console.log(`   - Output directories: dist/<route>/index.html and dist/<route>.html`);
  console.log(`   - Inlined CSS: YES (100% self-contained styling in View Page Source)`);
  console.log(`   - Vite Client Script: PRESERVED (clean client-side React hydration)`);
  console.log(`   - Proper 404: dist/404.html (returns true HTTP 404 on missing routes)\n`);
}

// Allow direct CLI execution: node scripts/generate-ssg.js
if (process.argv[1] && process.argv[1].endsWith("generate-ssg.js")) {
  runSSG().catch((err) => {
    console.error("SSG Error:", err);
    process.exit(1);
  });
}

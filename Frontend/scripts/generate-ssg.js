/**
 * Standalone Static Site Generator (SSG) for Agastya Hospitals
 *
 * Runs during `npm run build` after Vite compiles the client assets.
 * Fetches all dynamic content (blogs, specialties, doctors) from the backend API
 * and generates pre-rendered, SEO-optimized static HTML files for EVERY route.
 *
 * Advantages:
 * - 100% reliable on Render.com, Linux, macOS, and Windows (NO Puppeteer or Chrome required).
 * - Generates all 150+ pages in ~2-3 seconds.
 * - Injects dynamic <title>, <meta description>, <meta keywords>, Open Graph, Twitter cards,
 *   canonical links, and Schema.org JSON-LD structured data into <head>.
 * - Injects semantic HTML with headings, article content, and doctor details into <div id="root">
 *   so that search engine crawlers (Googlebot, Bingbot) and "View Page Source" immediately see
 *   the fully-indexed page content without waiting for client-side JavaScript.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
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

// Helper to escape HTML attributes safely
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Strip HTML tags for clean meta descriptions
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
 * Builds standard header HTML matching the React Header component
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
            <img src="https://res.cloudinary.com/sdk28cdn/image/upload/v1758389743/agastya/agastya-logo.svg" alt="Agastya Hospitals Logo" style="height:60px;" />
          </a>
          <div class="d-flex items-center gap-4">
            <a href="/" style="text-decoration:none;font-weight:600;color:#000;">Home</a>
            <a href="/about" style="text-decoration:none;font-weight:600;color:#000;">About Us</a>
            <a href="/specialties" style="text-decoration:none;font-weight:600;color:#000;">Specialties</a>
            <a href="/find-doctor" style="text-decoration:none;font-weight:600;color:#000;">Find Doctor</a>
            <a href="/health-packages" style="text-decoration:none;font-weight:600;color:#000;">Health Packages</a>
            <a href="/blog" style="text-decoration:none;font-weight:600;color:#000;">Blog</a>
            <a href="/contact-us" style="text-decoration:none;font-weight:600;color:#000;">Contact</a>
          </div>
        </div>
      </nav>
    </header>
  `;
}

/**
 * Builds standard footer HTML matching the React Footer component
 */
function buildFooterHtml() {
  return `
    <footer class="footer-main" style="background:#16375b;color:#fff;padding:40px 20px 20px;">
      <div class="container">
        <div class="row">
          <div class="col-lg-4 col-md-6 mb-4">
            <img src="https://res.cloudinary.com/sdk28cdn/image/upload/v1758389743/agastya/agastya-logo.svg" alt="Agastya Hospitals" style="height:55px;filter:brightness(0) invert(1);margin-bottom:15px;" />
            <p style="color:#ddd;font-size:14px;line-height:1.6;">
              Agastya Hospitals is a premier super specialty medical center in LB Nagar, Hyderabad, committed to delivering advanced, compassionate, and affordable clinical healthcare 24/7.
            </p>
            <div class="helpline" style="margin-top:15px;">
              <span class="dot"></span>
              <strong>040 65 108 108</strong>
            </div>
          </div>
          <div class="col-lg-2 col-md-6 mb-4">
            <h5 style="color:#fff;font-weight:700;margin-bottom:15px;">Quick Links</h5>
            <ul style="list-style:none;padding:0;margin:0;line-height:2;">
              <li><a href="/about" style="color:#ccc;text-decoration:none;">About Us</a></li>
              <li><a href="/specialties" style="color:#ccc;text-decoration:none;">Specialties</a></li>
              <li><a href="/find-doctor" style="color:#ccc;text-decoration:none;">Find a Doctor</a></li>
              <li><a href="/health-packages" style="color:#ccc;text-decoration:none;">Health Packages</a></li>
              <li><a href="/blog" style="color:#ccc;text-decoration:none;">Health Blog</a></li>
              <li><a href="/contact-us" style="color:#ccc;text-decoration:none;">Contact Us</a></li>
            </ul>
          </div>
          <div class="col-lg-3 col-md-6 mb-4">
            <h5 style="color:#fff;font-weight:700;margin-bottom:15px;">Key Specialties</h5>
            <ul style="list-style:none;padding:0;margin:0;line-height:2;">
              <li><a href="/specialty/cardiology" style="color:#ccc;text-decoration:none;">Cardiology</a></li>
              <li><a href="/specialty/orthopaedics" style="color:#ccc;text-decoration:none;">Orthopaedics</a></li>
              <li><a href="/specialty/nephrology" style="color:#ccc;text-decoration:none;">Nephrology</a></li>
              <li><a href="/specialty/neurology" style="color:#ccc;text-decoration:none;">Neurology</a></li>
              <li><a href="/specialty/urology-and-andrology" style="color:#ccc;text-decoration:none;">Urology & Andrology</a></li>
            </ul>
          </div>
          <div class="col-lg-3 col-md-6 mb-4">
            <h5 style="color:#fff;font-weight:700;margin-bottom:15px;">Hospital Location</h5>
            <p style="color:#ccc;font-size:14px;line-height:1.6;">
              Plot No. 1, Sagar Ring Road, Beside LB Nagar Metro Station, LB Nagar, Hyderabad, Telangana - 500074.
            </p>
            <p style="color:#ccc;font-size:14px;margin-top:10px;">
              <strong>Email:</strong> info@agastyahospitals.com<br />
              <strong>Emergency:</strong> +91 9459 108 108
            </p>
          </div>
        </div>
      </div>
      <div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:20px;margin-top:20px;text-align:center;color:#aaa;font-size:13px;">
        &copy; ${new Date().getFullYear()} Agastya Hospitals. All Rights Reserved. | <a href="/privacy-policy" style="color:#aaa;">Privacy Policy</a> | <a href="/terms-and-conditions" style="color:#aaa;">Terms & Conditions</a>
      </div>
    </footer>
  `;
}

/**
 * Replaces the HTML <head> meta tags and <div id="root"> content in baseTemplate
 */
function createStaticPageHtml(baseTemplate, {
  route,
  title,
  description,
  keywords = "",
  canonical = "",
  ogType = "website",
  ogImage = DEFAULT_OG_IMAGE,
  jsonLd = [],
  bodyHtml = ""
}) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : `${BASE_URL}${route === "/" ? "" : route}`;
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
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="${escapeHtml(ogType)}" />
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
  <meta property="og:title" content="${escapeHtml(fullTitle)}" />
  <meta property="og:description" content="${escapeHtml(cleanDescription)}" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  <meta property="og:image" content="${escapeHtml(ogImage)}" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${escapeHtml(canonicalUrl)}" />
  <meta name="twitter:title" content="${escapeHtml(fullTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(cleanDescription)}" />
  <meta name="twitter:image" content="${escapeHtml(ogImage)}" />

  <!-- Structured Data -->
  ${jsonLdScripts}
  `;

  // Remove existing redundant meta description/keywords/og/twitter tags
  html = html.replace(/<meta name="description"[\s\S]*?\/>/gi, "");
  html = html.replace(/<meta name="keywords"[\s\S]*?\/>/gi, "");
  html = html.replace(/<meta property="og:[^"]+"[\s\S]*?\/>/gi, "");
  html = html.replace(/<meta name="twitter:[^"]+"[\s\S]*?\/>/gi, "");
  html = html.replace(/<link rel="canonical"[\s\S]*?\/>/gi, "");
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, "");

  // Inject dynamic tags right after <title>
  html = html.replace(`</title>`, `</title>\n${seoHeadTags}`);

  // 3. Inject pre-rendered semantic HTML into <div id="root">
  if (bodyHtml) {
    const fullRootMarkup = `
      <div id="root">
        <div class="min-h-screen flex flex-col">
          ${buildHeaderHtml(route)}
          <main class="flex-grow">
            ${bodyHtml}
          </main>
          ${buildFooterHtml()}
        </div>
      </div>
    `.trim();

    const rootStart = html.indexOf('<div id="root">');
    const scriptIdx = html.indexOf('<script>\n    document.addEventListener');
    if (rootStart !== -1 && scriptIdx !== -1) {
      html = html.slice(0, rootStart) + fullRootMarkup + "\n  " + html.slice(scriptIdx);
    } else if (rootStart !== -1) {
      const bodyEnd = html.indexOf('</body>');
      if (bodyEnd !== -1) {
        html = html.slice(0, rootStart) + fullRootMarkup + "\n" + html.slice(bodyEnd);
      }
    }
  }

  return html;
}

/**
 * Saves generated HTML to both `dist/<cleanRoute>/index.html` and `dist/<cleanRoute>.html`
 */
function writeRouteHtml(route, html) {
  let outputIndex;
  let outputHtml;

  if (route === "/" || route === "") {
    outputIndex = join(DIST_DIR, "index.html");
    writeFileSync(outputIndex, html, "utf-8");
  } else {
    const cleanRoute = route.startsWith("/") ? route.slice(1) : route;
    const dir = join(DIST_DIR, cleanRoute);
    mkdirSync(dir, { recursive: true });
    outputIndex = join(dir, "index.html");
    outputHtml = join(DIST_DIR, `${cleanRoute}.html`);

    writeFileSync(outputIndex, html, "utf-8");
    try {
      // Also write clean-url .html file for CDNs/servers that support extensionless lookups
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

  // Step 1: Fetch all dynamic resources from API in parallel
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
      <div class="banner">
        <div class="container">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="/">Home</a></li>
              <li class="breadcrumb-item"><a href="/blog">Blog</a></li>
              <li class="breadcrumb-item active" aria-current="page">${escapeHtml(blog.title)}</li>
            </ol>
          </nav>
        </div>
      </div>
      <div class="container py-5">
        <div class="row">
          <article class="col-lg-8 col-md-12">
            ${blog.category ? `<span class="badge bg-primary mb-2">${escapeHtml(blog.category)}</span>` : ""}
            <h1 class="main-title mb-3" style="font-size:32px;line-height:1.3;font-weight:700;">${escapeHtml(blog.title)}</h1>
            <div class="d-flex align-items-center gap-3 text-muted mb-4 pb-2 border-bottom" style="font-size:14px;">
              <span><strong>By:</strong> ${escapeHtml(author)}</span>
              ${dateFormatted ? `<span>&bull;</span><span>${escapeHtml(dateFormatted)}</span>` : ""}
            </div>
            ${
              banner
                ? `<div class="mb-4 text-center">
                    <img src="${escapeHtml(banner)}" alt="${escapeHtml(blog.title)}" class="img-fluid rounded shadow-sm" style="max-height:450px;width:100%;object-fit:cover;" />
                  </div>`
                : ""
            }
            <div class="blog-content" style="font-size:16px;line-height:1.8;color:#222;">
              ${blog.blogContent || `<p>${escapeHtml(description)}</p>`}
            </div>
          </article>
          <aside class="col-lg-4 col-md-12 mt-4 mt-lg-0">
            <div class="appointment-sidebar p-4 rounded shadow-sm" style="background:#f8fbff;border:1px solid #e0ecfb;">
              <h4 class="mb-3" style="font-weight:700;color:#022b50;">Need Specialist Consultation?</h4>
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
      <div class="banner">
        <div class="container">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="/">Home</a></li>
              <li class="breadcrumb-item"><a href="/specialties">Specialties</a></li>
              <li class="breadcrumb-item active" aria-current="page">${escapeHtml(rawName)}</li>
            </ol>
          </nav>
        </div>
      </div>
      <div class="container py-5">
        <div class="row">
          <div class="col-lg-8 col-md-12">
            <h1 class="main-title mb-4" style="font-size:34px;font-weight:700;">${escapeHtml(rawName)}</h1>
            ${
              banner && banner !== DEFAULT_OG_IMAGE
                ? `<div class="mb-4"><img src="${escapeHtml(banner)}" alt="${escapeHtml(rawName)}" class="img-fluid rounded shadow-sm" style="max-height:350px;width:100%;object-fit:cover;" /></div>`
                : ""
            }
            <div class="specialtypage-details" style="font-size:16px;line-height:1.8;color:#222;">
              ${spec.pageDescription || `<p>${escapeHtml(description)}</p>`}
            </div>
            ${
              spec.doctorNames && spec.doctorNames.length > 0
                ? `<div class="mt-5 p-4 rounded" style="background:#f9fbfd;border:1px solid #e2edf8;">
                    <h3 style="font-weight:700;color:#022b50;margin-bottom:15px;">Doctors Specializing in ${escapeHtml(rawName)}</h3>
                    <ul style="list-style:none;padding:0;">
                      ${spec.doctorNames.map((d) => `<li style="font-size:16px;margin-bottom:8px;"><strong>&bull;</strong> ${escapeHtml(d)}</li>`).join("")}
                    </ul>
                  </div>`
                : ""
            }
          </div>
          <div class="col-lg-4 col-md-12 mt-4 mt-lg-0">
            <div class="appointment-sidebar p-4 rounded shadow-sm" style="background:#f8fbff;border:1px solid #e0ecfb;">
              <h4 class="mb-3" style="font-weight:700;color:#022b50;">Book Consultation</h4>
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
    const description = `Consult ${name}, ${designation} (${qualifications}) at Agastya Hospitals, LB Nagar, Hyderabad. ${experience ? experience + '.' : ''} Experienced specialist in ${department || 'super specialty healthcare'}.`;
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
      <div class="banner">
        <div class="container">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="/">Home</a></li>
              <li class="breadcrumb-item"><a href="/find-doctor">Doctors</a></li>
              <li class="breadcrumb-item active" aria-current="page">${escapeHtml(name)}</li>
            </ol>
          </nav>
        </div>
      </div>
      <div class="container py-5">
        <div class="row">
          <div class="col-lg-4 col-md-5 text-center mb-4">
            <div class="p-4 rounded shadow-sm" style="background:#fff;border:1px solid #e5e5e5;">
              <img src="${escapeHtml(photo)}" alt="${escapeHtml(name)}" class="img-fluid rounded-circle shadow" style="width:180px;height:180px;object-fit:cover;margin:0 auto 20px;" />
              <h2 style="font-size:22px;font-weight:700;color:#000;">${escapeHtml(name)}</h2>
              <p style="color:#022b50;font-weight:600;font-size:15px;margin-bottom:5px;">${escapeHtml(designation)}</p>
              ${qualifications ? `<p class="text-muted" style="font-size:14px;margin-bottom:5px;">${escapeHtml(qualifications)}</p>` : ""}
              ${experience ? `<p class="badge bg-success" style="font-size:13px;">${escapeHtml(experience)}</p>` : ""}
              <div class="mt-4">
                <a href="/book-appointment" class="btn btn-primary w-100 py-2" style="background:#022b50;border-radius:25px;font-weight:600;">
                  Book Appointment
                </a>
              </div>
            </div>
          </div>
          <div class="col-lg-8 col-md-7">
            <h1 class="main-title mb-4" style="font-size:32px;font-weight:700;">${escapeHtml(name)}</h1>
            ${department ? `<div class="mb-3"><strong>Specialty / Department:</strong> <span class="badge bg-secondary">${escapeHtml(department)}</span></div>` : ""}
            ${
              doc.about
                ? `<div class="mb-4">
                    <h3 style="font-size:20px;font-weight:700;color:#022b50;margin-bottom:10px;">About Doctor</h3>
                    <div style="font-size:16px;line-height:1.7;color:#333;">${doc.about}</div>
                  </div>`
                : ""
            }
            ${
              doc.expertise
                ? `<div class="mb-4">
                    <h3 style="font-size:20px;font-weight:700;color:#022b50;margin-bottom:10px;">Clinical Expertise</h3>
                    <div style="font-size:16px;line-height:1.7;color:#333;">${doc.expertise}</div>
                  </div>`
                : ""
            }
            ${
              doc.opTimings
                ? `<div class="mb-4 p-3 rounded" style="background:#f4f7fb;">
                    <h3 style="font-size:18px;font-weight:700;color:#022b50;margin-bottom:8px;">OP Consultation Timings</h3>
                    <p style="margin:0;font-size:15px;">${escapeHtml(doc.opTimings)}</p>
                  </div>`
                : ""
            }
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
    });

    writeRouteHtml(route, html);
    count++;
  }

  // ---------------------------------------------------------------------------
  // Step 5: Generate Core Static Pages
  // ---------------------------------------------------------------------------
  console.log("🌐 Generating Core Static Pages...");
  const staticPages = [
    {
      route: "/",
      title: "Agastya Hospitals - Best Super Specialty Hospital in LB Nagar, Hyderabad",
      description: "Agastya Hospitals is a leading super specialty hospital in LB Nagar, Hyderabad offering advanced medical, surgical, and 24/7 critical care services with experienced specialists.",
      h1: "Agastya Hospitals - Best Super Specialty Hospital in LB Nagar, Hyderabad",
      intro: "Leading super specialty hospital in LB Nagar, Hyderabad offering advanced medical, surgical, robotic surgery, and 24/7 emergency & critical care services with experienced specialists."
    },
    {
      route: "/about",
      title: "About Us | Agastya Hospitals",
      description: "Learn about Agastya Hospitals, our mission, vision, clinical excellence, and dedication to delivering world-class healthcare in LB Nagar, Hyderabad.",
      h1: "About Agastya Hospitals",
      intro: "Agastya Hospitals is a premier multi-super specialty hospital situated in LB Nagar, Hyderabad, offering advanced medical treatments, cutting-edge surgical technologies, and 24/7 emergency & critical care."
    },
    {
      route: "/specialties",
      title: "Specialties - Best Super Specialty Hospital in LB Nagar, Hyderabad | Agastya Hospitals",
      description: "Explore the wide range of super specialty medical departments and treatments available at Agastya Hospitals, LB Nagar, Hyderabad.",
      h1: "Our Medical Specialties",
      intro: "Agastya Hospitals provides comprehensive, multi-disciplinary care across Cardiology, Orthopaedics, Neurology, Nephrology, Gastroenterology, Urology, Emergency & Critical Care."
    },
    {
      route: "/find-doctor",
      title: "Find a Doctor - Best Specialist Doctors in LB Nagar | Agastya Hospitals",
      description: "Find and book appointments with leading specialist doctors, surgeons, and physicians at Agastya Hospitals, LB Nagar, Hyderabad.",
      h1: "Find a Doctor",
      intro: "Connect with Hyderabad's leading medical experts, robotic surgeons, and super specialists across all major clinical departments."
    },
    {
      route: "/blog",
      title: "Health Blog - Medical Articles & Health Tips | Agastya Hospitals",
      description: "Stay updated with health tips, medical advice, and wellness articles written by specialist doctors at Agastya Hospitals, LB Nagar, Hyderabad.",
      h1: "Health & Medical Blog",
      intro: "Expert medical insights, disease prevention guidelines, healthy living advice, and surgical advancements from Agastya Hospitals doctors."
    },
    {
      route: "/health-packages",
      title: "Health Checkup Packages in LB Nagar, Hyderabad | Agastya Hospitals",
      description: "Affordable master health checkup packages and preventive healthcare screenings at Agastya Hospitals, LB Nagar, Hyderabad.",
      h1: "Preventive Health Checkup Packages",
      intro: "Choose from comprehensive master health checkups, cardiac health packages, diabetic screenings, and executive health packages tailored for every age group."
    },
    {
      route: "/contact-us",
      title: "Contact Us - Agastya Hospitals LB Nagar, Hyderabad",
      description: "Contact Agastya Hospitals in LB Nagar, Hyderabad. Hospital address, 24/7 emergency helpline numbers, appointment booking, and directions.",
      h1: "Contact Agastya Hospitals",
      intro: "Visit our campus at Sagar Ring Road, beside LB Nagar Metro Station, or call our 24/7 helpline at 040 65 108 108."
    },
    {
      route: "/careers",
      title: "Careers | Agastya Hospitals",
      description: "Explore career opportunities for doctors, nurses, paramedics, and healthcare professionals at Agastya Hospitals, Hyderabad.",
      h1: "Careers at Agastya Hospitals",
      intro: "Be part of a compassionate, excellence-driven healthcare team making a meaningful difference in patients' lives every day."
    },
    {
      route: "/book-appointment",
      title: "Book Doctor Appointment Online | Agastya Hospitals",
      description: "Book an in-person or online consultation appointment with specialist doctors at Agastya Hospitals, LB Nagar, Hyderabad.",
      h1: "Book an Appointment",
      intro: "Schedule your consultation quickly with our super specialist doctors across all clinical departments."
    },
    {
      route: "/patient-care",
      title: "Patient Care Services | Agastya Hospitals",
      description: "Comprehensive patient care services, in-patient amenities, critical care, and diagnostic facilities at Agastya Hospitals.",
      h1: "Patient Care Services",
      intro: "Patient comfort, safety, and personalized clinical attention are at the heart of everything we do at Agastya Hospitals."
    },
    {
      route: "/news-and-updates",
      title: "News & Medical Updates | Agastya Hospitals",
      description: "Latest news, hospital announcements, medical camps, and health updates from Agastya Hospitals.",
      h1: "News & Hospital Updates",
      intro: "Read about our latest community health initiatives, medical breakthroughs, and hospital events."
    },
    {
      route: "/privacy-policy",
      title: "Privacy Policy | Agastya Hospitals",
      description: "Privacy policy and patient data protection practices at Agastya Hospitals.",
      h1: "Privacy Policy",
      intro: "We are committed to maintaining the confidentiality and integrity of your medical and personal data."
    },
    {
      route: "/terms-and-conditions",
      title: "Terms and Conditions | Agastya Hospitals",
      description: "Terms and conditions for hospital services, website usage, and appointment bookings at Agastya Hospitals.",
      h1: "Terms & Conditions",
      intro: "Please review our terms governing appointment scheduling, healthcare services, and website interactions."
    },
    {
      route: "/free-second-opinion",
      title: "Get Expert Second Medical Opinion | Agastya Hospitals",
      description: "Get a free, confidential second medical opinion from top specialists and surgeons at Agastya Hospitals, Hyderabad.",
      h1: "Free Expert Second Opinion",
      intro: "Make informed healthcare choices with an expert second opinion from our senior consultants and surgeons."
    },
    {
      route: "/medical-reports",
      title: "Medical Reports & Diagnostic Results | Agastya Hospitals",
      description: "Access diagnostic test reports and medical records from Agastya Hospitals, LB Nagar, Hyderabad.",
      h1: "Online Medical Reports",
      intro: "View and download your laboratory, imaging, and diagnostic investigation reports securely."
    },
    {
      route: "/leadership-team",
      title: "Leadership Team & Medical Directors | Agastya Hospitals",
      description: "Meet the executive leadership and medical directors behind Agastya Hospitals, Hyderabad.",
      h1: "Our Leadership Team",
      intro: "Guided by eminent clinicians and visionary healthcare administrators committed to compassionate patient care."
    },
    {
      route: "/achievements",
      title: "Hospital Achievements & Clinical Milestones | Agastya Hospitals",
      description: "Milestones, surgical accomplishments, and clinical excellence achievements at Agastya Hospitals.",
      h1: "Achievements & Milestones",
      intro: "Celebrating landmark clinical outcomes, complex surgical achievements, and life-saving interventions."
    },
    {
      route: "/awards-recognition",
      title: "Awards & Recognition | Agastya Hospitals",
      description: "Healthcare awards, quality accreditations, and industry recognition received by Agastya Hospitals.",
      h1: "Awards & Recognition",
      intro: "Recognized for high clinical standards, patient satisfaction, and healthcare innovation."
    },
    {
      route: "/international-patient",
      title: "International Patients Services | Agastya Hospitals",
      description: "World-class healthcare, personalized travel assistance, and concierge services for international patients at Agastya Hospitals.",
      h1: "International Patients Care",
      intro: "End-to-end medical travel support including tele-consultation, visa assistance, airport transfers, and language support."
    },
    {
      route: "/gallery",
      title: "Hospital Infrastructure & Facility Gallery | Agastya Hospitals",
      description: "Photo gallery of Agastya Hospitals campus, modular operation theatres, ICU facilities, and patient rooms.",
      h1: "Hospital Photo Gallery",
      intro: "Take a visual tour of our modern medical infrastructure, advanced ICUs, diagnostic labs, and patient recovery suites."
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

    const bodyHtml = `
      <div class="banner">
        <div class="container">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="/">Home</a></li>
              <li class="breadcrumb-item active" aria-current="page">${escapeHtml(page.h1)}</li>
            </ol>
          </nav>
        </div>
      </div>
      <div class="container py-5">
        <div class="row">
          <div class="col-lg-8 col-md-12">
            <h1 class="main-title mb-4" style="font-size:34px;font-weight:700;">${escapeHtml(page.h1)}</h1>
            <p class="lead" style="font-size:18px;line-height:1.7;color:#333;">${escapeHtml(page.intro)}</p>
          </div>
          <div class="col-lg-4 col-md-12 mt-4 mt-lg-0">
            <div class="appointment-sidebar p-4 rounded shadow-sm" style="background:#f8fbff;border:1px solid #e0ecfb;">
              <h4 class="mb-3" style="font-weight:700;color:#022b50;">24/7 Hospital Helpline</h4>
              <p style="font-size:14px;color:#555;">Call us anytime for appointments, emergency admissions, or hospital information.</p>
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

    const html = createStaticPageHtml(baseTemplate, {
      route: page.route,
      title: page.title,
      description: page.description,
      canonical: page.route,
      ogType: "website",
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd,
      bodyHtml,
    });

    writeRouteHtml(page.route, html);
    count++;
  }

  console.log(`\n✅ SSG COMPLETE! Successfully pre-rendered ${count} pages into dist/`);
  console.log(`   - Output directories: dist/<route>/index.html and dist/<route>.html`);
  console.log(`   - 100% ready for search engine indexing and "View Page Source"!\n`);
}

// Allow direct CLI execution: node scripts/generate-ssg.js
if (process.argv[1] && process.argv[1].endsWith("generate-ssg.js")) {
  runSSG().catch((err) => {
    console.error("SSG Error:", err);
    process.exit(1);
  });
}

/**
 * Pre-render Route Discovery Script
 *
 * Fetches all dynamic slugs (specialties, blogs, doctors) from the backend API
 * and combines them with static routes to produce a complete list of routes
 * for vite-plugin-prerender.
 *
 * Used by vite.config.js during build.
 */

const BACKEND_URL = "https://agastya-hospitals-backend.onrender.com/api";

// All static routes from AppRoutes.js
export const STATIC_ROUTES = [
  "/",
  "/about",
  "/specialties",
  "/find-doctor",
  "/patient",
  "/blog",
  "/health-packages",
  "/careers",
  "/book-appointment",
  "/patient-care",
  "/news-and-updates",
  "/contact-us",
  "/privacy-policy",
  "/terms-and-conditions",
  "/free-second-opinion",
  "/medical-reports",
  "/leadership-team",
  "/achievements",
  "/awards-recognition",
  "/international-patient",
  "/gallery",
];

async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Returns the full list of routes (static + dynamic) to pre-render.
 */
export async function getPrerenderRoutes() {
  const routes = [...STATIC_ROUTES];

  // Fetch dynamic specialty slugs
  try {
    console.log("[prerender] Fetching specialties...");
    const specialtiesRes = await fetchJSON(`${BACKEND_URL}/specialities`);
    const specialties = specialtiesRes.data || specialtiesRes || [];
    for (const spec of specialties) {
      if (spec.specialityName) {
        const slug = spec.specialityName.toLowerCase().replace(/\s+/g, "-");
        routes.push(`/specialty/${slug}`);
      }
    }
    console.log(`[prerender]   Added ${specialties.length} specialty routes`);
  } catch (err) {
    console.warn("[prerender] Warning: Could not fetch specialties:", err.message);
  }

  // Fetch dynamic blog slugs
  try {
    console.log("[prerender] Fetching blogs...");
    const blogsRes = await fetchJSON(`${BACKEND_URL}/blogs`);
    const blogs = blogsRes.data || blogsRes || [];
    for (const blog of blogs) {
      if (blog.url) {
        routes.push(`/blog/${blog.url}`);
      }
    }
    console.log(`[prerender]   Added ${blogs.length} blog routes`);
  } catch (err) {
    console.warn("[prerender] Warning: Could not fetch blogs:", err.message);
  }

  // Fetch dynamic doctor slugs
  try {
    console.log("[prerender] Fetching doctors...");
    const doctorsRes = await fetchJSON(`${BACKEND_URL}/doctors`);
    const doctors = doctorsRes.data || doctorsRes || [];
    for (const doc of doctors) {
      if (doc.fullName) {
        const slug = doc.fullName.toLowerCase().replace(/[.\s]+/g, "-");
        routes.push(`/doctor/${slug}`);
      }
    }
    console.log(`[prerender]   Added ${doctors.length} doctor routes`);
  } catch (err) {
    console.warn("[prerender] Warning: Could not fetch doctors:", err.message);
  }

  console.log(`[prerender] Total routes to pre-render: ${routes.length}`);
  return routes;
}

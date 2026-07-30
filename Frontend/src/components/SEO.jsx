import { Helmet } from "react-helmet-async";

const SITE_NAME = "Agastya Hospitals";
const DEFAULT_DESCRIPTION =
  "Agastya Hospitals is a leading super specialty hospital in LB Nagar, Hyderabad offering advanced medical, surgical, and critical care services with experienced specialists.";
const DEFAULT_OG_IMAGE =
  "https://res.cloudinary.com/sdk28cdn/image/upload/v1758389743/agastya/og-default.jpg";
const BASE_URL = "https://agastyahospitals.com";

/**
 * Reusable SEO component for per-page meta tags and structured data.
 *
 * @param {object} props
 * @param {string} props.title - Page title (appended with " | Agastya Hospitals")
 * @param {string} [props.description] - Meta description
 * @param {string} [props.canonical] - Canonical path (e.g. "/blog")
 * @param {string} [props.ogType] - Open Graph type (default: "website")
 * @param {string} [props.ogImage] - Open Graph image URL
 * @param {object|object[]} [props.jsonLd] - JSON-LD structured data object(s)
 * @param {string} [props.robots] - Robots meta content (default: "index, follow")
 * @param {React.ReactNode} [props.children] - Additional Helmet children
 */
const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  ogType = "website",
  ogImage = DEFAULT_OG_IMAGE,
  jsonLd,
  robots = "index, follow",
  children,
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Transforming Lives, Restoring Health`;
  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : undefined;

  // Support single or array of JSON-LD objects
  const jsonLdArray = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* JSON-LD Structured Data */}
      {jsonLdArray.map((ld, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(ld)}
        </script>
      ))}

      {children}
    </Helmet>
  );
};

export default SEO;

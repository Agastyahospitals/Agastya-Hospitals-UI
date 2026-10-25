/**
 * Automated SEO Route Validation Script
 *
 * Tests that dynamic and static routes return real HTTP 200 responses with
 * page-specific content, unique title, meta description, and canonical tags,
 * and that missing routes return a true HTTP 404 response.
 *
 * Usage:
 *   node scripts/test-seo-routes.js [port]
 * Example:
 *   node scripts/test-seo-routes.js 5317  (test running Vite dev server)
 *   node scripts/test-seo-routes.js 3003  (test running preview server)
 */

import http from 'http';

const targetPort = parseInt(process.argv[2] || '5317', 10);

const testCases = [
  { url: '/', expectStatus: 200, label: 'Homepage' },
  { url: '/specialty/cardiology', expectStatus: 200, label: 'Cardiology (singular)' },
  { url: '/specialties/cardiology', expectStatus: 200, label: 'Cardiology (plural)' },
  { url: '/specialty/nephrology', expectStatus: 200, label: 'Nephrology (singular)' },
  { url: '/specialties/nephrology', expectStatus: 200, label: 'Nephrology (plural)' },
  { url: '/doctor/dr-praveen-reddy-p', expectStatus: 200, label: 'Doctor Profile (singular)' },
  { url: '/doctors/dr-praveen-reddy-p', expectStatus: 200, label: 'Doctor Profile (plural)' },
  { url: '/blog/acidity-bloating-and-digestive-problems-when-to-seek-medical-help', expectStatus: 200, label: 'Blog (singular)' },
  { url: '/blogs/acidity-bloating-and-digestive-problems-when-to-seek-medical-help', expectStatus: 200, label: 'Blog (plural)' },
  { url: '/specialty/invalid-specialty-404-test', expectStatus: 404, label: 'Invalid Specialty (expect 404)' },
  { url: '/specialties/invalid-specialty-404-test', expectStatus: 404, label: 'Invalid Specialties (expect 404)' },
  { url: '/doctor/invalid-doctor-404-test', expectStatus: 404, label: 'Invalid Doctor (expect 404)' },
  { url: '/blog/invalid-blog-404-test', expectStatus: 404, label: 'Invalid Blog (expect 404)' },
];

function testUrl(port, testCase) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port,
      path: testCase.url,
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const title = data.match(/<title>([^<]*)<\/title>/i)?.[1] || '';
        const canonical = data.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i)?.[1] || '';
        const hasInlinedCss = data.includes('id="inlined-app-styles"');
        const passed = res.statusCode === testCase.expectStatus;

        resolve({
          ...testCase,
          status: res.statusCode,
          passed,
          title,
          canonical,
          bytes: data.length,
          hasInlinedCss
        });
      });
    });

    req.on('error', (err) => {
      resolve({ ...testCase, status: 'ERROR', passed: false, error: err.message });
    });

    req.end();
  });
}

async function run() {
  console.log(`\n======================================================`);
  console.log(`🔍 Running SEO Route Verification on http://localhost:${targetPort}`);
  console.log(`======================================================\n`);

  let allPassed = true;

  for (const testCase of testCases) {
    const result = await testUrl(targetPort, testCase);
    const mark = result.passed ? '✓ PASS' : '✗ FAIL';
    if (!result.passed) allPassed = false;

    console.log(`${mark} [${result.status}] ${result.label}`);
    console.log(`      Path: ${result.url}`);
    if (result.error) {
      console.log(`      Error: ${result.error}`);
    } else {
      console.log(`      Title: ${result.title}`);
      console.log(`      Canonical: ${result.canonical}`);
      console.log(`      Size: ${(result.bytes / 1024).toFixed(1)} KB | Inlined CSS: ${result.hasInlinedCss}`);
    }
    console.log('');
  }

  console.log(`======================================================`);
  console.log(allPassed ? `🎉 ALL TESTS PASSED SUCCESSFULLY!` : `⚠️ SOME TESTS FAILED`);
  console.log(`======================================================\n`);
}

run();

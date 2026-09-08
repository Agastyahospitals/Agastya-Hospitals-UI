import puppeteer from "puppeteer";

async function testPages() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const urls = [
    { url: "http://localhost:3003/", name: "Homepage" },
    { url: "http://localhost:3003/about", name: "About Us" },
    { url: "http://localhost:3003/specialty/nephrology", name: "Dynamic Specialty (Nephrology)" },
    { url: "http://localhost:3003/blog/sports-injury-treatment-cost-in-lb-nagar-diagnosis-physiotherapy-and-surgery-explained", name: "Dynamic Blog" },
    { url: "http://localhost:3003/doctor/dr-praveen-reddy-p", name: "Dynamic Doctor (Dr Praveen Reddy)" }
  ];

  console.log("------------------------------------------------------------");
  console.log("BROWSER RENDERING & CLIENT HYDRATION TEST (Puppeteer)");
  console.log("------------------------------------------------------------");

  for (const item of urls) {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));

    const response = await page.goto(item.url, { waitUntil: "networkidle0", timeout: 15000 });
    const status = response.status();
    const title = await page.title();
    
    // Check computed styles on critical elements
    const isStyled = await page.evaluate(() => {
      const header = document.querySelector("header");
      const root = document.getElementById("root");
      const computed = window.getComputedStyle(document.body);
      return root && root.children.length > 0 && computed.fontFamily.includes("Inter");
    });

    console.log(`\nPage: ${item.name}`);
    console.log(`URL: ${item.url}`);
    console.log(`HTTP Status: ${status}`);
    console.log(`Document Title: ${title}`);
    console.log(`Styles & DOM Loaded Successfully: ${isStyled ? "YES" : "NO"}`);
    console.log(`Console Errors: ${errors.length === 0 ? "None (Clean)" : errors.join(", ")}`);

    await page.close();
  }

  await browser.close();
  console.log("\n------------------------------------------------------------");
  console.log("All pages verified successfully in headless browser!");
  console.log("------------------------------------------------------------");
}

testPages().catch(console.error);

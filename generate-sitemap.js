// generate-sitemap.js
const fs = require("fs");
const path = require("path");
const { SitemapStream, streamToPromise } = require("sitemap");

const hostname = "https://yash.avenirya.com"; // <-- change to your domain

// Your static routes from App.js (excluding dynamic :id ones)
const routes = [
  "/",
  "/membership",
  "/agentlogin",
  "/admin",
  "/admin/dashboard",
  "/register-restaurant",
  "/restaurant-details",
  "/login",
  "/mymenu",
  "/proedit",
  "/register",
  "/contact",
  "/agency",
  "/agency-register",
  "/agency-login",
  "/agency-dashboard",
  "/dashboard",
  "/bulk-upload",
  "/features",
];

// Dynamic routes with parameters (optional, add sample slugs/IDs for SEO)
const dynamicRoutes = [
  "/menu/68951632dce5299231f16e7d",
  "/cloudkitchen/68951632dce5299231f16e7d",
  "/menuwp/68951632dce5299231f16e7d",
  "/shop/68951632dce5299231f16e7d",
  "/restaurant/68951632dce5299231f16e7d"
];

// Final routes list
const allRoutes = [...routes, ...dynamicRoutes];

(async () => {
  const sitemap = new SitemapStream({ hostname });

  allRoutes.forEach((url) => {
    sitemap.write({ url, changefreq: "monthly", priority: 0.7 });
  });

  sitemap.end();

  const xml = await streamToPromise(sitemap).then((sm) => sm.toString());

  fs.writeFileSync(path.join(__dirname, "public", "sitemap.xml"), xml);

  console.log("✅ Sitemap generated at /public/sitemap.xml");
})();

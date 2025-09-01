const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');

const sitemap = new SitemapStream({ hostname: 'https://yash.avenirya.com' });

// Add your routes manually
[
  '/',
  '/membership',
  '/contact',
  '/about'
].forEach(url => sitemap.write({ url, changefreq: 'monthly', priority: 0.8 }));

sitemap.end();

streamToPromise(sitemap).then(data => {
  createWriteStream('./public/sitemap.xml').write(data.toString());
  console.log('✅ Sitemap generated at /public/sitemap.xml');
});

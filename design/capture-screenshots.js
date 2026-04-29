// Capture full-page screenshots of every published page (desktop + mobile).
// Output: design/screenshots/<page>-<viewport>.png
//
// Usage:
//   npm install playwright   (one-time, if not already present)
//   npx playwright install chromium   (one-time)
//   node design/capture-screenshots.js
//
// Override target host: BASE=http://localhost:3000 node design/capture-screenshots.js

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.env.BASE || 'https://rowbyroh.com';
const OUT = path.join(__dirname, 'screenshots', 'v2');

const PAGES = [
  ['homepage', '/'],
  ['archive', '/archive'],
  ['obsidian-mcp', '/obsidian-mcp'],
  ['agentic-stack', '/agentic-stack'],
  ['portfolio-analysis', '/portfolio-analysis'],
  ['deadweight', '/deadweight'],
  ['chair-roundtable', '/chair-roundtable'],
  ['about', '/about'],
  ['blog-vault-vs-memory', '/blog/vault-vs-memory'],
  ['blog-ai-pricing-market-maker', '/blog/ai-pricing-market-maker'],
  ['blog-reverse-engineering-claude-api', '/blog/reverse-engineering-claude-api'],
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    for (const [name, urlPath] of PAGES) {
      const url = BASE + urlPath;
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(800);
        await page.screenshot({
          path: path.join(OUT, `${name}-${vp.name}.png`),
          fullPage: true,
        });
        console.log(`OK  ${vp.name}  ${name}`);
      } catch (e) {
        console.log(`ERR ${vp.name}  ${name}: ${e.message}`);
      }
    }
    await ctx.close();
  }
  await browser.close();
})();

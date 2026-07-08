// Gate B — visual regression. Full-page screenshots per page, desktop + mobile,
// diffed against committed baselines. Dynamic pages (home, archive) are
// JS-rendered from content.json but use fixed dates, so they are deterministic;
// we wait for the rendered signal before snapshotting.
import { test, expect } from '@playwright/test';

const PAGES = [
    { name: 'home', url: '/', ready: '#logbook-section .logbook-entry' },
    { name: 'about', url: '/about', ready: 'footer' },
    { name: 'archive', url: '/archive', ready: '#archive-list .archive-item' },
    { name: 'colophon', url: '/colophon', ready: '.closing-strip' },
    { name: 'research', url: '/research', ready: '#research-list .archive-item' },
    { name: 'fn-conversation-sync', url: '/field-notes/conversation-sync', ready: '#keep-reading .kr-all' },
    { name: 'fn-headless-parity', url: '/field-notes/headless-parity', ready: '#keep-reading .kr-all' },
    { name: 'fn-batch-approval', url: '/field-notes/batch-approval', ready: '#keep-reading .kr-all' },
    { name: 'fn-memory', url: '/field-notes/memory-and-the-live-channel', ready: '#keep-reading .kr-all' },
    { name: 'essay-an-earned-null', url: '/blog/an-earned-null', ready: '#keep-reading .kr-all' },
    { name: 'essay-cost-of-verification', url: '/blog/cost-of-verification', ready: '#keep-reading .kr-all' },
    { name: 'rt-ergonomic-intent', url: '/chair-roundtable/ergonomic-intent', ready: '#keep-reading .kr-all' },
    { name: 'rt-material-values', url: '/chair-roundtable/material-values', ready: '#keep-reading .kr-all' },
    { name: 'rt-build-process', url: '/chair-roundtable/build-process', ready: '#keep-reading .kr-all' },
];

for (const p of PAGES) {
    test(`visual: ${p.name}`, async ({ page }) => {
        await page.goto(p.url, { waitUntil: 'networkidle' });
        await page.locator(p.ready).first().waitFor({ state: 'visible', timeout: 10000 });
        // Settle fonts so glyph metrics are stable across runs.
        await page.evaluate(() => document.fonts && document.fonts.ready);
        await expect(page).toHaveScreenshot(`${p.name}.png`, { fullPage: true });
    });
}

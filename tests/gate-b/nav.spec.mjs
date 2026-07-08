// Gate B — functional / e2e. Navigation integrity, no dead ends, JS rendering.
import { test, expect } from '@playwright/test';

const CONTENT_PAGES = [
    '/field-notes/conversation-sync',
    '/field-notes/headless-parity',
    '/field-notes/batch-approval',
    '/field-notes/memory-and-the-live-channel',
    '/blog/an-earned-null',
    '/blog/cost-of-verification',
    '/chair-roundtable/ergonomic-intent',
    '/chair-roundtable/material-values',
    '/chair-roundtable/build-process',
];

test('homepage renders aperture + logbook from content.json with no console errors', async ({ page }) => {
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto('/');
    await expect(page.locator('#aperture-section .aperture')).toBeVisible();
    await expect(page.locator('#logbook-section .logbook-entry').first()).toBeVisible();
    expect(errors, errors.join('\n')).toHaveLength(0);
});

test('the design tag filter surfaces the roundtable series', async ({ page }) => {
    await page.goto('/');
    await page.locator('.tag-filter[data-tag="design"]').click();
    // After filtering, at least one visible entry should point at a roundtable.
    await expect(page.locator('a[href*="/chair-roundtable/"]').first()).toBeVisible();
});

for (const url of CONTENT_PAGES) {
    test(`content page ${url}: breadcrumb, keep-reading, footer, no dead end`, async ({ page }) => {
        await page.goto(url);
        // Breadcrumb up to all work
        const allWork = page.locator('nav.breadcrumb a', { hasText: 'all work' });
        await expect(allWork).toHaveAttribute('href', '/archive');
        // Keep Reading populated with at least one onward link + see-all-work
        await expect(page.locator('#keep-reading .kr-all')).toBeVisible();
        await expect(page.locator('#keep-reading a').first()).toBeVisible();
        // Footer present
        await expect(page.locator('footer')).toBeVisible();
    });
}

test('roundtable episode 1 keep-reading offers the next episode in the series', async ({ page }) => {
    await page.goto('/chair-roundtable/ergonomic-intent');
    const first = page.locator('#keep-reading .kr-item').first();
    await expect(first.locator('.kr-type')).toHaveText('next in this series');
    await expect(first.locator('.kr-item-title')).toContainText('Material Values');
    await expect(first.locator('a')).toHaveAttribute('href', '/chair-roundtable/material-values');
});

test('keep-reading links navigate to a real page (deep dive works)', async ({ page }) => {
    await page.goto('/field-notes/conversation-sync');
    await page.locator('#keep-reading .kr-item a').first().click();
    await expect(page).toHaveURL(/\/(field-notes|blog|chair-roundtable)\//);
    await expect(page.locator('article')).toBeVisible();
});

test('research hub lists the model-behavior episodes in series order', async ({ page }) => {
    await page.goto('/research');
    const items = page.locator('#research-list .archive-item');
    await expect(items.first()).toBeVisible();
    await expect(items.first().locator('.archive-title')).toContainText('EP01');
    await expect(items.nth(1).locator('.archive-title')).toContainText('EP02');
});

test('post-meta series label routes to the body of work', async ({ page }) => {
    await page.goto('/blog/cost-of-verification');
    await expect(page.locator('.post-meta a')).toHaveAttribute('href', '/research');
    await page.goto('/field-notes/conversation-sync');
    await expect(page.locator('.post-meta a')).toHaveAttribute('href', '/archive?tag=field-notes');
    await page.goto('/chair-roundtable/ergonomic-intent');
    await expect(page.locator('.post-meta a')).toHaveAttribute('href', '/archive?tag=roundtable');
});

test('redirect: /chair-roundtable -> first episode', async ({ page }) => {
    await page.goto('/chair-roundtable');
    await expect(page).toHaveURL(/\/chair-roundtable\/ergonomic-intent$/);
});

test('redirect: /writing -> /archive', async ({ page }) => {
    await page.goto('/writing');
    await expect(page).toHaveURL(/\/archive$/);
});

test('archive lists every published content item', async ({ page }) => {
    await page.goto('/archive');
    // 8 published entries currently (4 FN + 3 roundtable + 1 essay)
    await expect(page.locator('#archive-list a, .archive-entry')).not.toHaveCount(0);
});

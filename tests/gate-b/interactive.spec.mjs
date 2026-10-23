// Gate B — the interactive pieces: homepage tag filters, archive filters and
// ?tag=, research ?drafts, Keep Reading when the data fails, the colophon
// version toggle, the EP01 play buttons, and the /lab scratch-paper viewer.
// Runs against tests/gate-b/server.mjs (Vercel routing), desktop + mobile.
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const CONTENT = JSON.parse(readFileSync(new URL('../../assets/data/content.json', import.meta.url), 'utf8'));
const PUBLISHED = CONTENT.filter((e) => e.published);
const byFeature = (tag) => PUBLISHED.find((e) => (e.featured_for || []).includes(tag));

function collectErrors(page) {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    return errors;
}

// ---- Homepage -----------------------------------------------------------

test('home: default feature on top, the 7 newest other items below, featured item not repeated', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.aperture-title')).toHaveText(byFeature('default').title);
    const entries = page.locator('#logbook-section .logbook-entry');
    await expect(entries).toHaveCount(Math.min(7, PUBLISHED.length - 1));
    const hrefs = await entries.evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    expect(hrefs).not.toContain(byFeature('default').url);
    const expected = PUBLISHED.filter((e) => e !== byFeature('default'))
        .sort((a, b) => b.events[0].date.localeCompare(a.events[0].date) || b.title.localeCompare(a.title))
        .slice(0, 7).map((e) => e.url);
    expect(hrefs).toEqual(expected);
    await expect(page.locator('.logbook-label')).toHaveText('recent');
    await expect(page.locator('.logbook-links a').first()).toHaveAttribute('href', '/archive');
    await expect(page.locator('.logbook-links a').nth(1)).toHaveAttribute('href', '/research');
});

test('home: a tag filter swaps the feature, narrows the logbook, and points see-all at that tag; a second tap clears it', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.aperture-title')).toBeVisible();
    const btn = page.locator('.tag-filter[data-tag="infrastructure"]');
    await btn.click();
    await expect(btn).toHaveClass(/active/);
    await expect(page.locator('.aperture-title')).toHaveText(byFeature('infrastructure').title);
    await expect(page.locator('.logbook-label')).toHaveText('recent in infrastructure');
    const hrefs = await page.locator('.logbook-entry').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    const tagged = PUBLISHED.filter((e) => e.tags.includes('infrastructure') && e !== byFeature('infrastructure')).map((e) => e.url);
    expect(hrefs.sort()).toEqual(tagged.sort());
    await expect(page.locator('.logbook-links a').first()).toHaveAttribute('href', '/archive?tag=infrastructure');

    await btn.click();
    await expect(btn).not.toHaveClass(/active/);
    await expect(page.locator('.aperture-title')).toHaveText(byFeature('default').title);
    await expect(page.locator('.logbook-label')).toHaveText('recent');
});

test('home: a tag with no featured item keeps the default feature', async ({ page }) => {
    await page.goto('/');
    await page.locator('.tag-filter[data-tag="design"]').click();
    await expect(page.locator('.logbook-label')).toHaveText('recent in design');
    await expect(page.locator('.aperture-title')).toHaveText(byFeature('default').title);
});

// ---- Archive ------------------------------------------------------------

test('archive: every published item, newest first; drafts never listed', async ({ page }) => {
    await page.goto('/archive');
    const items = page.locator('#archive-list .archive-item');
    await expect(items).toHaveCount(PUBLISHED.length);
    const hrefs = await items.evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    const expected = [...PUBLISHED]
        .sort((a, b) => b.events[0].date.localeCompare(a.events[0].date) || b.title.localeCompare(a.title))
        .map((e) => e.url);
    expect(hrefs).toEqual(expected);
    for (const d of CONTENT.filter((e) => !e.published)) expect(hrefs).not.toContain(d.url);
});

test('archive: ?tag= filters on load and names the tag; tapping filters updates the address', async ({ page }) => {
    await page.goto('/archive?tag=roundtable');
    await expect(page.locator('#archive-title')).toHaveText('All roundtable Work');
    await expect(page.locator('#archive-filters button.active')).toHaveText('roundtable');
    const shown = page.locator('#archive-list .archive-item:not(.filtered-out)');
    await expect(shown).toHaveCount(PUBLISHED.filter((e) => e.tags.includes('roundtable')).length);

    await page.locator('#archive-filters button', { hasText: /^roundtable$/ }).click();
    await expect(page.locator('#archive-title')).toHaveText('All Work');
    await expect(page.locator('#archive-list .filtered-out')).toHaveCount(0);
    expect(new URL(page.url()).search).toBe('');

    await page.locator('#archive-filters button', { hasText: /^field-notes$/ }).click();
    expect(new URL(page.url()).search).toBe('?tag=field-notes');
    await expect(page.locator('#archive-title')).toHaveText('All field-notes Work');
});

// ---- Research hub -------------------------------------------------------

test('research: each track lists its series oldest first; a draft shows only with ?drafts', async ({ page }) => {
    const draft = {
        id: 'test-draft', title: 'Model Behavior EP99 — Test Draft', type: 'essay', series: 'model-behavior',
        description: 'fixture', date: 'Dec 2026', tags: ['essay'], url: '/blog/test-draft',
        published: false, status: 'draft', events: [{ date: '2026-12-01', action: 'drafted' }],
    };
    await page.route('**/assets/data/content.json', (r) => r.fulfill({ json: [...CONTENT, draft] }));

    await page.goto('/research');
    const er = page.locator('[data-series="emotional-resonance"] .archive-title');
    await expect(er).toHaveText(PUBLISHED.filter((e) => e.series === 'emotional-resonance').map((e) => e.title).sort());
    await expect(page.locator('[data-series="model-behavior"] .archive-item')).toHaveCount(
        PUBLISHED.filter((e) => e.series === 'model-behavior').length);
    await expect(page.locator('a[href="/blog/test-draft"]')).toHaveCount(0);

    await page.goto('/research?drafts');
    const last = page.locator('[data-series="model-behavior"] .archive-item').last();
    await expect(last).toHaveAttribute('href', '/blog/test-draft');
    await expect(last.locator('.archive-date')).toHaveText('draft');
});

// ---- Keep Reading when the data can't load ------------------------------

test('keep reading: if content.json fails, the page still ends in See all work', async ({ page }) => {
    await page.route('**/assets/data/content.json', (r) => r.abort());
    await page.goto('/blog/an-earned-null');
    await expect(page.locator('#keep-reading .kr-all')).toHaveAttribute('href', '/archive');
    await expect(page.locator('#keep-reading .kr-item')).toHaveCount(0);
});

// ---- Colophon version toggle --------------------------------------------

test('colophon: the version toggle swaps every screenshot and the caption, and the images load', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/colophon');
    const loaded = () => page.locator('.hero-shot img, .page-grid img').evaluateAll((imgs) =>
        Promise.all(imgs.map((i) => (i.complete ? i : new Promise((r) => { i.onload = i.onerror = r; }))))
            .then(() => imgs.map((i) => [i.getAttribute('src'), i.naturalWidth])));

    await page.locator('.ver-btn[data-version="v1"]').click();
    await expect(page.locator('.ver-btn[data-version="v1"]')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('.ver-btn[data-version="v2"]')).toHaveAttribute('aria-selected', 'false');
    await expect(page.locator('#verCaption')).toContainText('Mar 2026');
    for (const [src, w] of await loaded()) {
        expect(src).toContain('/design/screenshots/v1/');
        expect(w, `${src} failed to load`).toBeGreaterThan(0);
    }

    await page.locator('.ver-btn[data-version="v2"]').click();
    await expect(page.locator('#verCaption')).toContainText('Apr 2026');
    for (const [src, w] of await loaded()) {
        expect(src).toContain('/design/screenshots/v2/');
        expect(w, `${src} failed to load`).toBeGreaterThan(0);
    }
    expect(errors, errors.join('\n')).toHaveLength(0);
});

// ---- EP01 play buttons (listen.js) --------------------------------------

test('hearing test: one clip plays at a time; pressing the playing clip stops it', async ({ page }) => {
    await page.goto('/blog/hearing-test');
    const buttons = page.locator('button.play[data-src]');
    await expect(buttons).toHaveCount(4);
    const [a, b] = [buttons.nth(0), buttons.nth(1)];
    await expect(a).toHaveAttribute('aria-pressed', 'false');

    await a.click();
    await expect(a).toHaveAttribute('aria-pressed', 'true');
    await b.click();
    await expect(a).toHaveAttribute('aria-pressed', 'false');
    await expect(b).toHaveAttribute('aria-pressed', 'true');
    await b.click();
    await expect(b).toHaveAttribute('aria-pressed', 'false');
});

test('hearing test: a clip that plays to the end releases its button', async ({ page }) => {
    await page.goto('/blog/hearing-test');
    const a = page.locator('button.play[data-src]').first();
    await a.click();
    await expect(a).toHaveAttribute('aria-pressed', 'true');
    await expect(a).toHaveAttribute('aria-pressed', 'false', { timeout: 15000 });
});

// ---- /lab scratch-paper viewer ------------------------------------------

test('scratch paper: loads clean, every layer shows a verdict that follows its thresholds', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/lab/scratch-paper');
    await expect(page.locator('#test')).toHaveValue('Roughness');
    const tests = await page.locator('#test option').allTextContents();
    expect(tests.length).toBeGreaterThan(1);

    for (const t of tests) {
        await page.locator('#test').selectOption(t);
        for (const m of await page.locator('#model option').allTextContents()) {
            await page.locator('#model').selectOption(m);
            const cur = await page.evaluate(([t, m]) => {
                // DATA is the page's embedded export from sound-lab.
                const d = DATA.find((x) => x.test === t && x.model === m); // eslint-disable-line no-undef
                return { lo: d.lo, hi: d.hi, layers: d.layers.map((l) => ({ name: l.name, acc: l.acc })) };
            }, [t, m]);
            await expect(page.locator('#layer')).toHaveAttribute('max', String(cur.layers.length - 1));
            for (const n of [0, Math.floor(cur.layers.length / 2), cur.layers.length - 1]) {
                await page.locator('#layer').fill(String(n));
                const L = cur.layers[n];
                const word = L.acc < cur.lo ? 'fail' : L.acc <= cur.hi ? 'usable with more clips' : 'pass';
                await expect(page.locator('#lname')).toHaveText(L.name);
                await expect(page.locator('#verdict')).toHaveText(word);
                await expect(page.locator('#acc')).toHaveText(`${Math.round(L.acc * 1000) / 10}% right on unseen keys`);
            }
        }
    }
    expect(errors, errors.join('\n')).toHaveLength(0);
});

test('scratch paper: Play through layers starts and stops; the walk-through switches clips', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/lab/scratch-paper');
    const play = page.locator('#play');
    await play.click();
    await expect(play).toHaveText('Stop');
    await play.click();
    await expect(play).toHaveText('Play through layers');

    const clips = page.locator('#wtoggle button');
    await expect(clips.nth(1)).toHaveAttribute('aria-pressed', 'true');
    await clips.nth(0).click();
    await expect(page.locator('#wtoggle button').nth(0)).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#wlayer').fill('3');
    await expect(page.locator('#wlname')).toHaveText('layer 4');
    expect(errors, errors.join('\n')).toHaveLength(0);
});

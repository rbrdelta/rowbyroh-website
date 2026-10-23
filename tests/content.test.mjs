// Unit/schema tests for assets/data/content.json — the site's data model.
// Run: node --test tests/content.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const content = JSON.parse(readFileSync(join(ROOT, 'assets/data/content.json'), 'utf8'));

const KNOWN_TYPES = new Set(['field-note', 'roundtable', 'essay', 'project', 'analysis']);

test('content.json is a non-empty array', () => {
    assert.ok(Array.isArray(content));
    assert.ok(content.length > 0);
});

test('every entry has the required fields', () => {
    for (const e of content) {
        for (const f of ['id', 'title', 'type', 'description', 'date', 'tags', 'url', 'published', 'status']) {
            assert.ok(e[f] !== undefined, `entry ${e.id || e.url} missing "${f}"`);
        }
        assert.ok(Array.isArray(e.tags) && e.tags.length > 0, `${e.id} has no tags`);
        assert.ok(KNOWN_TYPES.has(e.type), `${e.id} has unknown type "${e.type}"`);
        assert.match(e.url, /^\//, `${e.id} url must be absolute path`);
    }
});

test('ids and urls are unique', () => {
    const ids = content.map(e => e.id);
    const urls = content.map(e => e.url);
    assert.equal(new Set(ids).size, ids.length, 'duplicate id');
    assert.equal(new Set(urls).size, urls.length, 'duplicate url');
});

test('every published entry has a parseable event date', () => {
    for (const e of content.filter(e => e.published)) {
        assert.ok(e.events && e.events.length > 0, `${e.id} published but has no events`);
        const last = e.events[e.events.length - 1].date;
        assert.ok(!Number.isNaN(Date.parse(last)), `${e.id} event date "${last}" unparseable`);
    }
});

test('the AI-pricing essay is registered as a draft (tracked, not surfaced)', () => {
    // It is intentionally NOT published — parked for Daniel's own rewrite.
    // Registered (so it is tracked, not a silent orphan) but published:false so
    // it never surfaces in stream/archive/keep-reading.
    const essay = content.find(e => e.url === '/blog/ai-pricing-market-maker');
    assert.ok(essay, 'ai-pricing essay must be registered in content.json');
    assert.equal(essay.type, 'essay');
    assert.equal(essay.published, false, 'essay must stay unpublished until Daniel finishes it');
});

test('the roundtable series has three published episodes', () => {
    const rts = content.filter(e => e.type === 'roundtable' && e.published);
    assert.equal(rts.length, 3);
});

test('highlights, when present, are a non-empty string array', () => {
    for (const e of content) {
        if (e.highlights !== undefined) {
            assert.ok(Array.isArray(e.highlights) && e.highlights.length > 0, `${e.id} bad highlights`);
            for (const h of e.highlights) assert.equal(typeof h, 'string');
        }
    }
});

// Series slot rules (design/IA-SCHEMA.md 2.1): the tab title is the content.json
// title + " | rowbyroh", and the post-meta series label links to its body of work.
const SERIES_ROUTE = {
    'model-behavior': '/research',
    'emotional-resonance': '/research',
    'field-notes': '/archive?tag=field-notes',
    'chair-roundtable': '/archive?tag=roundtable',
};
const pageFile = (url) => join(ROOT, url.slice(1) + '.html');

test('every series member: tab title matches content.json, post-meta links to its body of work', () => {
    for (const e of content.filter(e => e.published && e.series)) {
        assert.ok(SERIES_ROUTE[e.series], `${e.id}: series "${e.series}" has no body-of-work route`);
        const html = readFileSync(pageFile(e.url), 'utf8');
        assert.equal(html.match(/<title>([^<]+)<\/title>/)[1], `${e.title} | rowbyroh`, `${e.id} tab title`);
        const meta = html.match(/class="post-meta"><a href="([^"]+)">([^<]+)<\/a>/);
        assert.ok(meta, `${e.id} has no series label in post-meta`);
        assert.equal(meta[1], SERIES_ROUTE[e.series], `${e.id} post-meta link`);
        assert.ok(e.title.startsWith(meta[2] + ' — '), `${e.id}: post-meta "${meta[2]}" does not lead the title`);
    }
});

test('exactly one published entry is the default homepage feature', () => {
    const defaults = content.filter(e => e.published && (e.featured_for || []).includes('default'));
    assert.equal(defaults.length, 1, defaults.map(e => e.id).join(', '));
});

test('every homepage tag filter matches at least one published entry', () => {
    const home = readFileSync(join(ROOT, 'index.html'), 'utf8');
    const tags = [...home.matchAll(/class="tag-filter" data-tag="([^"]+)"/g)].map(m => m[1]);
    assert.ok(tags.length > 0);
    for (const t of tags) {
        assert.ok(content.some(e => e.published && e.tags.includes(t)), `filter "${t}" would show nothing`);
    }
});

test('an unpublished entry has no page at a live path (it lives under drafts/)', () => {
    for (const e of content.filter(e => !e.published)) {
        assert.ok(!existsSync(pageFile(e.url)), `${e.url} is unpublished but ${e.url}.html would be served`);
    }
});

// Unit/schema tests for assets/data/content.json — the site's data model.
// Run: node --test tests/content.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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

test('the AI-pricing essay is registered (regression: was orphaned)', () => {
    const essay = content.find(e => e.url === '/blog/ai-pricing-market-maker');
    assert.ok(essay, 'ai-pricing essay must be in content.json so it is discoverable');
    assert.equal(essay.type, 'essay');
    assert.equal(essay.published, true);
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

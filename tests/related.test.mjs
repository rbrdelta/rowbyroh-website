// Unit tests for the Keep Reading ranking logic (assets/js/related.js).
// Run: node --test tests/related.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const R = require('../assets/js/related.js');

const FIXTURE = [
    { id: 'rt1', title: 'RT One', type: 'roundtable', url: '/chair-roundtable/ergonomic-intent',
      tags: ['roundtable', 'design'], published: true, events: [{ date: '2026-05-15', action: 'published' }] },
    { id: 'rt2', title: 'RT Two', type: 'roundtable', url: '/chair-roundtable/material-values',
      tags: ['roundtable', 'design'], published: true, events: [{ date: '2026-05-20', action: 'published' }] },
    { id: 'rt3', title: 'RT Three', type: 'roundtable', url: '/chair-roundtable/build-process',
      tags: ['roundtable', 'design'], published: true, events: [{ date: '2026-05-25', action: 'published' }] },
    { id: 'fn1', title: 'FN One', type: 'field-note', url: '/field-notes/conversation-sync',
      tags: ['field-notes', 'infrastructure'], published: true, events: [{ date: '2026-04-23', action: 'published' }] },
    { id: 'fn2', title: 'FN Two', type: 'field-note', url: '/field-notes/headless-parity',
      tags: ['field-notes', 'AI'], published: true, events: [{ date: '2026-04-24', action: 'published' }] },
    { id: 'es1', title: 'Essay One', type: 'essay', url: '/blog/ai-pricing-market-maker',
      tags: ['essay', 'AI'], published: true, events: [{ date: '2026-03-27', action: 'published' }] },
    { id: 'draft1', title: 'Draft', type: 'essay', url: '/blog/secret', tags: ['essay'], published: false },
];

test('zoneClass maps types to the design-system zones', () => {
    assert.equal(R.zoneClass('field-note'), 'zone-writing');
    assert.equal(R.zoneClass('roundtable'), 'zone-writing');
    assert.equal(R.zoneClass('essay'), 'zone-writing');
    assert.equal(R.zoneClass('project'), 'zone-portfolio');
    assert.equal(R.zoneClass('unknown'), 'zone-mono');
});

test('roundtable surfaces the next episode in the series first', () => {
    const picks = R.pickRelated(FIXTURE, '/chair-roundtable/ergonomic-intent', 3);
    assert.equal(picks[0].url, '/chair-roundtable/material-values');
    assert.equal(picks[0]._label, 'next in this series');
});

test('last episode in a series does not invent a next pick', () => {
    const picks = R.pickRelated(FIXTURE, '/chair-roundtable/build-process', 3);
    assert.ok(!picks.some(p => p._label === 'next in this series'));
    assert.ok(picks.length > 0, 'still offers related/recent picks (no dead end)');
});

test('field note prefers shared specific tag (AI) over the broad type tag', () => {
    const picks = R.pickRelated(FIXTURE, '/field-notes/headless-parity', 3);
    // fn2 tags: field-notes, AI -> should pull the AI essay / AI field notes, not just any
    assert.ok(picks.some(p => p.url === '/blog/ai-pricing-market-maker'),
        'AI essay should be surfaced via shared AI tag');
});

test('never returns the current page among picks', () => {
    const url = '/field-notes/conversation-sync';
    const picks = R.pickRelated(FIXTURE, url, 5);
    assert.ok(!picks.some(p => p.url === url));
});

test('excludes unpublished/draft entries', () => {
    const picks = R.pickRelated(FIXTURE, '/blog/ai-pricing-market-maker', 10);
    assert.ok(!picks.some(p => p.url === '/blog/secret'));
});

test('respects the limit and de-duplicates', () => {
    const picks = R.pickRelated(FIXTURE, '/chair-roundtable/ergonomic-intent', 3);
    assert.equal(picks.length, 3);
    const urls = picks.map(p => p.url);
    assert.equal(new Set(urls).size, urls.length, 'no duplicate urls');
});

test('every content page gets at least one onward pick (no dead ends)', () => {
    for (const item of FIXTURE.filter(i => i.published !== false)) {
        const picks = R.pickRelated(FIXTURE, item.url, 3);
        assert.ok(picks.length >= 1, `${item.url} produced no onward link`);
    }
});

test('buildHtml always emits a See-all-work path, even with zero picks', () => {
    assert.match(R.buildHtml([]), /kr-all[^>]*href="\/archive"/);
    const html = R.buildHtml(R.pickRelated(FIXTURE, '/field-notes/conversation-sync', 3));
    assert.match(html, /keep reading/);
    assert.match(html, /kr-all/);
});

test('buildHtml escapes interpolated content', () => {
    const html = R.buildHtml([{ url: '/x', type: 'essay', title: '<script>x</script>', description: 'a & b' }]);
    assert.ok(!html.includes('<script>x</script>'));
    assert.match(html, /&amp; b/);
});

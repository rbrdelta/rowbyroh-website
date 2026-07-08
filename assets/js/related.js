// related.js — "Keep reading" module for content pages.
// Renders into #keep-reading from content.json. Promotes deep dives and
// guarantees no dead end: next-in-series first (roundtables), then related
// by shared tag, then most recent — always ending with a path to /archive.
// Replaces the type-limited #post-nav prev/next (writing.js) on content pages.
//
// The ranking logic (pickRelated) is a pure function, exported for unit tests
// (tests/related.test.mjs) and also used by the browser renderer below.

(function (root, factory) {
    var api = factory();
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api; // Node (unit tests)
    } else {
        root.RelatedModule = api; // browser global
        api.render();             // auto-run on content pages
    }
})(typeof self !== 'undefined' ? self : this, function () {

    // Mirror stream.js zone mapping so the module reads as native chrome.
    // Zone follows the body of work: the model-behavior series carries the
    // research zone, roundtables their own; types map for everything else.
    function zoneClass(item) {
        if (item && item.series === 'model-behavior') return 'zone-research';
        switch (item && item.type) {
            case 'project':
            case 'analysis':
                return 'zone-portfolio';
            case 'roundtable':
                return 'zone-roundtable';
            case 'essay':
            case 'field-note':
                return 'zone-writing';
            default:
                return 'zone-mono';
        }
    }

    function typeLabel(type) {
        var labels = {
            'field-note': 'field note',
            'roundtable': 'roundtable',
            'essay': 'essay',
            'project': 'project',
            'analysis': 'analysis'
        };
        return labels[type] || type;
    }

    // Most recent published event date; fall back to display date.
    function itemTime(item) {
        if (item.events && item.events.length) {
            var t = Date.parse(item.events[item.events.length - 1].date);
            if (!isNaN(t)) return t;
        }
        var t2 = Date.parse(item.date);
        return isNaN(t2) ? 0 : t2;
    }

    function normUrl(u) {
        return (u || '').replace(/\/$/, '');
    }

    // Pure: given all content entries + the current page url, return up to
    // `limit` ranked suggestions. Each pick may carry a `_label` override.
    function pickRelated(all, currentUrl, limit) {
        limit = limit || 3;
        var live = all.filter(function (i) {
            return i.published !== false && i.status !== 'draft';
        });
        var here = normUrl(currentUrl);
        var current = null;
        live.forEach(function (i) { if (normUrl(i.url) === here) current = i; });

        var others = live.filter(function (i) { return i !== current; });
        var picks = [];
        var seen = {};

        function add(item, label) {
            if (!item || seen[item.url]) return;
            seen[item.url] = 1;
            var copy = {};
            for (var k in item) { if (item.hasOwnProperty(k)) copy[k] = item[k]; }
            if (label) copy._label = label;
            picks.push(copy);
        }

        // 1. Next in the same series (series field, with roundtables as a legacy series), ordered by date.
        function seriesOf(i) {
            return i.series || (i.type === 'roundtable' ? 'roundtable' : null);
        }
        if (current && seriesOf(current)) {
            var series = live
                .filter(function (i) { return seriesOf(i) === seriesOf(current); })
                .sort(function (a, b) { return itemTime(a) - itemTime(b); });
            var idx = -1;
            series.forEach(function (i, n) { if (i === current) idx = n; });
            if (idx > -1 && idx < series.length - 1) {
                add(series[idx + 1], 'next in this series');
            }
        }

        // 2. Related by a shared specific tag (ignore broad type tags).
        var broad = { 'field-notes': 1, 'roundtable': 1, 'essay': 1 };
        if (current) {
            var mine = (current.tags || []).filter(function (t) { return !broad[t]; });
            others
                .filter(function (i) {
                    return (i.tags || []).some(function (t) { return mine.indexOf(t) > -1; });
                })
                .sort(function (a, b) { return itemTime(b) - itemTime(a); })
                .forEach(function (i) { add(i); });
        }

        // 3. Fill remaining slots with the most recent other content.
        others
            .slice()
            .sort(function (a, b) { return itemTime(b) - itemTime(a); })
            .forEach(function (i) { add(i); });

        return picks.slice(0, limit);
    }

    function esc(s) {
        if (s == null) return '';
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // Pure: build the inner HTML for the module given ranked picks.
    function buildHtml(picks) {
        var allLink = '<a class="kr-all" href="/archive">See all work &rarr;</a>';
        if (!picks.length) return allLink;
        var html = '<h2 class="kr-title">keep reading</h2><ul class="kr-list">';
        picks.forEach(function (i) {
            var z = zoneClass(i);
            // Functional labels ("next in this series") always show; the type
            // label only when the title doesn't already name its series.
            var label = i._label || (i.series ? '' : typeLabel(i.type));
            html +=
                '<li class="kr-item ' + z + '">' +
                    '<a href="' + esc(i.url) + '">' +
                        (label ? '<span class="kr-type ' + z + '">' + esc(label) + '</span>' : '') +
                        '<span class="kr-item-title">' + esc(i.title) + '</span>' +
                        '<span class="kr-desc">' + esc(i.description || '') + '</span>' +
                    '</a>' +
                '</li>';
        });
        return html + '</ul>' + allLink;
    }

    // Browser entry point.
    function render() {
        if (typeof document === 'undefined') return;
        var mount = document.getElementById('keep-reading');
        if (!mount) return;
        fetch('/assets/data/content.json')
            .then(function (res) { return res.json(); })
            .then(function (all) {
                mount.innerHTML = buildHtml(pickRelated(all, window.location.pathname, 3));
            })
            .catch(function () {
                mount.innerHTML = '<a class="kr-all" href="/archive">See all work &rarr;</a>';
            });
    }

    return {
        zoneClass: zoneClass,
        typeLabel: typeLabel,
        itemTime: itemTime,
        pickRelated: pickRelated,
        buildHtml: buildHtml,
        render: render
    };
});

// research.js — /research hub (one list per track, keyed by data-series)
// Renders each track's episode list from content.json in series order (oldest first —
// a series reads forward). Single source of truth: an episode registered with
// a series appears under its track automatically. ?drafts also lists drafts
// (branch previews only — drafts never reach main unpublished pages' readers).

(function () {
    'use strict';

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function latestEventDate(item) {
        if (!item.events || item.events.length === 0) return '';
        return item.events[0].date;
    }

    function formatMonth(dateStr) {
        if (!dateStr) return '';
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var parts = dateStr.split('-');
        var monthIdx = parseInt(parts[1], 10) - 1;
        return months[monthIdx] + ' ' + parts[0];
    }

    fetch('/assets/data/content.json')
        .then(function (res) { return res.json(); })
        .then(function (content) {
            var showDrafts = /[?&]drafts\b/.test(location.search);
            document.querySelectorAll('.research-track .archive-list[data-series]').forEach(function (container) {
                var series = container.getAttribute('data-series');
                var episodes = content.filter(function (item) {
                    return item.series === series && (item.published || (showDrafts && item.status === 'draft'));
                });
                episodes.sort(function (a, b) {
                    return (latestEventDate(a) || '9999').localeCompare(latestEventDate(b) || '9999') || a.title.localeCompare(b.title);
                });
                episodes.forEach(function (item) {
                    var a = document.createElement('a');
                    a.href = item.url;
                    a.className = 'archive-item zone-research';
                    a.innerHTML =
                        '<div class="archive-item-header">' +
                            '<span class="archive-title">' + escapeHtml(item.title) + '</span>' +
                        '</div>' +
                        '<span class="archive-desc">' + escapeHtml(item.description || '') + '</span>' +
                        '<span class="archive-date zone-research">' + (item.published ? formatMonth(latestEventDate(item)) : 'draft') + '</span>';
                    container.appendChild(a);
                });
            });
        })
        .catch(function () {
            // Silent fail — the See-all-work link below the list still stands.
        });
})();

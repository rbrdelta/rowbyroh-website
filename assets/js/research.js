// research.js — /research hub (Model Behavior series)
// Renders the episode list from content.json in series order (oldest first —
// a series reads forward). Single source of truth: an episode registered with
// series "model-behavior" appears here automatically.

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
            var container = document.getElementById('research-list');
            if (!container) return;

            var episodes = content.filter(function (item) {
                return item.published && item.series === 'model-behavior';
            });
            episodes.sort(function (a, b) {
                return latestEventDate(a).localeCompare(latestEventDate(b));
            });

            episodes.forEach(function (item) {
                var a = document.createElement('a');
                a.href = item.url;
                a.className = 'archive-item zone-research';
                a.innerHTML =
                    '<div class="archive-item-header">' +
                        '<span class="archive-type zone-research">' + escapeHtml(item.type) + '</span>' +
                        '<span class="archive-title">' + escapeHtml(item.title) + '</span>' +
                    '</div>' +
                    '<span class="archive-desc">' + escapeHtml(item.description || '') + '</span>' +
                    '<span class="archive-date">' + formatMonth(latestEventDate(item)) + '</span>';
                container.appendChild(a);
            });
        })
        .catch(function () {
            // Silent fail — the See-all-work link below the list still stands.
        });
})();

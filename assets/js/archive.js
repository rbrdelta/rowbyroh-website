// archive.js — All Work page
// Renders all published items from content.json with tag filtering and URL param support.

(function () {
    'use strict';

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function zoneClass(type) {
        switch (type) {
            case 'project': return 'zone-portfolio';
            case 'analysis': return 'zone-portfolio';
            case 'essay': return 'zone-writing';
            case 'roundtable': return 'zone-writing';
            default: return 'zone-mono';
        }
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

    function collectTags(items) {
        var tagSet = {};
        items.forEach(function (item) {
            (item.tags || []).forEach(function (t) { tagSet[t] = true; });
        });
        return Object.keys(tagSet);
    }

    function getUrlTag() {
        var params = new URLSearchParams(window.location.search);
        return params.get('tag') || null;
    }

    function renderFilters(tags, activeTag, onToggle) {
        var container = document.getElementById('archive-filters');
        if (!container) return;
        container.innerHTML = '';

        tags.forEach(function (tag) {
            var btn = document.createElement('button');
            btn.textContent = tag;
            if (activeTag === tag) btn.classList.add('active');
            btn.addEventListener('click', function () {
                onToggle(tag);
            });
            container.appendChild(btn);
        });
    }

    function renderItems(items, activeTag) {
        var container = document.getElementById('archive-list');
        if (!container) return;
        container.innerHTML = '';

        items.forEach(function (item) {
            var zone = zoneClass(item.type);
            var a = document.createElement('a');
            a.href = item.url;
            a.className = 'archive-item ' + zone;

            if (activeTag && (!item.tags || item.tags.indexOf(activeTag) === -1)) {
                a.classList.add('filtered-out');
            }

            a.innerHTML =
                '<div class="archive-item-header">' +
                    '<span class="archive-type ' + zone + '">' + escapeHtml(item.type) + '</span>' +
                    '<span class="archive-title">' + escapeHtml(item.title) + '</span>' +
                '</div>' +
                '<span class="archive-desc">' + escapeHtml(item.description || '') + '</span>' +
                '<span class="archive-date">' + formatMonth(latestEventDate(item)) + '</span>';

            container.appendChild(a);
        });
    }

    function updateTitle(activeTag) {
        var title = document.getElementById('archive-title');
        if (!title) return;
        title.textContent = activeTag ? 'All ' + activeTag + ' Work' : 'All Work';
    }

    fetch('/assets/data/content.json')
        .then(function (res) { return res.json(); })
        .then(function (content) {
            var published = content.filter(function (item) { return item.published; });

            // Sort by most recent event date descending
            published.sort(function (a, b) {
                return latestEventDate(b).localeCompare(latestEventDate(a));
            });

            var tags = collectTags(published);
            var activeTag = getUrlTag();

            function refresh() {
                renderFilters(tags, activeTag, function (tag) {
                    activeTag = (activeTag === tag) ? null : tag;
                    refresh();
                    // Update URL without reload
                    var url = activeTag ? '?tag=' + encodeURIComponent(activeTag) : window.location.pathname;
                    history.replaceState(null, '', url);
                });
                renderItems(published, activeTag);
                updateTitle(activeTag);
            }

            refresh();
        })
        .catch(function () {
            // Silent fail
        });
})();

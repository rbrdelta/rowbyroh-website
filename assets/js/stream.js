// stream.js — Aperture + Logbook homepage rendering
// Renders one featured item (aperture) and 7 recent activity events (logbook)
// from content.json. Tags reshape both sections.

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
            case 'field-note': return 'zone-writing';
            default: return 'zone-mono';
        }
    }

    function formatDate(dateStr) {
        var parts = dateStr.split('-');
        return parts[1] + '-' + parts[2];
    }

    function findFeatured(items, tag) {
        var match;
        if (tag) {
            match = items.find(function (item) {
                return item.published && item.featured_for && item.featured_for.indexOf(tag) !== -1;
            });
        }
        if (!match) {
            match = items.find(function (item) {
                return item.published && item.featured_for && item.featured_for.indexOf('default') !== -1;
            });
        }
        return match;
    }

    function renderAperture(items, activeTag) {
        var container = document.getElementById('aperture-section');
        if (!container) return;
        container.innerHTML = '';

        var item = findFeatured(items, activeTag);
        if (!item) return;

        var zone = zoneClass(item.type);
        var article = document.createElement('article');
        article.className = 'aperture ' + zone;

        article.innerHTML =
            '<div class="aperture-header">' +
                '<span class="aperture-type ' + zone + '">' + escapeHtml(item.type) + '</span>' +
            '</div>' +
            '<h2 class="aperture-title">' + escapeHtml(item.title) + '</h2>' +
            '<p class="aperture-theme">' + escapeHtml(item.description || '') + '</p>' +
            '<a href="' + escapeHtml(item.url) + '" class="aperture-link">Read &rarr;</a>';

        container.appendChild(article);
    }

    function collectEvents(items, activeTag, featuredId) {
        var events = [];
        items.forEach(function (item) {
            if (!item.published || !item.events) return;
            if (item.id === featuredId) return;
            if (activeTag && (!item.tags || item.tags.indexOf(activeTag) === -1)) return;
            // Only take the most recent event per item to avoid duplicates
            var ev = item.events[0];
            if (ev) {
                events.push({
                    date: ev.date,
                    action: ev.action,
                    title: item.title,
                    url: item.url,
                    type: item.type,
                    tags: item.tags || []
                });
            }
        });
        events.sort(function (a, b) {
            return b.date.localeCompare(a.date);
        });
        return events.slice(0, 7);
    }

    function renderLogbook(items, activeTag) {
        var container = document.getElementById('logbook-section');
        if (!container) return;
        container.innerHTML = '';

        var featured = findFeatured(items, activeTag);
        var featuredId = featured ? featured.id : null;
        var events = collectEvents(items, activeTag, featuredId);

        if (events.length === 0) {
            container.style.display = 'none';
            return;
        }
        container.style.display = '';

        var labelText = activeTag ? 'recent in ' + activeTag : 'recent';
        var logbook = document.createElement('div');
        logbook.className = 'logbook';

        var label = document.createElement('span');
        label.className = 'logbook-label';
        label.textContent = labelText;
        logbook.appendChild(label);

        var entries = document.createElement('div');
        entries.className = 'logbook-entries';

        events.forEach(function (ev) {
            var zone = zoneClass(ev.type);
            var a = document.createElement('a');
            a.href = ev.url;
            a.className = 'logbook-entry';
            a.innerHTML =
                '<span class="logbook-date ' + zone + '">' + formatDate(ev.date) + '</span>' +
                '<span class="logbook-title">' + escapeHtml(ev.title) + '</span>' +
                '<span class="logbook-action">' + escapeHtml(ev.action) + '</span>';
            entries.appendChild(a);
        });

        logbook.appendChild(entries);
        container.appendChild(logbook);
    }

    function initFilters(items) {
        var tagButtons = document.querySelectorAll('.tag-filter');
        var activeTag = null;

        tagButtons.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                var tag = btn.dataset.tag;

                if (activeTag === tag) {
                    activeTag = null;
                    btn.classList.remove('active');
                } else {
                    activeTag = tag;
                    tagButtons.forEach(function (b) { b.classList.remove('active'); });
                    btn.classList.add('active');
                }

                renderAperture(items, activeTag);
                renderLogbook(items, activeTag);
            });
        });
    }

    fetch('/assets/data/content.json')
        .then(function (res) { return res.json(); })
        .then(function (content) {
            renderAperture(content, null);
            renderLogbook(content, null);
            initFilters(content);
        })
        .catch(function () {
            // Silent fail
        });
})();

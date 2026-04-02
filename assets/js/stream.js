// stream.js — unified content stream for the homepage
// Renders all content (projects, essays, roundtables, analyses) from content.json
// Pinned items sort first (max 3, respects pin_expires). Rest by date descending.

(function () {
    'use strict';

    var MAX_PINS = 3;

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function escapeAttr(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    // Parse "Mar 2026" style dates for sorting
    function parseDate(dateStr) {
        if (!dateStr) return 0;
        var d = new Date(dateStr + ' 1');
        return isNaN(d.getTime()) ? 0 : d.getTime();
    }

    function isPinned(item) {
        if (!item.pinned) return false;
        if (!item.pin_expires) return true;
        return new Date(item.pin_expires) > new Date();
    }

    function sortItems(items) {
        var pinned = [];
        var rest = [];

        items.forEach(function (item) {
            if (isPinned(item)) {
                pinned.push(item);
            } else {
                rest.push(item);
            }
        });

        // Cap pinned items
        pinned = pinned.slice(0, MAX_PINS);

        // Move overflow back to rest
        if (pinned.length < items.filter(isPinned).length) {
            items.filter(isPinned).slice(MAX_PINS).forEach(function (item) {
                rest.push(item);
            });
        }

        // Sort rest by date descending
        rest.sort(function (a, b) {
            return parseDate(b.date) - parseDate(a.date);
        });

        return pinned.concat(rest);
    }

    // Zone color class for type labels
    function zoneClass(type) {
        switch (type) {
            case 'project': return 'zone-portfolio';
            case 'essay': return 'zone-writing';
            case 'analysis': return 'zone-portfolio';
            case 'roundtable': return 'zone-writing';
            default: return 'zone-mono';
        }
    }

    function renderStreamItem(item) {
        var isUpcoming = !item.published || item.status === 'in-progress';
        var zone = zoneClass(item.type);
        var el = document.createElement('div');
        el.className = 'stream-item ' + zone + (isUpcoming ? ' stream-item--upcoming' : '');
        el.dataset.tags = (item.tags || []).join(',');

        if (isUpcoming) {
            el.innerHTML =
                '<div class="stream-item-header">' +
                    '<span class="stream-type ' + zoneClass(item.type) + '">' + escapeHtml(item.type) + '</span>' +
                    '<span class="stream-title">' + escapeHtml(item.title) + '</span>' +
                '</div>' +
                '<span class="stream-status">in progress</span>';
            return el;
        }

        var link = document.createElement('a');
        link.href = item.url;
        link.className = 'stream-item-link';
        link.innerHTML =
            '<div class="stream-item-header">' +
                '<span class="stream-type ' + zoneClass(item.type) + '">' + escapeHtml(item.type) + '</span>' +
                '<span class="stream-title">' + escapeHtml(item.title) + '</span>' +
            '</div>' +
            '<div class="stream-item-body">' +
                '<span class="stream-desc">' + escapeHtml(item.description || '') + '</span>' +
            '</div>' +
            '<div class="stream-item-meta">' +
                (item.date ? '<span class="stream-date">' + escapeHtml(item.date) + '</span>' : '') +
                '<span class="stream-tags">' + (item.tags || []).map(function (t) { return '<span class="stream-tag">' + escapeHtml(t) + '</span>'; }).join('') + '</span>' +
            '</div>';
        el.appendChild(link);
        return el;
    }

    function renderStream(content) {
        var container = document.getElementById('content-stream');
        if (!container) return;

        var published = content.filter(function (item) { return item.published; });
        var upcoming = content.filter(function (item) { return !item.published; });

        var sorted = sortItems(published);

        sorted.forEach(function (item) {
            container.appendChild(renderStreamItem(item));
        });

        // Upcoming section
        if (upcoming.length > 0) {
            var upSection = document.createElement('div');
            upSection.className = 'stream-upcoming';

            var upLabel = document.createElement('span');
            upLabel.className = 'stream-upcoming-label';
            upLabel.textContent = 'in progress';
            upSection.appendChild(upLabel);

            upcoming.forEach(function (item) {
                upSection.appendChild(renderStreamItem(item));
            });

            container.appendChild(upSection);
        }
    }

    // Tag filtering
    function initFilters(content) {
        var tagButtons = document.querySelectorAll('.tag-filter');
        var activeTag = null;

        tagButtons.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                var tag = btn.dataset.tag;

                if (activeTag === tag) {
                    activeTag = null;
                    btn.classList.remove('active');
                    document.querySelectorAll('.stream-item').forEach(function (el) {
                        el.classList.remove('filtered-out');
                    });
                } else {
                    activeTag = tag;
                    tagButtons.forEach(function (b) { b.classList.remove('active'); });
                    btn.classList.add('active');

                    document.querySelectorAll('.stream-item').forEach(function (el) {
                        var tags = (el.dataset.tags || '').split(',');
                        if (tags.indexOf(tag) !== -1) {
                            el.classList.remove('filtered-out');
                        } else {
                            el.classList.add('filtered-out');
                        }
                    });
                }
            });
        });
    }

    // Load and render
    fetch('/assets/data/content.json')
        .then(function (res) { return res.json(); })
        .then(function (content) {
            renderStream(content);
            initFilters(content);
        })
        .catch(function () {
            // Silent fail
        });
})();

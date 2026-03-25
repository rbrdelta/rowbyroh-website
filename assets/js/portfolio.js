document.addEventListener('DOMContentLoaded', function () {
    var container = document.getElementById('portfolio-container');
    var coveredNote = document.querySelector('.covered-note');
    var coveredNoteCard = document.querySelector('.covered-note-card');

    var items = [];
    var activeTag = null;
    var tooltip = null;
    var activeItem = null;

    // ---- TAG FILTERS ----

    var allTags = [];
    projects.forEach(function (p) {
        p.tags.forEach(function (t) {
            if (allTags.indexOf(t) === -1) allTags.push(t);
        });
    });

    var tagFiltersEl = document.createElement('div');
    tagFiltersEl.className = 'tag-filters';

    allTags.forEach(function (tag) {
        var btn = document.createElement('button');
        btn.className = 'tag-filter';
        btn.textContent = tag;
        btn.dataset.tag = tag;
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (activeTag === tag) {
                activeTag = null;
                btn.classList.remove('active');
                items.forEach(function (item) {
                    item.classList.remove('filtered-out');
                });
            } else {
                activeTag = tag;
                document.querySelectorAll('.tag-filter').forEach(function (b) {
                    b.classList.remove('active');
                });
                btn.classList.add('active');
                items.forEach(function (item) {
                    var project = projects.find(function (p) {
                        return p.id === item.dataset.project;
                    });
                    if (project && project.tags.indexOf(tag) !== -1) {
                        item.classList.remove('filtered-out');
                    } else {
                        item.classList.add('filtered-out');
                    }
                });
            }
        });
        tagFiltersEl.appendChild(btn);
    });

    container.appendChild(tagFiltersEl);

    // ---- BUILD PORTFOLIO ITEMS ----

    projects.forEach(function (project) {
        var el = document.createElement('div');
        el.className = 'portfolio-item';
        el.dataset.project = project.id;

        var rotation = (Math.random() - 0.5) * 2;
        el.style.transform = 'rotate(' + rotation + 'deg)';

        var title = document.createElement('div');
        title.className = 'item-title';
        title.textContent = project.title;
        el.appendChild(title);

        container.appendChild(el);
        items.push(el);
    });

    // rowbyroh.com is itself a portfolio item — listed in projects.js, not as a colophon

    // ---- Create tooltip element once, append to body ----
    tooltip = document.createElement('div');
    tooltip.className = 'project-tooltip';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);

    // Keep tooltip open when hovering it
    tooltip.addEventListener('mouseenter', function () {
        // still active, do nothing
    });
    tooltip.addEventListener('mouseleave', function () {
        hideTooltip();
    });

    // Click on tooltip navigates
    tooltip.addEventListener('click', function () {
        if (activeItem) {
            var project = projects.find(function (p) {
                return p.id === activeItem.dataset.project;
            });
            if (project && project.link) {
                window.location.href = project.link;
            }
        }
    });

    // ---- HOVER + CLICK on items ----

    items.forEach(function (item) {
        item.addEventListener('mouseenter', function () {
            // Fade others via container class
            container.classList.add('has-active');
            item.classList.add('is-active');

            showTooltip(item);
        });

        item.addEventListener('mouseleave', function (e) {
            // Check if we moved to the tooltip
            var related = e.relatedTarget;
            if (tooltip.contains(related)) return;

            hideTooltip();
        });

        item.addEventListener('click', function () {
            var project = projects.find(function (p) {
                return p.id === item.dataset.project;
            });
            if (project && project.link) {
                window.location.href = project.link;
            }
        });
    });

    // ---- TOOLTIP SHOW/HIDE ----

    function showTooltip(item) {
        var project = projects.find(function (p) {
            return p.id === item.dataset.project;
        });
        if (!project) return;

        activeItem = item;

        var html = '<div class="tooltip-title">' + escapeHtml(project.title) + '</div>';
        if (project.highlights && project.highlights.length && project.highlights[0] !== 'TBD') {
            html += '<ul class="tooltip-highlights">';
            project.highlights.forEach(function (h) {
                html += '<li>' + escapeHtml(h) + '</li>';
            });
            html += '</ul>';
        }

        if (project.link) {
            html += '<a href="' + escapeAttr(project.link) + '" class="tooltip-link">Read more \u2192</a>';
        } else {
            html += '<span class="tooltip-soon">Coming soon</span>';
        }

        tooltip.innerHTML = html;
        tooltip.style.display = 'block';

        // Position overlapping the item — no gap
        var rect = item.getBoundingClientRect();
        var tooltipWidth = 280;
        var left = rect.left;
        var top = rect.top;

        // Keep on screen horizontally
        if (left + tooltipWidth > window.innerWidth - 16) {
            left = window.innerWidth - tooltipWidth - 16;
        }
        if (left < 16) left = 16;

        // If it would go off bottom, show above
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';

        requestAnimationFrame(function () {
            var tRect = tooltip.getBoundingClientRect();
            if (tRect.bottom > window.innerHeight - 16) {
                tooltip.style.top = (rect.bottom - tRect.height) + 'px';
            }
        });
    }

    function hideTooltip() {
        tooltip.style.display = 'none';
        container.classList.remove('has-active');
        items.forEach(function (i) { i.classList.remove('is-active'); });
        activeItem = null;
    }

    // Close on Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') hideTooltip();
    });

    // ---- COVERED NOTE ----

    coveredNote.addEventListener('click', function (e) {
        e.stopPropagation();
        coveredNoteCard.classList.toggle('hidden');
    });

    coveredNote.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            coveredNoteCard.classList.toggle('hidden');
        }
    });

    document.addEventListener('click', function (e) {
        if (
            !coveredNote.contains(e.target) &&
            !coveredNoteCard.contains(e.target)
        ) {
            coveredNoteCard.classList.add('hidden');
        }
    });

    // ---- UTILS ----

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
});

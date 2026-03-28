document.addEventListener('DOMContentLoaded', function () {
    var container = document.getElementById('portfolio-container');
    var coveredNote = document.querySelector('.covered-note');
    var coveredNoteCard = document.querySelector('.covered-note-card');

    var items = [];
    var activeTag = null;
    var tooltip = null;
    var activeItem = null;

    // ---- UNIFIED TAG FILTERS ----

    var tagButtons = document.querySelectorAll('.tag-filter');

    tagButtons.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var tag = btn.dataset.tag;

            if (activeTag === tag) {
                // Deselect
                activeTag = null;
                btn.classList.remove('active');
                items.forEach(function (item) {
                    item.classList.remove('filtered-out');
                });
                document.querySelectorAll('[data-tags]').forEach(function (el) {
                    el.classList.remove('filtered-out');
                });
            } else {
                // Select new tag
                activeTag = tag;
                tagButtons.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');

                // Filter portfolio items
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

                // Filter writing items
                document.querySelectorAll('[data-tags]').forEach(function (el) {
                    var tags = el.dataset.tags.split(',');
                    if (tags.indexOf(tag) !== -1) {
                        el.classList.remove('filtered-out');
                    } else {
                        el.classList.add('filtered-out');
                    }
                });
            }
        });
    });

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
            container.classList.add('has-active');
            item.classList.add('is-active');
            showTooltip(item);
        });

        item.addEventListener('mouseleave', function (e) {
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

        var rect = item.getBoundingClientRect();
        var tooltipWidth = 280;
        var left = rect.left;
        var top = rect.top;

        if (left + tooltipWidth > window.innerWidth - 16) {
            left = window.innerWidth - tooltipWidth - 16;
        }
        if (left < 16) left = 16;

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

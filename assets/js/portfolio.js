document.addEventListener('DOMContentLoaded', function () {
    var container = document.getElementById('portfolio-container');
    var cardOverlay = document.getElementById('card-overlay');
    var cardBody = document.querySelector('.card-body');
    var cardClose = document.querySelector('.card-close');
    var drawer = document.getElementById('drawer');
    var drawerBody = document.querySelector('.drawer-body');
    var drawerClose = document.querySelector('.drawer-close');
    var lightbox = document.getElementById('lightbox');
    var lightboxBody = document.querySelector('.lightbox-body');
    var lightboxClose = document.querySelector('.lightbox-close');
    var coveredNote = document.querySelector('.covered-note');
    var coveredNoteCard = document.querySelector('.covered-note-card');

    var items = [];
    var drawerBackdrop = null;
    var activeTag = null;

    // ---- TAG FILTERS ----

    // Collect unique tags across all projects
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
        btn.addEventListener('click', function () {
            if (activeTag === tag) {
                // Clear filter
                activeTag = null;
                btn.classList.remove('active');
                items.forEach(function (item) {
                    item.classList.remove('filtered-out');
                });
            } else {
                // Set filter
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
        el.dataset.type = project.type;

        // Random scatter: rotation + offset
        var rotation = (Math.random() - 0.5) * 4;
        var tx = (Math.random() - 0.5) * 16;
        var ty = (Math.random() - 0.5) * 10;
        el.style.transform =
            'rotate(' + rotation + 'deg) translate(' + tx + 'px, ' + ty + 'px)';

        // Title
        var title = document.createElement('div');
        title.className = 'item-title';
        title.textContent = project.title;
        el.appendChild(title);

        // Annotation (hover preview)
        var annotation = document.createElement('div');
        annotation.className = 'annotation';
        annotation.textContent = project.about;
        el.appendChild(annotation);

        // Inline detail for link type
        if (project.type === 'link') {
            var detail = document.createElement('div');
            detail.className = 'inline-detail';
            detail.innerHTML =
                '<p>' +
                project.about +
                '</p>' +
                '<a href="' +
                escapeAttr(project.link) +
                '" target="_blank" rel="noopener">Visit &rarr;</a>';
            el.appendChild(detail);
        }

        container.appendChild(el);
        items.push(el);
    });

    // Site colophon — the site itself as a meta-note
    var colophon = document.createElement('div');
    colophon.className = 'site-colophon';
    colophon.textContent = 'this site \u2014 vanilla js, deployed on vercel \u2014 2025';
    container.appendChild(colophon);

    // ---- HOVER: fade others ----

    items.forEach(function (item) {
        item.addEventListener('mouseenter', function () {
            items.forEach(function (other) {
                if (other !== item) other.classList.add('faded');
            });
        });

        item.addEventListener('mouseleave', function () {
            items.forEach(function (other) {
                other.classList.remove('faded');
            });
        });
    });

    // ---- CLICK: type-specific interaction ----

    items.forEach(function (item) {
        item.addEventListener('click', function () {
            var project = projects.find(function (p) {
                return p.id === item.dataset.project;
            });
            if (!project) return;

            switch (project.type) {
                case 'tool':
                    openCard(project);
                    break;
                case 'document':
                    openDrawer(project);
                    break;
                case 'visual':
                    openLightbox(project);
                    break;
                case 'link':
                    toggleInline(item);
                    break;
            }
        });
    });

    // ---- TOOL: Expanding Card ----

    function openCard(project) {
        var html = '';
        html +=
            '<h2>' +
            escapeHtml(project.title) +
            '</h2>';
        html +=
            '<div class="card-about">' + escapeHtml(project.about) + '</div>';

        if (project.highlights && project.highlights.length) {
            html += '<div class="card-section"><h3>Highlights</h3><ul>';
            project.highlights.forEach(function (h) {
                html += '<li>' + escapeHtml(h) + '</li>';
            });
            html += '</ul></div>';
        }

        if (project.stack && project.stack.length) {
            html += '<div class="card-section"><h3>Stack</h3>';
            html += '<div class="card-stack">';
            project.stack.forEach(function (s) {
                html += '<span>' + escapeHtml(s) + '</span>';
            });
            html += '</div></div>';
        }

        html +=
            '<div class="card-tags">' +
            project.tags.join(' / ') +
            ' &mdash; ' +
            escapeHtml(project.date) +
            '</div>';

        if (project.link && project.link !== '#') {
            html +=
                '<a href="' +
                escapeAttr(project.link) +
                '" class="card-link" target="_blank" rel="noopener">View Project &rarr;</a>';
        }

        cardBody.innerHTML = html;
        cardOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeCard() {
        cardOverlay.classList.add('hidden');
        document.body.style.overflow = '';
    }

    cardClose.addEventListener('click', closeCard);
    cardOverlay.addEventListener('click', function (e) {
        if (e.target === cardOverlay) closeCard();
    });

    // ---- DOCUMENT: Drawer ----

    function ensureBackdrop() {
        if (!drawerBackdrop) {
            drawerBackdrop = document.createElement('div');
            drawerBackdrop.className = 'drawer-backdrop';
            document.body.appendChild(drawerBackdrop);
            drawerBackdrop.addEventListener('click', closeDrawer);
        }
    }

    function openDrawer(project) {
        ensureBackdrop();

        var html = '';
        html +=
            '<h2>' +
            escapeHtml(project.title) +
            '</h2>';
        html +=
            '<div class="drawer-about">' +
            escapeHtml(project.about) +
            '</div>';

        if (project.body) {
            html += '<div class="drawer-body-content">' + project.body + '</div>';
        } else if (project.excerpt) {
            html +=
                '<div class="drawer-excerpt">' +
                escapeHtml(project.excerpt) +
                '</div>';
        }

        html +=
            '<div class="drawer-tags">' +
            project.tags.join(' / ') +
            ' &mdash; ' +
            escapeHtml(project.date) +
            '</div>';

        if (project.link && project.link !== '#') {
            html +=
                '<a href="' +
                escapeAttr(project.link) +
                '" class="drawer-link" target="_blank" rel="noopener">Read more &rarr;</a>';
        }

        drawerBody.innerHTML = html;
        drawer.classList.remove('hidden');
        drawerBackdrop.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        drawer.classList.add('hidden');
        if (drawerBackdrop) drawerBackdrop.classList.remove('visible');
        document.body.style.overflow = '';
    }

    drawerClose.addEventListener('click', closeDrawer);

    // ---- VISUAL: Lightbox ----

    function openLightbox(project) {
        var html = '';
        html +=
            '<h2 style="margin-bottom:1rem;">' +
            escapeHtml(project.title) +
            '</h2>';

        if (project.images && project.images.length) {
            project.images.forEach(function (img) {
                html +=
                    '<img src="' +
                    escapeAttr(img) +
                    '" alt="' +
                    escapeAttr(project.title) +
                    '">';
            });
        } else {
            html += '<p>Screenshots coming soon</p>';
        }

        lightboxBody.innerHTML = html;
        lightbox.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.add('hidden');
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
    });

    // ---- LINK: Inline Unfold ----

    function toggleInline(item) {
        var detail = item.querySelector('.inline-detail');
        if (detail) detail.classList.toggle('open');
    }

    // ---- GLOBAL: Escape key ----

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeCard();
            closeDrawer();
            closeLightbox();
        }
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

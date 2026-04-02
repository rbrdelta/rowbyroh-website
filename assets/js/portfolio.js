document.addEventListener('DOMContentLoaded', function () {
    var container = document.getElementById('portfolio-container');
    var coveredNote = document.querySelector('.covered-note');
    var coveredNoteCard = document.querySelector('.covered-note-card');

    var items = [];
    var activeTag = null;

    // ---- UNIFIED TAG FILTERS ----

    var tagButtons = document.querySelectorAll('.tag-filter');

    tagButtons.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var tag = btn.dataset.tag;

            if (activeTag === tag) {
                activeTag = null;
                btn.classList.remove('active');
                items.forEach(function (item) {
                    item.classList.remove('filtered-out');
                });
                document.querySelectorAll('[data-tags]').forEach(function (el) {
                    el.classList.remove('filtered-out');
                });
            } else {
                activeTag = tag;
                tagButtons.forEach(function (b) { b.classList.remove('active'); });
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

    // ---- BUILD PORTFOLIO ITEMS (title + stat pulse, two-beat rhythm) ----

    projects.forEach(function (project) {
        var el = document.createElement('a');
        el.className = 'portfolio-item';
        el.dataset.project = project.id;
        if (project.link) {
            el.href = project.link;
        }

        var title = document.createElement('div');
        title.className = 'item-title';
        title.textContent = project.title;
        el.appendChild(title);

        if (project.stat) {
            var pulse = document.createElement('div');
            pulse.className = 'item-stat-pulse';
            pulse.textContent = project.stat;
            el.appendChild(pulse);
        }

        container.appendChild(el);
        items.push(el);
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
});

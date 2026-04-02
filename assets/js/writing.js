// writing.js — renders writing entries from content.json
// Used on: writing.html (full index) and blog post pages (prev/next nav)
// Homepage rendering is handled by stream.js

(function () {
    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Writing types: essays, roundtables, analyses — everything that isn't a "project"
    var writingTypes = ['essay', 'roundtable', 'analysis'];

    function isWriting(item) {
        return writingTypes.indexOf(item.type) !== -1;
    }

    function loadContent(callback) {
        fetch('/assets/data/content.json')
            .then(function (res) { return res.json(); })
            .then(function (content) {
                // Extract writing items, map to posts-compatible shape
                var posts = content.filter(isWriting).map(function (item) {
                    return {
                        title: item.title,
                        date: item.date,
                        url: item.url,
                        description: item.description,
                        tags: item.tags || [],
                        published: item.published
                    };
                });
                callback(posts);
            })
            .catch(function () {
                // Silent fail
            });
    }

    // Writing index: render full post list + upcoming into containers
    function renderIndex(posts) {
        var listEl = document.getElementById('post-list');
        var upcomingEl = document.getElementById('upcoming-list');
        if (!listEl) return;

        var published = posts.filter(function (p) { return p.published; });
        var upcoming = posts.filter(function (p) { return !p.published; });

        published.forEach(function (post) {
            var li = document.createElement('li');
            li.className = 'post-entry';
            li.dataset.tags = post.tags.join(',');
            li.innerHTML =
                '<span class="post-date">' + escapeHtml(post.date) + '</span>' +
                '<a href="' + escapeHtml(post.url) + '" class="post-title">' + escapeHtml(post.title) + '</a>' +
                '<span class="post-tag">' + post.tags.map(function (t) { return escapeHtml(t.replace(/-/g, ' ')); }).join(' / ') + '</span>';
            listEl.appendChild(li);
        });

        if (upcomingEl && upcoming.length > 0) {
            upcoming.forEach(function (post) {
                var div = document.createElement('div');
                div.className = 'upcoming-item';
                div.textContent = post.title;
                upcomingEl.appendChild(div);
            });
        }
    }

    // Post page: render prev/next navigation
    function renderPostNav(posts) {
        var navEl = document.getElementById('post-nav');
        if (!navEl) return;

        var published = posts.filter(function (p) { return p.published; });
        var currentUrl = window.location.pathname;

        var idx = -1;
        for (var i = 0; i < published.length; i++) {
            if (published[i].url === currentUrl) {
                idx = i;
                break;
            }
        }

        if (idx === -1) return;

        var prev = idx > 0 ? published[idx - 1] : null;
        var next = idx < published.length - 1 ? published[idx + 1] : null;

        var html = '';
        if (prev) {
            html += '<a href="' + escapeHtml(prev.url) + '" class="nav-prev">' + escapeHtml(prev.title) + '</a>';
        } else {
            html += '<span class="nav-disabled"></span>';
        }
        if (next) {
            html += '<a href="' + escapeHtml(next.url) + '" class="nav-next">' + escapeHtml(next.title) + '</a>';
        } else {
            html += '<span class="nav-disabled"></span>';
        }

        navEl.innerHTML = html;
    }

    // Detect which page we're on and render accordingly
    loadContent(function (posts) {
        if (document.getElementById('post-list')) {
            renderIndex(posts);
        }
        if (document.getElementById('post-nav')) {
            renderPostNav(posts);
        }
    });
})();

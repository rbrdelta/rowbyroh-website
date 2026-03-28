// writing.js — renders writing entries from posts.json
// Used on: index.html (homepage, latest 3) and writing.html (full index)

(function () {
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function loadPosts(callback) {
        fetch('/assets/data/posts.json')
            .then(function (res) { return res.json(); })
            .then(callback)
            .catch(function () {
                // Silent fail — writing section just won't render
            });
    }

    // Homepage: render featured post + upcoming teasers into #writing-list
    function renderHomepage(posts) {
        var container = document.getElementById('writing-list');
        if (!container) return;

        var published = posts.filter(function (p) { return p.published; });
        var upcoming = posts.filter(function (p) { return !p.published; });

        // Featured: latest published post with excerpt
        if (published.length > 0) {
            var feat = published[0];
            var featEl = document.createElement('a');
            featEl.href = feat.url;
            featEl.className = 'writing-featured';
            featEl.dataset.tags = feat.tags.join(',');
            featEl.innerHTML =
                '<span class="writing-featured-date">' + escapeHtml(feat.date) + '</span>' +
                '<span class="writing-featured-title">' + escapeHtml(feat.title) + '</span>' +
                '<span class="writing-featured-desc">' + escapeHtml(feat.description) + '</span>';
            container.appendChild(featEl);
        }

        // Remaining published
        published.slice(1, 3).forEach(function (post) {
            var a = document.createElement('a');
            a.href = post.url;
            a.className = 'writing-entry';
            a.dataset.tags = post.tags.join(',');
            a.innerHTML =
                '<span class="writing-date">' + escapeHtml(post.date) + '</span>' +
                '<span class="writing-title">' + escapeHtml(post.title) + '</span>';
            container.appendChild(a);
        });

        // Upcoming teasers
        if (upcoming.length > 0) {
            var upEl = document.createElement('div');
            upEl.className = 'writing-upcoming';
            var label = document.createElement('span');
            label.className = 'writing-upcoming-label';
            label.textContent = 'in progress';
            upEl.appendChild(label);

            upcoming.slice(0, 3).forEach(function (post) {
                var item = document.createElement('span');
                item.className = 'writing-upcoming-item';
                item.textContent = post.title;
                upEl.appendChild(item);
            });
            container.appendChild(upEl);
        }
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
    loadPosts(function (posts) {
        if (document.getElementById('writing-list')) {
            renderHomepage(posts);
        }
        if (document.getElementById('post-list')) {
            renderIndex(posts);
        }
        if (document.getElementById('post-nav')) {
            renderPostNav(posts);
        }
    });
})();

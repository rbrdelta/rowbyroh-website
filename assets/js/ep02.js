// Emotional Resonance EP02 figures. Data: /assets/data/ep02.json, written by sound-lab's
// export_ep02.py from the saved readings (derived numbers only, no audio).
// Every <figure data-ep02="..."> is drawn here; one model switch drives all of them.
(function () {
    'use strict';
    var NS = 'http://www.w3.org/2000/svg';
    var C = { warm: '#b84233', cool: '#2e6ba8', mid: '#eeedea', ink: '#1a1a1a', muted: '#555', grid: '#e7e4dc', bar: '#c9c6bf', mark: '#e84040', bg: '#faf9f6' };
    var NAMES = { anger: 'anger', fear: 'fear', happy: 'happy', sad: 'sad', tender: 'tender' };
    var CHECK_NAMES = { happy_vs_sad: 'Happy vs sad', happy_vs_fear: 'Happy vs fear', tender_vs_sad: 'Tender vs sad', all_five: 'All five' };
    var CLIP_NAMES = { set1_007: 'A happy clip, read as happy', set1_008: 'A happy clip, read as sad', set1_163: 'A compound-emotion clip' };
    var state = { model: 'qwen', clip: 'set1_007' };
    var D, tip;

    function el(tag, attrs, parent, text) {
        var n = document.createElementNS(NS, tag);
        for (var k in attrs) n.setAttribute(k, attrs[k]);
        if (text != null) n.textContent = text;
        if (parent) parent.appendChild(n);
        return n;
    }
    function svg(w, h, label) {
        var s = el('svg', { viewBox: '0 0 ' + w + ' ' + h, role: 'img', 'aria-label': label });
        s.style.overflow = 'visible';
        return s;
    }
    function txt(parent, x, y, s, o) {
        o = o || {};
        return el('text', { x: x, y: y, 'font-size': o.size || 11, fill: o.fill || C.muted, 'text-anchor': o.anchor || 'start',
            'font-family': 'IBM Plex Mono, monospace', 'font-weight': o.weight || 400 }, parent, s);
    }
    function mix(a, b, t) {
        var pa = [1, 3, 5].map(function (i) { return parseInt(a.substr(i, 2), 16); });
        var pb = [1, 3, 5].map(function (i) { return parseInt(b.substr(i, 2), 16); });
        return 'rgb(' + pa.map(function (v, i) { return Math.round(v + (pb[i] - v) * t); }).join(',') + ')';
    }
    function fmt(v, d) { return (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(d == null ? 2 : d); }

    // ---- tooltip: one element, text only --------------------------------------------------
    function hover(node, lines) {
        node.setAttribute('tabindex', '0');
        var show = function (e) {
            tip.textContent = '';
            lines().forEach(function (l, i) {
                var d = document.createElement('div');
                d.textContent = l;
                if (i === 0) d.style.fontWeight = '600';
                tip.appendChild(d);
            });
            var r = e.clientX != null ? { x: e.clientX, y: e.clientY } : (function () { var b = node.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top }; })();
            tip.style.display = 'block';
            var w = tip.offsetWidth;
            tip.style.left = Math.max(8, Math.min(window.innerWidth - w - 8, r.x - w / 2)) + 'px';
            tip.style.top = (r.y - tip.offsetHeight - 12) + 'px';
            node.classList.add('hot');
        };
        var hide = function () { tip.style.display = 'none'; node.classList.remove('hot'); };
        node.addEventListener('pointermove', show);
        node.addEventListener('focus', show);
        node.addEventListener('pointerleave', hide);
        node.addEventListener('blur', hide);
    }

    // ---- controls ---------------------------------------------------------------------------
    function switcher(fig, key, options) {
        var row = document.createElement('div');
        row.className = 'ep02-switch';
        row.setAttribute('role', 'group');
        options.forEach(function (o) {
            var b = document.createElement('button');
            b.type = 'button';
            b.textContent = o[1];
            b.dataset.key = key;
            b.dataset.value = o[0];
            b.setAttribute('aria-pressed', String(state[key] === o[0]));
            b.addEventListener('click', function () { state[key] = o[0]; drawAll(); });
            row.appendChild(b);
        });
        fig.appendChild(row);
    }
    function modelSwitch(fig) { switcher(fig, 'model', Object.keys(D.models).map(function (m) { return [m, D.models[m]]; })); }
    function table(fig, caption, head, rows) {
        var det = document.createElement('details');
        det.className = 'fig-data';
        var s = document.createElement('summary');
        s.textContent = 'Data table';
        det.appendChild(s);
        var t = document.createElement('table');
        t.className = 'data';
        var cap = document.createElement('caption');
        cap.textContent = caption;
        t.appendChild(cap);
        [head].concat(rows).forEach(function (r, i) {
            var tr = document.createElement('tr');
            r.forEach(function (c) { var td = document.createElement(i ? 'td' : 'th'); td.textContent = c; tr.appendChild(td); });
            t.appendChild(tr);
        });
        det.appendChild(t);
        fig.appendChild(det);
    }

    // ---- figure: one clip, listeners vs model, moment by moment ----------------------------
    // Drawn at the figure's real width (1 SVG unit = 1px) so text stays readable on a phone.
    function drawClip(fig) {
        switcher(fig, 'clip', Object.keys(D.clips).map(function (c) { return [c, CLIP_NAMES[c] || c]; }));
        modelSwitch(fig);
        var c = D.clips[state.clip], m = c.models[state.model], E = D.emotions;
        var W = Math.max(320, Math.round(fig.clientWidth || 680)), stacked = W < 560;
        var lW = stacked ? W : Math.round(W * 0.46), mX = stacked ? 0 : lW + 24, mW = W - mX;
        var mTop = stacked ? 6 * 20 + 30 : 0;
        var y0 = mTop + 6 * 20 + 40, rh = 24, n = m.timeline.length;
        var s = svg(W, y0 + E.length * rh + 46, 'Clip ' + state.clip + ': listener ratings, model scores and the half-second timeline');
        txt(s, 0, 12, 'What listeners rated (1\u20139)', { fill: C.ink, weight: 600 });
        txt(s, mX, mTop + 12, D.models[state.model] + ': whole-clip score', { fill: C.ink, weight: 600 });
        var lMax = Math.max.apply(null, c.listeners), wAbs = Math.max.apply(null, m.whole.map(Math.abs)) || 1;
        var lBar = lW - 60 - 40, bx0 = mX + 150, half = (W - 4 - bx0) / 2, cx = bx0 + half;
        E.forEach(function (e, i) {
            var y = 26 + i * 20, my = mTop + 26 + i * 20, pick = e === m.pick;
            txt(s, 0, y + 11, NAMES[e]);
            var lv = c.listeners[i], lw = (lv - 1) / 8 * lBar;
            var lb = el('rect', { x: 60, y: y + 2, width: Math.max(lw, 2), height: 12, rx: 2, fill: lv === lMax ? C.ink : C.bar }, s);
            txt(s, 66 + Math.max(lw, 2), y + 12, lv.toFixed(1), { fill: C.ink });
            hover(lb, function () { return [lv.toFixed(1) + ' of 9', 'listeners, ' + NAMES[e]]; });
            var v = m.whole[i], bw = Math.abs(v) / wAbs * half;
            txt(s, mX, my + 11, NAMES[e] + (pick ? ' (pick)' : ''), { fill: pick ? C.ink : C.muted, weight: pick ? 600 : 400 });
            txt(s, bx0 - 6, my + 11, fmt(v), { fill: C.ink, anchor: 'end', weight: pick ? 600 : 400 });
            el('line', { x1: cx, x2: cx, y1: my, y2: my + 16, stroke: C.grid }, s);
            var mb = el('rect', { x: v >= 0 ? cx : cx - bw, y: my + 2, width: Math.max(bw, 2), height: 12, rx: 2, fill: v >= 0 ? C.warm : C.cool }, s);
            hover(mb, function () { return [fmt(v), D.models[state.model] + ', ' + NAMES[e] + ' arrow, whole clip' + (pick ? ' (strongest: the pick)' : '')]; });
        });
        // Timeline: each half second, each emotion's score minus the average of the five at that moment.
        var x0 = 56, cw = (W - x0) / n;
        txt(s, 0, y0 - 12, stacked ? 'Half a second at a time: who leads' : 'Moment by moment: which emotion leads, half a second at a time', { fill: C.ink, weight: 600 });
        var dev = m.timeline.map(function (r) { var a = r.reduce(function (p, q) { return p + q; }, 0) / r.length; return r.map(function (v) { return v - a; }); });
        var mx = Math.max.apply(null, dev.map(function (r) { return Math.max.apply(null, r.map(Math.abs)); })) || 1;
        E.forEach(function (e, i) {
            txt(s, 0, y0 + i * rh + 16, NAMES[e]);
            dev.forEach(function (r, t) {
                var v = r[i], col = v >= 0 ? mix(C.mid, C.warm, v / mx) : mix(C.mid, C.cool, -v / mx);
                var cell = el('rect', { x: x0 + t * cw, y: y0 + i * rh, width: Math.max(cw - 1, 1), height: rh - 2, fill: col }, s);
                hover(cell, function () {
                    var lead = E[r.indexOf(Math.max.apply(null, r))];
                    return [fmt(v) + ' vs the five\u2019s average', NAMES[e] + ' at ' + (t * m.window_seconds).toFixed(1) + '\u2013' + ((t + 1) * m.window_seconds).toFixed(1) + 's', 'leading here: ' + NAMES[lead]];
                });
            });
        });
        var yA = y0 + E.length * rh + 12;
        for (var sec = 0; sec <= n * m.window_seconds; sec += 5) txt(s, x0 + sec / m.window_seconds * cw, yA, sec + 's', { anchor: sec ? 'middle' : 'start' });
        el('rect', { x: x0, y: yA + 12, width: 12, height: 10, fill: C.warm }, s);
        txt(s, x0 + 18, yA + 21, 'above the five\u2019s average');
        el('rect', { x: x0 + 210, y: yA + 12, width: 12, height: 10, fill: C.cool }, s);
        txt(s, x0 + 228, yA + 21, 'below');
        fig.appendChild(s);
        table(fig, 'Clip ' + state.clip + ' (' + c.label + '), ' + D.models[state.model],
            ['emotion', 'listeners (1-9)', 'whole-clip score'],
            E.map(function (e, i) { return [e, c.listeners[i].toFixed(2), fmt(m.whole[i])]; }));
    }

    // ---- figure: the luck curve per check -----------------------------------------------
    function drawLuck(fig) {
        modelSwitch(fig);
        var grid = document.createElement('div');
        grid.className = 'ep02-grid';
        var rows = [];
        Object.keys(CHECK_NAMES).forEach(function (chk) {
            var k = D.checks[chk], L = D.luck[state.model][chk], H = L.hist;
            var first = H.findIndex(function (v) { return v > 0; }), last = H.length - 1 - H.slice().reverse().findIndex(function (v) { return v > 0; });
            var lo = Math.min(first, k.loudness, L.right, k.mark) - 2, hi = Math.max(last, k.loudness, L.right, k.mark) + 2;
            var W = 320, Hh = 190, x0 = 8, x1 = W - 8, base = 160, top = 62;
            var sx = function (v) { return x0 + (v - lo) / (hi - lo) * (x1 - x0); };
            var hmax = Math.max.apply(null, H), bw = (x1 - x0) / (hi - lo) - 2;
            var s = svg(W, Hh, CHECK_NAMES[chk] + ': scrambled-label runs against the real score');
            txt(s, 0, 12, CHECK_NAMES[chk], { fill: C.ink, weight: 600 });
            for (var v = lo; v <= hi; v++) {
                if (!H[v]) continue;
                (function (v) {
                    var h = H[v] / hmax * (base - top);
                    var b = el('rect', { x: sx(v) - bw / 2, y: base - h, width: Math.max(bw, 1), height: h, rx: 1, fill: C.bar }, s);
                    hover(b, function () { return [H[v] + ' of 1,000 runs', 'scrambled labels got ' + v + ' of ' + k.total + ' right']; });
                })(v);
            }
            el('line', { x1: x0, x2: x1, y1: base, y2: base, stroke: C.grid }, s);
            // Three markers, each with its own label row so close values never collide.
            [[L.right, D.models[state.model] + ' ' + L.right, C.warm, '', 22], [k.loudness, 'loudness ' + k.loudness, C.ink, '4 3', 34], [k.mark, 'mark ' + k.mark, C.mark, '1 3', 46]]
                .forEach(function (mk) {
                    el('line', { x1: sx(mk[0]), x2: sx(mk[0]), y1: top - 4, y2: base, stroke: mk[2], 'stroke-width': 2, 'stroke-dasharray': mk[3] }, s);
                    var right = sx(mk[0]) > W - 90;
                    txt(s, sx(mk[0]) + (right ? -4 : 4), mk[4], mk[1], { fill: C.ink, anchor: right ? 'end' : 'start' });
                });
            for (var t = Math.ceil(lo / 5) * 5; t <= hi; t += 5) txt(s, sx(t), base + 14, String(t), { anchor: 'middle' });
            txt(s, x1, base + 28, 'clips right of ' + k.total, { anchor: 'end' });
            var cell = document.createElement('div');
            cell.appendChild(s);
            grid.appendChild(cell);
            rows.push([CHECK_NAMES[chk], String(L.typical), String(L.top5), String(k.loudness), String(L.right), String(k.mark), (L.share_at_or_above * 100).toFixed(1) + '%']);
        });
        fig.appendChild(grid);
        table(fig, 'Scrambled-label runs, ' + D.models[state.model] + ' (1,000 per check)',
            ['check', 'typical', 'top 5%', 'loudness alone', 'model', 'mark', 'runs as good as the model'], rows);
    }

    // ---- figure: the mix-up grid -------------------------------------------------------------
    function drawMixups(fig) {
        modelSwitch(fig);
        var M = D.mixups[state.model], E = D.emotions, W = 420, x0 = 70, y0 = 44, cs = 64;
        var s = svg(W, y0 + cs * 5 + 8, 'Mix-up grid: the clip’s emotion against the model’s pick');
        txt(s, x0, 12, 'the model’s pick →', { fill: C.ink, weight: 600 });
        E.forEach(function (e, j) { txt(s, x0 + j * cs + cs / 2, 34, NAMES[e], { anchor: 'middle' }); });
        E.forEach(function (a, i) {
            txt(s, x0 - 8, y0 + i * cs + cs / 2 + 4, NAMES[a], { anchor: 'end' });
            E.forEach(function (b, j) {
                var v = M[i][j], diag = i === j;
                var r = el('rect', { x: x0 + j * cs, y: y0 + i * cs, width: cs - 2, height: cs - 2, rx: 2, fill: v ? mix(C.mid, C.warm, v / 20) : C.bg, stroke: diag ? C.ink : 'none', 'stroke-width': diag ? 1.5 : 0 }, s);
                txt(s, x0 + j * cs + cs / 2 - 1, y0 + i * cs + cs / 2 + 4, String(v), { anchor: 'middle', fill: v / 20 > 0.45 ? '#fff' : C.ink, size: 13 });
                hover(r, function () { return [v + ' of 20', NAMES[a] + ' clips read as ' + NAMES[b] + (diag ? ' (right)' : '')]; });
            });
        });
        fig.appendChild(s);
        table(fig, 'Mix-ups, ' + D.models[state.model] + ' (rows: the clip’s emotion; columns: the pick)', ['clip \\ pick'].concat(E),
            E.map(function (a, i) { return [a].concat(M[i].map(String)); }));
    }

    // ---- figure: opposites, drawn as the angle between each pair of arrows -----------------
    function deg(v) { return Math.acos(Math.max(-1, Math.min(1, v))) * 180 / Math.PI; }
    function fan(label, aLo, aMid, aHi, draw) {
        var W = 170, H = 112, cx = 85, cy = 92, R = 66;
        var pt = function (a, r) { var t = a * Math.PI / 180; r = r == null ? R : r; return [cx + r * Math.cos(t), cy - r * Math.sin(t)]; };
        var s = svg(W, H, label);
        el('path', { d: 'M ' + (cx + R) + ' ' + cy + ' A ' + R + ' ' + R + ' 0 0 0 ' + (cx - R) + ' ' + cy, fill: 'none', stroke: C.grid }, s);
        el('line', { x1: cx - R, x2: cx + R, y1: cy, y2: cy, stroke: C.grid }, s);
        var lo = pt(aLo), hi = pt(aHi);
        el('path', { d: 'M ' + cx + ' ' + cy + ' L ' + lo[0] + ' ' + lo[1] + ' A ' + R + ' ' + R + ' 0 0 0 ' + hi[0] + ' ' + hi[1] + ' Z', fill: C.mid }, s);
        var m = pt(aMid);
        el('line', { x1: cx, y1: cy, x2: m[0], y2: m[1], stroke: C.muted, 'stroke-dasharray': '3 3' }, s);
        draw(s, pt, cx, cy, R);
        return s;
    }
    function arrow(s, cx, cy, p, color) {
        el('line', { x1: cx, y1: cy, x2: p[0], y2: p[1], stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round' }, s);
        el('circle', { cx: p[0], cy: p[1], r: 3, fill: color }, s);
    }
    function drawOpposites(fig) {
        modelSwitch(fig);
        var O = D.opposites[state.model], P = O.pairs, L = O.luck;
        var aLo = deg(L.p99), aMid = deg(L.p50), aHi = deg(L.p01);
        var pairs = Object.keys(P).sort(function (a, b) { return P[a] - P[b]; });
        var grid = document.createElement('div');
        grid.className = 'ep02-fans';
        fig.appendChild(grid);
        // Key panel: what the angles mean.
        grid.appendChild(fan('Key: 0 degrees same direction, 90 unrelated, 180 opposite', aLo, aMid, aHi, function (s, pt, cx, cy, R) {
            txt(s, cx + R, cy + 14, '0° same', { anchor: 'end', size: 10 });
            txt(s, cx, cy - R - 6, '90° unrelated', { anchor: 'middle', size: 10 });
            txt(s, cx - R, cy + 14, '180° opposite', { size: 10 });
            var w = pt(aMid, R + 8);
            txt(s, w[0] + 2, w[1], 'random groups', { size: 9 });
        }));
        pairs.forEach(function (p) {
            var v = P[p], a = deg(v), n = p.split('_vs_'), out = v < L.p01, col = out ? C.warm : C.muted;
            var s = fan(n[0] + ' and ' + n[1] + ': ' + Math.round(a) + ' degrees apart', aLo, aMid, aHi, function (s, pt, cx, cy, R) {
                arrow(s, cx, cy, pt(0, R - 4), C.ink);
                arrow(s, cx, cy, pt(a, R - 4), col);
                txt(s, cx + R, cy + 14, NAMES[n[0]], { anchor: 'end', size: 10, fill: C.ink });
                var q = pt(a, R + 8);
                txt(s, q[0], q[1], NAMES[n[1]], { anchor: a > 100 ? 'end' : 'middle', size: 10, fill: C.ink });
                txt(s, cx - R, cy + 14, Math.round(a) + '°', { size: 12, weight: 600, fill: C.ink });
            });
            grid.appendChild(s);
            s.setAttribute('tabindex', '0');
            hover(s, function () { return [NAMES[n[0]] + ' and ' + NAMES[n[1]] + ': ' + Math.round(a) + '° apart (score ' + fmt(v) + ')', D.models[state.model],
                out ? 'further apart than 99% of random groups' : 'within the random-group range']; });
        });
        table(fig, 'Pairs of emotion arrows, ' + D.models[state.model] + '; random groups of clips: middle ' + Math.round(aMid) + '° (' + fmt(L.p50) + '), 98% between ' + Math.round(aLo) + '° and ' + Math.round(aHi) + '°',
            ['pair', 'angle', 'comparison score'], pairs.map(function (p) { return [p.replace('_vs_', '–'), Math.round(deg(P[p])) + '°', fmt(P[p])]; }));
    }

    var DRAW = { clip: drawClip, luck: drawLuck, mixups: drawMixups, opposites: drawOpposites };
    function drawAll() {
        document.querySelectorAll('figure[data-ep02]').forEach(function (fig) {
            var cap = fig.querySelector('figcaption');
            Array.prototype.slice.call(fig.childNodes).forEach(function (n) { if (n !== cap) fig.removeChild(n); });
            var host = document.createElement('div');
            host.className = 'ep02-host';
            fig.insertBefore(host, cap);
            DRAW[fig.dataset.ep02](host);
        });
    }

    var lastW = window.innerWidth, timer;
    window.addEventListener('resize', function () {
        if (!D || window.innerWidth === lastW) return;
        lastW = window.innerWidth; clearTimeout(timer); timer = setTimeout(drawAll, 150);
    });

    tip = document.createElement('div');
    tip.className = 'ep02-tip';
    tip.setAttribute('role', 'status');
    document.body.appendChild(tip);
    fetch('/assets/data/ep02.json').then(function (r) { return r.json(); }).then(function (d) { D = d; drawAll(); })
        .catch(function () {
            document.querySelectorAll('figure[data-ep02]').forEach(function (f) {
                var p = document.createElement('p');
                p.className = 'listen-note';
                p.textContent = 'The figure could not load its data.';
                f.insertBefore(p, f.firstChild);
            });
        });
})();

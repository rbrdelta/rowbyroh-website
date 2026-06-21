// Local static server that mirrors Vercel routing from vercel.json:
// cleanUrls (/about -> about.html), configured redirects, and the
// /drafts/* -> 404 rewrite. Used by Gate B so Playwright tests run against
// the same routing behavior as production.
//
// Usage: node tests/gate-b/server.mjs [port]
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, normalize } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const PORT = Number(process.argv[2] || 4321);
const vercel = JSON.parse(readFileSync(join(ROOT, 'vercel.json'), 'utf8'));
const redirects = vercel.redirects || [];

const MIME = {
    '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
    '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
};

function matchRedirect(pathname) {
    const norm = pathname.replace(/\/$/, '') || '/';
    for (const r of redirects) {
        const src = r.source.replace(/\/$/, '') || '/';
        if (src.includes(':path*')) {
            const base = src.split('/:path*')[0];
            if (norm === base || norm.startsWith(base + '/')) return r;
        } else if (src === norm) {
            return r;
        }
    }
    return null;
}

function resolveFile(pathname) {
    let p = decodeURIComponent(pathname.split('?')[0]);
    // prevent path traversal
    const safe = normalize(p).replace(/^(\.\.[/\\])+/, '');
    if (safe === '/' || safe === '') return join(ROOT, 'index.html');
    let f = join(ROOT, safe);
    if (existsSync(f) && statSync(f).isFile()) return f;
    if (existsSync(f) && statSync(f).isDirectory()) {
        const idx = join(f, 'index.html');
        if (existsSync(idx)) return idx;
    }
    // cleanUrls: /about -> about.html
    if (existsSync(f + '.html')) return f + '.html';
    return null;
}

const server = createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const redirect = matchRedirect(url.pathname);
    if (redirect) {
        if (redirect.statusCode === 404 || redirect.destination === '/404') {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end('<h1>404</h1>');
        }
        res.writeHead(redirect.statusCode || 308, { Location: redirect.destination });
        return res.end();
    }
    const file = resolveFile(url.pathname);
    if (!file) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        return res.end('<h1>404</h1>');
    }
    const body = readFileSync(file);
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
    res.end(body);
});

server.listen(PORT, () => console.log(`gate-b server on http://localhost:${PORT}`));

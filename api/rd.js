// api/rd.js — Real-Debrid reverse proxy for Watcher
// Deployed at /api/rd on your Vercel domain (same-origin = no CORS issues on iOS Safari PWA)
// Usage: POST /api/rd with JSON body { path, method, body, token }

export default async function handler(req, res) {
// Allow same-origin + any client
res.setHeader(‘Access-Control-Allow-Origin’, ‘*’);
res.setHeader(‘Access-Control-Allow-Methods’, ‘GET, POST, DELETE, OPTIONS’);
res.setHeader(‘Access-Control-Allow-Headers’, ‘Content-Type’);

if (req.method === ‘OPTIONS’) {
return res.status(200).end();
}

if (req.method !== ‘POST’) {
return res.status(405).json({ error: ‘Method not allowed — send POST with JSON body’ });
}

const { path, method = ‘GET’, body, token } = req.body || {};

if (!path) return res.status(400).json({ error: ‘Missing path’ });
if (!token) return res.status(400).json({ error: ‘Missing token’ });

const RD_BASE = ‘https://api.real-debrid.com/rest/1.0’;
const sep = path.includes(’?’) ? ‘&’ : ‘?’;
const targetUrl = `${RD_BASE}${path}${sep}auth_token=${encodeURIComponent(token)}`;

try {
const fetchOpts = {
method: method.toUpperCase(),
headers: { ‘Content-Type’: ‘application/x-www-form-urlencoded’ },
};
if (body) fetchOpts.body = body;

const rdRes = await fetch(targetUrl, fetchOpts);

// Forward status
res.status(rdRes.status);

// Forward content-type if present
const ct = rdRes.headers.get('content-type');
if (ct) res.setHeader('Content-Type', ct);

if (rdRes.status === 204 || rdRes.status === 202) {
  return res.end();
}

const text = await rdRes.text();
return res.end(text);

} catch (e) {
return res.status(502).json({ error: ’Proxy error: ’ + e.message });
}
}
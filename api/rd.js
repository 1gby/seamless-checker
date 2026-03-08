// /api/rd.js  — Vercel serverless proxy for Real-Debrid API
// Forwards any HTTP method (GET, POST, DELETE, PUT) to RD server-side, bypassing CORS entirely.
//
// Usage from client:
//   fetch(’/api/rd?path=/torrents/delete/ABC123&auth_token=TOKEN’, { method: ‘DELETE’ })
//
// The client passes:
//   ?path=   — the RD API path (e.g. /torrents/delete/ABC123)
//   All other query params are forwarded to RD as-is (e.g. auth_token)

const RD_BASE = ‘https://api.real-debrid.com/rest/1.0’;

export default async function handler(req, res) {
// Allow all origins (this is your own proxy, running server-side)
res.setHeader(‘Access-Control-Allow-Origin’, ‘*’);
res.setHeader(‘Access-Control-Allow-Methods’, ‘GET, POST, PUT, DELETE, OPTIONS’);
res.setHeader(‘Access-Control-Allow-Headers’, ‘Content-Type, Authorization’);

// Handle preflight
if (req.method === ‘OPTIONS’) {
return res.status(204).end();
}

// Extract the RD path from query, pass the rest of the params through
const { path, …rest } = req.query;
if (!path) {
return res.status(400).json({ error: ‘Missing ?path= parameter’ });
}

// Rebuild query string without “path”
const qs = new URLSearchParams(rest).toString();
const rdUrl = `${RD_BASE}${path}${qs ? '?' + qs : ''}`;

try {
const fetchOpts = {
method: req.method,
headers: { ‘User-Agent’: ‘Watcher/1.0’ },
};

```
// Forward body for POST/PUT
if (req.method === 'POST' || req.method === 'PUT') {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = Buffer.concat(chunks).toString();
  if (body) {
    fetchOpts.body = body;
    fetchOpts.headers['Content-Type'] = req.headers['content-type'] || 'application/x-www-form-urlencoded';
  }
}

const rdRes = await fetch(rdUrl, fetchOpts);

// RD returns 204 No Content on successful DELETE
if (rdRes.status === 204 || rdRes.status === 202) {
  return res.status(rdRes.status).end();
}

const text = await rdRes.text();
res.status(rdRes.status);
res.setHeader('Content-Type', 'application/json');
return res.send(text);
```

} catch (err) {
return res.status(500).json({ error: err.message });
}
}
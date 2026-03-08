// /api/rd.js — Vercel serverless proxy for Real-Debrid API
// Runs server-side, so no CORS issues. Supports GET, POST, PUT, DELETE.
//
// Client calls:  fetch(’/api/rd?path=/torrents/delete/ABC123&auth_token=TOKEN’, { method: ‘DELETE’ })
//   ?path       = RD API path, e.g. /torrents/delete/ABC123
//   &auth_token = RD API token (passed through to RD)
//   Any other query params are also forwarded to RD.

const RD_BASE = ‘https://api.real-debrid.com/rest/1.0’;

module.exports = async function handler(req, res) {
// CORS headers so the browser can call this freely
res.setHeader(‘Access-Control-Allow-Origin’, ‘*’);
res.setHeader(‘Access-Control-Allow-Methods’, ‘GET, POST, PUT, DELETE, OPTIONS’);
res.setHeader(‘Access-Control-Allow-Headers’, ‘Content-Type’);

if (req.method === ‘OPTIONS’) return res.status(204).end();

const { path, …rest } = req.query;
if (!path) return res.status(400).json({ error: ‘Missing ?path= parameter’ });

// path may itself contain a query string (e.g. /torrents?limit=50)
// Split it so we can merge all params cleanly
const [rdPath, rdPathQs] = path.split(’?’);
const mergedParams = new URLSearchParams(rdPathQs || ‘’);
for (const [k, v] of Object.entries(rest)) mergedParams.set(k, v);

const qs = mergedParams.toString();
const rdUrl = `${RD_BASE}${rdPath}${qs ? '?' + qs : ''}`;

try {
const fetchOpts = { method: req.method };

```
// Forward body for POST/PUT
if (req.method === 'POST' || req.method === 'PUT') {
  const body = await new Promise((resolve) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString()));
  });
  if (body) {
    fetchOpts.body = body;
    fetchOpts.headers = {
      'Content-Type': req.headers['content-type'] || 'application/x-www-form-urlencoded',
    };
  }
}

const rdRes = await fetch(rdUrl, fetchOpts);

// RD returns 204 No Content on successful DELETE
if (rdRes.status === 204 || rdRes.status === 202) {
  return res.status(rdRes.status).end();
}

const text = await rdRes.text();
res.setHeader('Content-Type', 'application/json');
return res.status(rdRes.status).send(text);
```

} catch (err) {
return res.status(500).json({ error: err.message });
}
};
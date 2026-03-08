// api/rd.js — Real-Debrid reverse proxy for Watcher
module.exports = async function handler(req, res) {
res.setHeader(‘Access-Control-Allow-Origin’, ‘*’);
res.setHeader(‘Access-Control-Allow-Methods’, ‘GET, POST, DELETE, OPTIONS’);
res.setHeader(‘Access-Control-Allow-Headers’, ‘Content-Type’);

if (req.method === ‘OPTIONS’) return res.status(200).end();
if (req.method !== ‘POST’) return res.status(405).json({ error: ‘Send POST with JSON body’ });

const { path, method = ‘GET’, body, token } = req.body || {};
if (!path)  return res.status(400).json({ error: ‘Missing path’ });
if (!token) return res.status(400).json({ error: ‘Missing token’ });

const sep = path.includes(’?’) ? ‘&’ : ‘?’;
const targetUrl = `https://api.real-debrid.com/rest/1.0${path}${sep}auth_token=${encodeURIComponent(token)}`;

try {
const fetchOpts = { method: method.toUpperCase() };
if (body) {
fetchOpts.body = body;
fetchOpts.headers = { ‘Content-Type’: ‘application/x-www-form-urlencoded’ };
}

const rdRes = await fetch(targetUrl, fetchOpts);

if (rdRes.status === 204 || rdRes.status === 202) {
  return res.status(rdRes.status).end();
}

const text = await rdRes.text();
const ct = rdRes.headers.get('content-type') || 'application/json';
return res.status(rdRes.status).setHeader('Content-Type', ct).send(text);

} catch (e) {
return res.status(502).json({ error: ’Proxy error: ’ + e.message });
}
};
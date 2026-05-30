export default async function handler(req, res) {
  try {
    void process.env.TMDB_API_KEY;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Send POST with JSON body' });

    let body = {};
    try {
      const raw = req.body;
      if (typeof raw === 'object' && raw !== null) body = raw;
      else if (typeof raw === 'string') body = JSON.parse(raw);
    } catch {}

    const { path, method = 'GET', postBody, token } = body;
    if (!path)  return res.status(400).json({ error: 'Missing path' });
    if (!token) return res.status(400).json({ error: 'Missing token' });

    const targetUrl = `https://api.torbox.app/v1/api${path}`;

    const fetchOpts = {
      method: method.toUpperCase(),
      headers: { 'Authorization': `Bearer ${token}` },
    };
    if (postBody) {
      fetchOpts.body = postBody;
      fetchOpts.headers['Content-Type'] = 'application/json';
    }

    const tbRes = await fetch(targetUrl, fetchOpts);
    if (tbRes.status === 204 || tbRes.status === 202) return res.status(tbRes.status).end();
    const text = await tbRes.text();
    return res.status(tbRes.status).send(text);

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

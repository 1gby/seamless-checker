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

    // TorBox's torrent-creation endpoints require multipart/form-data —
    // they accept an optional binary .torrent file field alongside the
    // magnet, which JSON can't represent. Every other TorBox route this
    // proxy talks to (mylist, user/me, requestdl, etc.) genuinely wants
    // JSON, so this only kicks in for the specific paths that need it —
    // add to this list if another multipart-only endpoint comes up.
    const MULTIPART_PATHS = ['/torrents/createtorrent', '/torrents/asynccreatetorrent'];
    const needsMultipart = postBody && MULTIPART_PATHS.some(p => path.startsWith(p));

    if (needsMultipart) {
      let fields = {};
      try { fields = JSON.parse(postBody); } catch {}
      const form = new FormData();
      for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined && value !== null) form.append(key, String(value));
      }
      fetchOpts.body = form;
      // Deliberately not setting Content-Type here — fetch() sets it
      // automatically for FormData, including the required boundary.
      // Setting it manually would break the multipart parsing on TorBox's end.
    } else if (postBody) {
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
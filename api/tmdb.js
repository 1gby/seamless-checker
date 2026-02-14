export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { endpoint, api, ...params } = req.query;
  
  if (!endpoint || !api) {
    return res.status(400).json({ error: 'Missing endpoint or api parameter' });
  }

  // Get the appropriate API key based on which API is being called
  let apiKey, baseUrl;
  
  if (api === 'tmdb') {
    apiKey = process.env.TMDB_API_KEY;
    baseUrl = 'https://api.themoviedb.org/3';
  } else if (api === 'fanart') {
    apiKey = process.env.FANART_API_KEY;
    baseUrl = 'https://webservice.fanart.tv/v3';
  } else {
    return res.status(400).json({ error: 'Invalid api parameter' });
  }

  // Build URL
  const url = new URL(`${baseUrl}${endpoint}`);
  url.searchParams.set('api_key', apiKey);
  
  // Add all other query params
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  try {
    const response = await fetch(url.toString());
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'API request failed' });
  }
}

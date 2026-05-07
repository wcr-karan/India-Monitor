export default async function handler(req, res) {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).send('URL parameter is required');
  }

  try {
    const response = await fetch(url);
    const data = await response.text();
    
    // Set headers to return XML and allow CORS
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    res.status(200).send(data);
  } catch (error) {
    console.error('[RSS Proxy] Error:', error.message);
    res.status(500).send('Error fetching RSS');
  }
}

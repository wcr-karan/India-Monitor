export default async function handler(req, res) {
  const { handle } = req.query;

  if (!handle) {
    return res.status(400).json({ videoId: null, error: 'handle parameter is required' });
  }

  try {
    const ytUrl = `https://www.youtube.com/@${handle}/live`;
    const response = await fetch(ytUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    const html = await response.text();

    // YouTube embeds the canonical video ID in multiple places; try each pattern
    const patterns = [
      /"videoId":"([a-zA-Z0-9_-]{11})"/,
      /watch\?v=([a-zA-Z0-9_-]{11})/,
      /\/embed\/([a-zA-Z0-9_-]{11})/,
    ];

    let videoId = null;
    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) {
        videoId = match[1];
        break;
      }
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({ videoId });
  } catch (error) {
    console.error('[YT Live] Error:', error.message);
    res.status(500).json({ videoId: null, error: error.message });
  }
}

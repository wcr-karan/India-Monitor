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

    // Check if the page actually indicates a LIVE stream
    const isLive =
      html.includes('"isLive":true') ||
      html.includes('"isLiveNow":true') ||
      html.includes('"isLiveContent":true') ||
      html.includes('BADGE_STYLE_TYPE_LIVE_NOW') ||
      html.includes('"style":"LIVE"') ||
      html.includes('"liveBroadcastDetails"');

    if (!isLive) {
      // Channel exists but is NOT currently live-streaming
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=60');
      return res.status(200).json({ videoId: null, live: false });
    }

    // Extract video ID — try canonical link first (most reliable), then JSON patterns
    const patterns = [
      /<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})">/,
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
    // Cache live results briefly so we don't hammer YouTube
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
    res.status(200).json({ videoId, live: true });
  } catch (error) {
    console.error('[YT Live] Error:', error.message);
    res.status(500).json({ videoId: null, error: error.message });
  }
}

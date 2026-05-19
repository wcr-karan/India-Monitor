export default async function handler(req, res) {
  const { handle } = req.query;

  if (!handle) {
    return res.status(400).json({ videoId: null, error: 'handle parameter is required' });
  }

  // Set CORS headers early
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const ytUrl = `https://www.youtube.com/@${handle}/live`;
    const response = await fetch(ytUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      redirect: 'follow',
    });
    const html = await response.text();

    // ── Strategy 1: Parse ytInitialPlayerResponse (most reliable) ──
    // This is the actual player state — contains the video ID and live status
    const playerMatch = html.match(
      /ytInitialPlayerResponse\s*=\s*(\{.+?\});/s
    );
    if (playerMatch) {
      try {
        const playerData = JSON.parse(playerMatch[1]);
        const videoDetails = playerData?.videoDetails;
        if (videoDetails && (videoDetails.isLive === true || videoDetails.isLiveContent === true)) {
          res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
          return res.status(200).json({ videoId: videoDetails.videoId, live: true });
        }
      } catch (_) {
        // JSON parse failed, fall through to next strategy
      }
    }

    // ── Strategy 2: Look for live video ID near live indicators ──
    // Find videoId that appears close to isLive/isLiveNow markers
    const liveVideoMatch = html.match(
      /"videoId"\s*:\s*"([a-zA-Z0-9_-]{11})"[^}]*?"isLive"\s*:\s*true/
    );
    if (liveVideoMatch) {
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
      return res.status(200).json({ videoId: liveVideoMatch[1], live: true });
    }

    // ── Strategy 3: Check canonical URL + global live markers ──
    const hasLiveMarkers =
      html.includes('"isLive":true') ||
      html.includes('"isLiveNow":true') ||
      html.includes('BADGE_STYLE_TYPE_LIVE_NOW');

    if (hasLiveMarkers) {
      // Extract from canonical link (this is the video the page resolved to)
      const canonicalMatch = html.match(
        /<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})">/
      );
      if (canonicalMatch) {
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
        return res.status(200).json({ videoId: canonicalMatch[1], live: true });
      }
    }

    // No live stream found
    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=60');
    return res.status(200).json({ videoId: null, live: false });
  } catch (error) {
    console.error('[YT Live] Error:', error.message);
    res.status(500).json({ videoId: null, error: error.message });
  }
}

import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    {
      name: 'api-proxy',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

          // --- RSS proxy ---
          if (url.pathname === '/api/rss-proxy') {
            const feedUrl = url.searchParams.get('url');
            if (feedUrl) {
              try {
                console.log(`[RSS Proxy] Fetching: ${feedUrl}`);
                const response = await fetch(feedUrl);
                const data = await response.text();
                res.setHeader('Content-Type', 'application/xml');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(data);
                return;
              } catch (e) {
                console.error(`[RSS Proxy] Error: ${e.message}`);
                res.statusCode = 500;
                res.end('Error fetching RSS');
                return;
              }
            }
          }

          // --- YouTube live video ID scraper ---
          if (url.pathname === '/api/youtube-live') {
            const handle = url.searchParams.get('handle');
            if (handle) {
              try {
                console.log(`[YT Live] Fetching live ID for @${handle}`);
                const ytUrl = `https://www.youtube.com/@${handle}/live`;
                const response = await fetch(ytUrl, {
                  headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                  },
                  redirect: 'follow',
                });
                const html = await response.text();

                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');

                // Strategy 1: Parse ytInitialPlayerResponse (most reliable)
                const playerMatch = html.match(/ytInitialPlayerResponse\s*=\s*(\{.+?\});/s);
                if (playerMatch) {
                  try {
                    const playerData = JSON.parse(playerMatch[1]);
                    const vd = playerData?.videoDetails;
                    if (vd && (vd.isLive === true || vd.isLiveContent === true)) {
                      res.end(JSON.stringify({ videoId: vd.videoId, live: true }));
                      return;
                    }
                  } catch (_) { /* parse failed, fall through */ }
                }

                // Strategy 2: videoId near isLive marker
                const liveVideoMatch = html.match(/"videoId"\s*:\s*"([a-zA-Z0-9_-]{11})"[^}]*?"isLive"\s*:\s*true/);
                if (liveVideoMatch) {
                  res.end(JSON.stringify({ videoId: liveVideoMatch[1], live: true }));
                  return;
                }

                // Strategy 3: Canonical URL + global live markers
                const hasLive = html.includes('"isLive":true') || html.includes('"isLiveNow":true') || html.includes('BADGE_STYLE_TYPE_LIVE_NOW');
                if (hasLive) {
                  const cm = html.match(/<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})">/);
                  if (cm) {
                    res.end(JSON.stringify({ videoId: cm[1], live: true }));
                    return;
                  }
                }

                res.end(JSON.stringify({ videoId: null, live: false }));
                return;
              } catch (e) {
                console.error(`[YT Live] Error: ${e.message}`);
                res.statusCode = 500;
                res.end(JSON.stringify({ videoId: null, error: e.message }));
                return;
              }
            }
          }

          next();
        });
      },
    },
  ],
  server: {
    port: 5174,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
});

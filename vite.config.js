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
                  if (match) { videoId = match[1]; break; }
                }

                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify({ videoId }));
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

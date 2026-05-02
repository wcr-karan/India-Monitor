import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    {
      name: 'rss-proxy',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
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
                return; // Stop processing
              } catch (e) {
                console.error(`[RSS Proxy] Error: ${e.message}`);
                res.statusCode = 500;
                res.end('Error fetching RSS');
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

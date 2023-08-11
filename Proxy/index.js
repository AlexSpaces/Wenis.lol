const http = require('http');
const https = require('https');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const query = parsedUrl.query;
  const proxyUrl = query.url;

  if (!proxyUrl) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Missing URL parameter');
    return;
  }

  const requestOptions = url.parse(proxyUrl);
  const proxyReq = https.request(requestOptions, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  req.pipe(proxyReq, { end: true });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});

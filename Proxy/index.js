const http = require('http');
const https = require('https');
const url = require('url');

const server = http.createServer((req, res) => {
  const queryData = url.parse(req.url, true).query;
  const targetUrl = queryData.url;

  if (!targetUrl) {
    res.writeHead(400, {'Content-Type': 'text/plain'});
    res.end('Missing target URL');
    return;
  }

  const requestOptions = {
    method: req.method,
    headers: req.headers
  };

  const proxyReq = https.request(targetUrl, requestOptions, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  req.pipe(proxyReq, { end: true });
});

const port = 8080;
server.listen(port, () => {
  console.log(`Proxy server is listening on port ${port}`);
});

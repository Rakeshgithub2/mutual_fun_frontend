const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`Received request: ${req.method} ${req.url}`);

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.url === '/test') {
    res.writeHead(200);
    res.end(
      JSON.stringify({
        message: 'Simple test server working!',
        timestamp: new Date().toISOString(),
      })
    );
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

const PORT = 3004;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Simple test server running on http://localhost:${PORT}`);
  console.log(`✅ Test endpoint: http://localhost:${PORT}/test`);
});

server.on('error', (error) => {
  console.error('❌ Server error:', error);
});

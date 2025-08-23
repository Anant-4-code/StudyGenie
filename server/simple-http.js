const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Simple HTTP server is running!');});

const PORT = 5001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

// Handle errors
server.on('error', (error) => {
  console.error('Server error:', error);
});

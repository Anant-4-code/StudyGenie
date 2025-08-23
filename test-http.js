const http = require('http');
const fs = require('fs');

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', '*');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Simple response
  if (req.url === '/' || req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      node: process.version,
      platform: process.platform,
      memory: process.memoryUsage()
    }, null, 2));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

// Start the server
const PORT = 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
  
  // Write a test file with the server URL
  fs.writeFileSync('test-server-url.txt', `http://localhost:${PORT}`);
  
  // Log to a file for debugging
  const logStream = fs.createWriteStream('server.log', { flags: 'a' });
  logStream.write(`Server started at ${new Date().toISOString()}\n`);
  logStream.write(`Node.js ${process.version}\n`);
  logStream.write(`Platform: ${process.platform} ${process.arch}\n\n`);
  
  // Log requests
  const originalWrite = process.stdout.write;
  process.stdout.write = function() {
    logStream.write(Array.from(arguments).join(' ') + '\n');
    return originalWrite.apply(process.stdout, arguments);
  };
});

// Handle errors
server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server stopped');
    process.exit(0);
  });
});

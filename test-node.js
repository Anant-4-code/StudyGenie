// Simple test script to verify Node.js execution
console.log('Node.js test script running');
console.log('Node.js version:', process.version);
console.log('Platform:', process.platform, process.arch);
console.log('Current working directory:', process.cwd());

// Test file system access
const fs = require('fs');
try {
  fs.writeFileSync('test-file.txt', 'Test file created successfully');
  console.log('Successfully created test file');
} catch (error) {
  console.error('File system error:', error.message);
}

// Test HTTP server
const http = require('http');
const server = http.createServer((req, res) => {
  res.end('Hello from test server!');});

server.listen(0, 'localhost', () => {
  const port = server.address().port;
  console.log(`Test server running at http://localhost:${port}`);
  
  // Test HTTP request
  const req = http.get(`http://localhost:${port}`, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log('HTTP test response:', data.trim());
      server.close();
    });
  });
  
  req.on('error', (err) => {
    console.error('HTTP test error:', err.message);
    server.close();
  });
});

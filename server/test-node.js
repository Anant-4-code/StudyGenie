// Simple test script to verify Node.js is working
console.log('Node.js is working!');
console.log('Version:', process.version);
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);

// Test basic functionality
try {
  const http = require('http');
  const fs = require('fs');
  const path = require('path');
  
  console.log('\nBasic modules loaded successfully');
  
  // Test file system access
  const testFile = path.join(__dirname, 'test.txt');
  fs.writeFileSync(testFile, 'Test content');
  console.log('File system access: OK');
  
  // Test HTTP server
  const server = http.createServer((req, res) => {
    res.end('Test server is working!');
  });
  
  server.listen(0, '127.0.0.1', () => {
    const port = server.address().port;
    console.log(`Test HTTP server running on port ${port}`);
    
    // Test HTTP client
    http.get(`http://127.0.0.1:${port}`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('HTTP client test:', data.trim());
        
        // Clean up
        server.close();
        fs.unlinkSync(testFile);
        console.log('\nAll tests completed successfully!');
      });
    });
  });
  
} catch (error) {
  console.error('Test failed:', error);
  process.exit(1);
}

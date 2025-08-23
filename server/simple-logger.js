const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logFile = path.join(logsDir, 'server-debug.log');

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage.trim());
  fs.appendFileSync(logFile, logMessage);
}

// Log basic information
log('=== Starting Server Debug ===');
log(`Node.js Version: ${process.version}`);
log(`Platform: ${process.platform} ${process.arch}`);
log(`Current directory: ${__dirname}`);

// Test file system access
try {
  const testFile = path.join(__dirname, 'logs', 'test-write.txt');
  fs.writeFileSync(testFile, 'Test write operation');
  fs.unlinkSync(testFile);
  log('File system access: OK');
} catch (error) {
  log(`File system error: ${error.message}`);
}

// Test HTTP server
const http = require('http');
const PORT = 5002; // Changed to 5002 to avoid conflicts

const server = http.createServer((req, res) => {
  const clientIP = req.connection.remoteAddress;
  log(`Request from ${clientIP}: ${req.method} ${req.url}`);
  
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from StudyGenie!');
});

server.on('error', (error) => {
  log(`Server error: ${error.message}`);
  if (error.code === 'EADDRINUSE') {
    log(`Port ${PORT} is already in use`);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  log(`Server running at http://localhost:${PORT}`);
  log('Press Ctrl+C to stop');
});

// Handle process termination
process.on('SIGINT', () => {
  log('Shutting down server...');
  server.close(() => {
    log('Server stopped');
    process.exit(0);
  });
});

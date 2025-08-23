// Simple test script to verify output
console.log('=== Test Script Output ===');
console.log('Current time:', new Date().toISOString());
console.log('Node.js version:', process.version);
console.log('Platform:', process.platform, process.arch);
console.log('Current directory:', process.cwd());

// Test file system access
const fs = require('fs');
try {
  fs.writeFileSync('test-output.txt', 'Test file created at: ' + new Date().toISOString());
  console.log('Successfully created test file');
} catch (error) {
  console.error('File system error:', error.message);
}

// Exit after a short delay
setTimeout(() => {
  console.log('Test script completed');
  process.exit(0);
}, 1000);

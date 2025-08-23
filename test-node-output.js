// Simple test script to verify Node.js functionality
const fs = require('fs');
const path = require('path');

const output = [];

// Test basic functionality
output.push('=== Node.js Test Script ===');
output.push(`Current time: ${new Date().toISOString()}`);
output.push(`Node.js version: ${process.version}`);
output.push(`Platform: ${process.platform} ${process.arch}`);
output.push(`Current directory: ${process.cwd()}`);

// Test file system access
try {
  const testFile = path.join(__dirname, 'test-node-output.txt');
  fs.writeFileSync(testFile, 'Test file created at: ' + new Date().toISOString());
  output.push('✓ Successfully created test file');
} catch (error) {
  output.push(`✗ File system error: ${error.message}`);
}

// Write output to file
const outputFile = path.join(__dirname, 'test-node-output.log');
fs.writeFileSync(outputFile, output.join('\n'));

console.log('Test script completed. Output saved to test-node-output.log');

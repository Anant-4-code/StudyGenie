// Test script to verify server functionality
const http = require('http');
const fs = require('fs');

// Test server connection
function testServer() {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:3001/status', (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({
            success: true,
            status: res.statusCode,
            data: result
          });
        } catch (error) {
          resolve({
            success: false,
            error: 'Invalid JSON response',
            data: data
          });
        }
      });
    });
    
    req.on('error', (error) => {
      resolve({
        success: false,
        error: error.message
      });
    });
    
    req.end();
  });
}

// Run the test
async function runTest() {
  console.log('Testing server connection...');
  
  try {
    const result = await testServer();
    
    // Save test results
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      success: result.success,
      ...(result.success ? {
        status: result.status,
        nodeVersion: result.data?.node,
        platform: result.data?.platform
      } : {
        error: result.error
      })
    };
    
    // Append to test log
    const logFile = 'test-results.log';
    const logData = fs.existsSync(logFile) 
      ? JSON.parse(fs.readFileSync(logFile, 'utf-8')) 
      : [];
    
    logData.push(logEntry);
    fs.writeFileSync(logFile, JSON.stringify(logData, null, 2));
    
    // Output results
    if (result.success) {
      console.log('✅ Server is running and responding correctly');
      console.log('Status:', result.status);
      console.log('Node.js:', result.data.node);
      console.log('Platform:', result.data.platform);
    } else {
      console.error('❌ Server test failed:', result.error);
      if (result.data) console.log('Response:', result.data);
    }
    
    console.log(`\nResults saved to ${logFile}`);
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

// Run the test
runTest();

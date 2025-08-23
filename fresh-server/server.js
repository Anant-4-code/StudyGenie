// Simple Express server for testing
const express = require('express');
const app = express();
const PORT = 3000;

// Basic route
app.get('/', (req, res) => {
  res.send('Hello from StudyGenie Server!');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop the server');
});

// Handle server errors
app.on('error', (error) => {
  console.error('Server error:', error);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  process.exit(0);
});

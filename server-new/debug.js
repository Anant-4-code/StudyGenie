// Enable strict mode for better error handling
'use strict';

console.log('=== Starting StudyGenie Server ===');
console.log('Node.js version:', process.version);
console.log('Platform:', process.platform, process.arch);
console.log('Current working directory:', process.cwd());

// Log unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('\n=== UNHANDLED REJECTION ===');
  console.error('Reason:', reason);
  console.error('Promise:', promise);
  console.error('==========================\n');
});

// Log uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('\n=== UNCAUGHT EXCEPTION ===');
  console.error(error);
  console.error('========================\n');
  process.exit(1);
});

// Try to load environment variables
console.log('\n[1/6] Loading environment variables...');
try {
  require('dotenv').config();
  console.log('✓ Environment variables loaded');
} catch (error) {
  console.error('✗ Error loading environment variables:', error);
  process.exit(1);
}

// Log environment variables (except sensitive ones)
console.log('\nEnvironment:');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('- PORT:', process.env.PORT || '5001 (default)');
console.log('- MONGO_URI:', process.env.MONGO_URI ? '*** (set)' : 'mongodb://localhost:27017/studygenie (default)');

// Try to require express
console.log('\n[2/6] Loading dependencies...');
let express;
try {
  express = require('express');
  console.log('✓ Express loaded');
  
  // Load other core dependencies
  const mongoose = require('mongoose');
  const cors = require('cors');
  const helmet = require('helmet');
  console.log('✓ Core dependencies loaded');
  
} catch (error) {
  console.error('✗ Error loading dependencies:', error);
  process.exit(1);
}

// Initialize Express app
console.log('\n[3/6] Initializing Express app...');
const app = express();
const PORT = process.env.PORT || 5001;

// Configure middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use(cors());
app.use(helmet());
console.log('✓ Express middleware configured');

// Test route
console.log('\n[4/6] Setting up routes...');
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'StudyGenie API is running!',
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    platform: process.platform,
    memoryUsage: process.memoryUsage()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

console.log('✓ Routes configured');

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });});

// Start server
console.log('\n[5/6] Starting server...');
const server = app.listen(PORT, '0.0.0.0', () => {
  const host = server.address().address;
  const port = server.address().port;
  
  console.log('\n=== SERVER STARTED SUCCESSFULLY ===');
  console.log(`Server running at http://${host}:${port}`);
  console.log('Press Ctrl+C to stop the server');
  console.log('==================================\n');
  
  // Try to connect to MongoDB
  const mongoose = require('mongoose');
  const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/studygenie';
  
  console.log('\n[6/6] Connecting to MongoDB...');
  console.log(`MongoDB URI: ${MONGODB_URI}`);
  
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
  })
  .then(() => console.log('✓ MongoDB connected successfully'))
  .catch(err => {
    console.error('✗ MongoDB connection error:', err.message);
    console.log('\nNOTE: The server is running, but could not connect to MongoDB.');
    console.log('Some features may not work without a database connection.');
  });
});

// Handle server errors
server.on('error', (error) => {
  console.error('\n=== SERVER ERROR ===');
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use by another process.`);
    console.log('\nTo fix this, you can:');
    console.log(`1. Stop the process using port ${PORT}`);
    console.log('2. Use a different port by setting the PORT environment variable');
    console.log('   Example: set PORT=5002 && node debug.js');
  } else {
    console.error('Server error:', error);
  }
  console.log('\nExiting...');
  process.exit(1);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nReceived SIGINT. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

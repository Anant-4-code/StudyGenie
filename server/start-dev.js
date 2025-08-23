// Set the port to 5001 to avoid conflicts
process.env.PORT = 5001;
process.env.NODE_ENV = 'development';

// Load environment variables
require('dotenv').config({ path: '.env' });

// Start the server
require('./index.js');

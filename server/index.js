const fs = require('fs');
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const { createClient } = require('redis');
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');
const { sanitizeInput } = require('./middleware/validators');
const logger = require('./utils/logger');

// Load environment variables from .env file
dotenv.config({ path: './.env' });

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create uploads directory if it doesn't exist
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://*.googleapis.com'],
      frameSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Enable CORS with multiple origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5001',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
  whitelist: [
    'duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price'
  ]
}));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(`[${req.requestTime}] ${req.method} ${req.originalUrl}`);
  next();
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is working!',
    environment: process.env.NODE_ENV || 'development',
    mongoConnected: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// --- API Routes ---
// Public routes
app.use('/api/v1/auth', require('./routes/auth'));

// Protected routes (require authentication)
const { authenticate } = require('./middleware/auth');
app.use(authenticate); // Apply authentication to all routes below

// API v1 routes
const router = express.Router();

// Mount all v1 routes
router.use('/users', require('./routes/userRoutes'));
router.use('/chat', require('./routes/basicChat'));
router.use('/sources', require('./routes/sources'));
router.use('/roadmap', require('./routes/roadmap'));
router.use('/tools', require('./routes/tools'));
router.use('/auth', require('./routes/auth'));

// Chat V2 routes - keep both paths for backward compatibility
router.use('/chat/v2', require('./routes/chatV2'));
router.use('/chatV2', require('./routes/chatV2'));

// Mount the router
app.use('/api/v1', router);

// Legacy routes (consider deprecating these)
const legacyRouter = express.Router();
legacyRouter.use('/chat', require('./routes/chat'));
legacyRouter.use('/sessions', require('./routes/sessions'));
legacyRouter.use('/sources', require('./routes/sources'));
legacyRouter.use('/learning', require('./routes/learning'));
legacyRouter.use('/gemini', require('./routes/gemini'));
legacyRouter.use('/tools', require('./routes/tools'));
legacyRouter.use('/stats', require('./routes/stats'));
app.use('/api', legacyRouter);

// --- Health Check Route ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});

// --- 404 Route ---
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token. Please log in again!'
    });
  }
  
  // Handle token expiration
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      message: 'Your token has expired! Please log in again.'
    });
  }
  
  // Handle validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(el => el.message);
    return res.status(400).json({
      status: 'fail',
      message: `Invalid input data. ${errors.join('. ')}`
    });
  }

  // Default error handling
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  
  res.status(statusCode).json({
    status,
    message: err.message || 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack, error: err })
  });
});

// --- 404 Not Found Middleware ---
app.use((req, res) => {
    res.status(404).send('API endpoint not found');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

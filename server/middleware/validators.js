const { body, validationResult } = require('express-validator');
const { checkSchema } = require('express-validator');

// Common validation rules
exports.validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        param: err.param,
        message: err.msg,
        location: err.location
      }))
    });
  };
};

// Authentication validations
exports.authValidation = {
  register: [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2-50 characters'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
      .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
      .matches(/\d/).withMessage('Password must contain at least one number')
  ],
  login: [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email'),
    body('password')
      .notEmpty().withMessage('Password is required')
  ]
};

// AI Service validations
exports.aiValidation = {
  generateContent: [
    body('prompt')
      .trim()
      .notEmpty().withMessage('Prompt is required')
      .isLength({ max: 10000 }).withMessage('Prompt must be less than 10000 characters'),
    body('type')
      .optional()
      .isIn(['basic', 'roadmap', 'quiz', 'flashcards']).withMessage('Invalid content type')
  ],
  processDocument: [
    body('file')
      .custom((value, { req }) => {
        if (!req.file) {
          throw new Error('File is required');
        }
        const allowedTypes = ['application/pdf', 'text/plain'];
        if (!allowedTypes.includes(req.file.mimetype)) {
          throw new Error('Only PDF and text files are allowed');
        }
        return true;
      })
  ]
};

// User input sanitization
exports.sanitizeInput = (req, res, next) => {
  // Sanitize all string fields in the request body
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }
  next();
};

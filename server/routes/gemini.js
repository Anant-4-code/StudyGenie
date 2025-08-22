const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService'); // Use geminiService
const { body, validationResult } = require('express-validator');

/**
 * @route   POST /api/gemini/generate
 * @desc    Generate study materials using Gemini
 * @access  Public
 */
router.post(
  '/generate',
  [
    body('content', 'Content is required').notEmpty(),
    body('type', 'Type must be one of: quiz, summary, flashcards').isIn(['quiz', 'summary', 'flashcards'])
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, type } = req.body;

    try {
      // Use geminiService for generating study materials
      const result = await geminiService.generateStudyMaterials(content, type);
      res.json({
        success: true,
        type,
        data: result
      });
    } catch (error) {
      console.error('Error in generateStudyMaterials:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate study materials',
        details: error.message
      });
    }
  }
);

module.exports = router;

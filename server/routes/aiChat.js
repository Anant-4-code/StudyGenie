const express = require('express');
const AIService = require('../services/aiService');
const router = express.Router();

/**
 * @route   POST /api/v1/ai/chat
 * @desc    Enhanced chat endpoint with session management and context awareness
 * @access  Public (consider adding auth middleware if needed)
 */
router.post('/chat', async (req, res) => {
  try {
    const { sessionId, message, context = {}, messageHistory = [] } = req.body;
    
    // Validate required fields
    if (!message?.trim()) {
      return res.status(400).json({ 
        success: false,
        error: 'Message is required' 
      });
    }

    // Generate a session ID if not provided
    const chatSessionId = sessionId || `sess_${Date.now()}`;

    try {
      // Get response from AI service with full context
      const response = await AIService.chat(
        chatSessionId,
        message.trim(),
        messageHistory,
        context
      );

      // Return the response with session ID for client to maintain context
      res.json({
        success: true,
        sessionId: chatSessionId,
        reply: response,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('AI Chat Error:', error);
      throw error; // Will be caught by the outer catch
    }

  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process chat message',
      message: error.message || 'An unexpected error occurred'
    });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const geminiService = require('../services/gemini15Service');
const { sessionSources } = require('../utils/sessionStore');

/**
 * Endpoint for basic chat interactions with the AI
 * Supports both text and file uploads
 */
router.post('/basic', async (req, res) => {
  try {
    const { message, sessionId = 'default-session', file } = req.body;
    
    if (!message && !file) {
      return res.status(400).json({
        success: false,
        error: 'Either message or file is required'
      });
    }

    // Get session context if available
    const sessionContext = sessionSources[sessionId] ? 
      `Previous context: ${JSON.stringify(sessionSources[sessionId])}` : '';
    
    // Prepare the prompt with context
    const prompt = `${sessionContext}\n\nUser: ${message}`;
    
    let response;
    
    // Handle file upload if present
    if (file) {
      response = await geminiService.processDocument(file, prompt);
    } else {
      response = await geminiService.processText(prompt);
    }
    
    // Update session with the new context
    if (!sessionSources[sessionId]) {
      sessionSources[sessionId] = [];
    }
    
    sessionSources[sessionId].push({
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    });
    
    sessionSources[sessionId].push({
      role: 'assistant',
      content: response.summary || response,
      timestamp: new Date().toISOString()
    });
    
    // Return the response with structured data
    res.json({
      success: true,
      data: {
        response: response.summary || response,
        ...(response.keyPoints && { keyPoints: response.keyPoints }),
        ...(response.flashcards && { flashcards: response.flashcards }),
        ...(response.quiz && { quiz: response.quiz })
      }
    });
    
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process chat message',
      details: error.message
    });
  }
});

module.exports = router;

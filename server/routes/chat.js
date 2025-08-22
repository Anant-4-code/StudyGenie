const express = require('express');
const AIService = require('../services/aiService');
const router = express.Router();
// const { sessionSources } = require('./sources'); // Remove this import

// Basic chat endpoint - no longer directly used for basic chat with source, but keeping for other potential uses
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const context = {
      type: 'basic',
      temperature: 0.7,
      maxTokens: 800
    };

    const reply = await AIService.generateResponse(message.trim(), context.type);
    
    res.json({ 
      reply,
      timestamp: new Date().toISOString(),
      status: 'success'
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate response',
      message: 'Please try again later'
    });
  }
});

// Basic chat endpoint using session ID for source context
router.post('/message', async (req, res) => {
  try {
    const { message, sessionId } = req.body; // Only message and sessionId needed
    
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!sessionId) {
        return res.status(400).json({ error: 'Session ID is required for source-aware chat.' });
    }

    // AIService.generateSessionResponse will now fetch source content using sessionId
    const reply = await AIService.generateSessionResponse(sessionId, message.trim());
    
    res.json({ 
      reply,
      sessionId,
      timestamp: new Date().toISOString(),
      status: 'success'
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate response',
      message: 'Please try again later'
    });
  }
});

// Enhanced tutoring session endpoint using session ID for source context
router.post('/session', async (req, res) => {
  try {
    const { message, sessionId, subject, studentLevel = 'medium', previousContext = '' } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!sessionId) {
        return res.status(400).json({ error: 'Session ID is required for advanced chat.' });
    }

    // AIService.generateSessionResponse will now fetch source content using sessionId
    const reply = await AIService.generateSessionResponse(sessionId, message.trim(), subject, studentLevel, previousContext); // Pass session details for context
    
    res.json({ 
      reply,
      sessionId,
      subject,
      studentLevel,
      timestamp: new Date().toISOString(),
      status: 'success',
      context: 'session-tutoring'
    });
  } catch (error) {
    console.error('Session Tutoring Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate tutoring response',
      message: 'Please try again later'
    });
  }
});

module.exports = router;





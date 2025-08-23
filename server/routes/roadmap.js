const express = require('express');
const AIService = require('../services/aiService');
const router = express.Router();

// Generate learning roadmap
router.post('/generate', async (req, res) => {
  try {
    const { sessionId, topic, level = 'beginner', timeframe = '4 weeks', goals = [], description = '', preferences = {} } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const roadmapParams = {
      topic,
      level,
      timeframe,
      goals,
      description,
      preferences
    };

    const roadmap = await AIService.generateRoadmap(sessionId, roadmapParams);

    res.json({
      roadmap,
      sessionId,
      topic,
      level,
      timeframe,
      goals,
      description,
      preferences,
      timestamp: new Date().toISOString(),
      status: 'success'
    });
  } catch (error) {
    console.error('Roadmap Generation Error:', error);
    res.status(500).json({
      error: 'Failed to generate roadmap',
      message: 'Please try again later',
      details: error.message
    });
  }
});

// Get roadmap progress
router.get('/progress/:sessionId', (req, res) => {
  // Placeholder for progress tracking
  res.json({
    sessionId: req.params.sessionId,
    progress: 0,
    completedSteps: [],
    currentStep: 1,
    totalSteps: 10
  });
});

module.exports = router;






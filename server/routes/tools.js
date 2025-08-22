const express = require('express');
const AIService = require('../services/aiService');
const router = express.Router();

// Generate quiz questions
router.post('/generate-quiz', async (req, res) => {
  try {
    const { topic, difficulty = 'medium', questionCount = 5, questionType = 'multiple-choice' } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const { response: quiz, aiProvider } = await AIService.generateQuiz(topic, {
      difficulty,
      questionCount,
      questionType
    });

    res.json({
      quiz,
      topic,
      difficulty,
      questionCount,
      questionType,
      aiProvider,
      timestamp: new Date().toISOString(),
      status: 'success'
    });
  } catch (error) {
    console.error('Quiz Generation Error:', error);
    res.status(500).json({
      error: 'Failed to generate quiz',
      message: 'Please try again later'
    });
  }
});

// Generate flashcards using enhanced Gemini AI
router.post('/generate-flashcards', async (req, res) => {
  try {
    const { topic, cardCount = 10, difficulty = 'medium' } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const prompt = `Create ${cardCount} educational flashcards about ${topic}. Format as JSON with front/back pairs, include memory tips and difficulty indicators.`;
    
    const context = {
      type: 'explanation',
      subject: topic,
      difficulty,
      maxTokens: 1000,
      temperature: 0.8
    };

    const { response: flashcards, aiProvider } = await AIService.generateResponse(prompt, context);

    res.json({
      flashcards,
      topic,
      cardCount,
      difficulty,
      aiProvider,
      timestamp: new Date().toISOString(),
      status: 'success'
    });
  } catch (error) {
    console.error('Flashcard Generation Error:', error);
    res.status(500).json({
      error: 'Failed to generate flashcards',
      message: 'Please try again later'
    });
  }
});

// Generate practice problems using enhanced Gemini AI
router.post('/generate-problems', async (req, res) => {
  try {
    const { topic, difficulty = 'medium', problemCount = 5, includeSteps = true } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const { response: problems, aiProvider } = await AIService.generatePracticeProblems(topic, {
      difficulty,
      problemCount,
      includeSteps
    });

    res.json({
      problems,
      topic,
      difficulty,
      problemCount,
      includeSteps,
      aiProvider,
      timestamp: new Date().toISOString(),
      status: 'success'
    });
  } catch (error) {
    console.error('Problem Generation Error:', error);
    res.status(500).json({
      error: 'Failed to generate problems',
      message: 'Please try again later'
    });
  }
});

// Generate rapid fire questions using Gemini AI
router.post('/generate-rapidfire', async (req, res) => {
  try {
    const { topic, difficulty = 'medium', questionCount = 10, timeLimit = 30 } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const { response: rapidFire, aiProvider } = await AIService.generateRapidFire(topic, {
      difficulty,
      questionCount,
      timeLimit
    });

    res.json({
      rapidFire,
      topic,
      difficulty,
      questionCount,
      timeLimit,
      aiProvider,
      timestamp: new Date().toISOString(),
      status: 'success'
    });
  } catch (error) {
    console.error('Rapid Fire Generation Error:', error);
    res.status(500).json({
      error: 'Failed to generate rapid fire questions',
      message: 'Please try again later'
    });
  }
});

// Generate personalized study plan using Gemini AI
router.post('/generate-study-plan', async (req, res) => {
  try {
    const { goals, timeAvailable = '1 hour/day', learningStyle = 'mixed', currentLevel = 'beginner' } = req.body;
    
    if (!goals) {
      return res.status(400).json({ error: 'Learning goals are required' });
    }

    const { response: studyPlan, aiProvider } = await AIService.generateStudyPlan(goals, {
      timeAvailable,
      learningStyle,
      currentLevel
    });

    res.json({
      studyPlan,
      goals,
      timeAvailable,
      learningStyle,
      currentLevel,
      aiProvider,
      timestamp: new Date().toISOString(),
      status: 'success'
    });
  } catch (error) {
    console.error('Study Plan Generation Error:', error);
    res.status(500).json({
      error: 'Failed to generate study plan',
      message: 'Please try again later'
    });
  }
});

router.get('/mindmap', (req, res) => {
  res.json({ mindmap: 'placeholder' });
});

router.get('/quiz', (req, res) => {
  res.json({ questions: [] });
});

module.exports = router;






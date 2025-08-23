const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');
const { v4: uuidv4 } = require('uuid');
const geminiService = require('../services/gemini15Service');
const { sessionSources } = require('../utils/sessionStore');

const router = express.Router();

// Configure Multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

/**
 * Helper function to extract readable text from HTML content.
 * @param {string} html - The HTML content to parse.
 * @returns {string} - The extracted readable text.
 */
const extractReadableText = (html) => {
  try {
    const dom = new JSDOM(html);
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
    return article ? article.textContent : '';
  } catch (error) {
    console.error('Error extracting text from HTML:', error);
    return '';
  }
};

/**
 * Helper function to process text content with chunking for large inputs
 */
const processTextWithChunking = async (text, prompt) => {
  const CHUNK_SIZE = 20000; // Characters per chunk
  const chunks = [];
  
  // Split text into manageable chunks
  for (let i = 0; i < text.length; i += CHUNK_SIZE) {
    chunks.push(text.substring(i, i + CHUNK_SIZE));
  }

  // Process first chunk to get the structure
  const initialResult = await geminiService.processText(chunks[0], prompt);
  
  // If there's only one chunk, return the result
  if (chunks.length === 1) return initialResult;

  // Process remaining chunks and merge results
  for (let i = 1; i < chunks.length; i++) {
    const chunkResult = await geminiService.processText(chunks[i], 
      `Continue analyzing this content and update the previous analysis. ` +
      `Focus on adding new information and insights.`
    );
    
    // Merge results (simple concatenation for arrays, you might want something smarter)
    if (chunkResult.summary) {
      initialResult.summary += '\n\n' + chunkResult.summary;
    }
    if (chunkResult.keyPoints) {
      initialResult.keyPoints = [...new Set([...initialResult.keyPoints, ...chunkResult.keyPoints])];
    }
    if (chunkResult.flashcards) {
      initialResult.flashcards = [...initialResult.flashcards, ...chunkResult.flashcards];
    }
    if (chunkResult.quiz) {
      initialResult.quiz = [...initialResult.quiz, ...chunkResult.quiz];
    }
  }

  return initialResult;
};

/**
 * Unified endpoint for uploading and processing various types of learning sources.
 * Supports file (PDF), link (URL), and text inputs.
 */
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const sessionId = req.body.sessionId || 'default-session';
    let result;
    
    // Handle file upload
    if (req.file) {
      if (req.file.mimetype === 'application/pdf') {
        // Process PDF file directly with Gemini 1.5
        result = await geminiService.processDocument(req.file, 
          'Please analyze this document and create comprehensive study materials. ' +
          'Include a detailed summary, key points, flashcards, and a quiz.'
        );
      } else {
        return res.status(400).json({ 
          success: false, 
          error: 'Unsupported file type. Only PDF files are supported.' 
        });
      }
    } 
    // Handle URL
    else if (req.body.url) {
      try {
        const response = await axios.get(req.body.url);
        const text = extractReadableText(response.data);
        result = await processTextWithChunking(text,
          `Please analyze this web content from ${req.body.url} and create comprehensive study materials. ` +
          'Include a detailed summary, key points, flashcards, and a quiz.'
        );
      } catch (error) {
        console.error('Error fetching URL:', error);
        return res.status(400).json({ 
          success: false, 
          error: 'Failed to fetch URL content' 
        });
      }
    } 
    // Handle direct text
    else if (req.body.text) {
      result = await processTextWithChunking(req.body.text,
        'Please analyze this text and create comprehensive study materials. ' +
        'Include a detailed summary, key points, flashcards, and a quiz.'
      );
    } else {
      return res.status(400).json({ 
        success: false, 
        error: 'No valid input provided. Please provide a file, URL, or text.' 
      });
    }

    // Store the result in the session
    if (!sessionSources[sessionId]) {
      sessionSources[sessionId] = [];
    }
    
    const sourceData = {
      id: uuidv4(),
      type: req.file ? 'file' : (req.body.url ? 'url' : 'text'),
      timestamp: new Date().toISOString(),
      content: result
    };
    
    sessionSources[sessionId].push(sourceData);

    // Return the structured study materials
    res.json({
      success: true,
      message: 'Content processed successfully',
      data: {
        sourceId: sourceData.id,
        ...result
      }
    });
  } catch (error) {
    console.error('Error in upload endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process content',
      details: error.message
    });
  }
});

module.exports = router;
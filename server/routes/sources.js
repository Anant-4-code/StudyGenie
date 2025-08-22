const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');
const { v4: uuidv4 } = require('uuid');
const AIService = require('../services/aiService');
const { sessionSources } = require('../services/aiService'); // Import sessionSources from AIService

const router = express.Router();

// Configure Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

/**
 * Helper function to extract readable text from HTML content.
 * @param {string} html - The HTML content to parse.
 * @returns {string} - The extracted readable text.
 */
const extractReadableText = (html) => {
  const dom = new JSDOM(html);
  const reader = new Readability(dom.window.document);
  const article = reader.parse();
  return article ? article.textContent : '';
};

/**
 * Unified endpoint for uploading and processing various types of learning sources.
 * Supports file (PDF), link (URL), and text inputs.
 */
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    let sourceContent = '';
    let sourceType = 'text';
    const sessionId = uuidv4(); // Generate a unique session ID for this source

    if (req.file) {
      // Process file upload (e.g., PDF)
      sourceType = 'file';
      if (req.file.mimetype === 'application/pdf') {
        const data = await pdfParse(req.file.buffer);
        sourceContent = data.text;
      } else {
        return res.status(400).json({ error: 'Unsupported file type. Only PDFs are currently supported.' });
      }
    } else if (req.body.link) {
      // Process link (URL scraping)
      sourceType = 'link';
      try {
        const response = await axios.get(req.body.link);
        sourceContent = extractReadableText(response.data);
      } catch (linkError) {
        console.error('Error scraping URL:', linkError);
        return res.status(400).json({ error: 'Failed to scrape content from provided URL.' });
      }
    } else if (req.body.text) {
      // Process raw text input
      sourceType = 'text';
      sourceContent = req.body.text;
    } else {
      return res.status(400).json({ error: 'No source provided. Please upload a file, provide a link, or enter text.' });
    }

    if (!sourceContent.trim()) {
      return res.status(400).json({ error: 'Could not extract meaningful content from the provided source.' });
    }

    // Store the processed source content with the session ID
    sessionSources[sessionId] = { type: sourceType, content: sourceContent };
    console.log(`Source processed for session ${sessionId}. Type: ${sourceType}`);

    // Generate an initial AI response based on the source
    const initialMessage = await AIService.generateResponse(
      `I have processed a ${sourceType} source. Please provide a brief summary and ask the user what they would like to learn from it.`, 
      'tutor', 
      { sourceContent }
    );

    res.status(200).json({
      message: 'Source processed successfully',
      sessionId,
      initialAIMessage: initialMessage,
      sourceType
    });

  } catch (error) {
    console.error('Error processing source:', error);
    res.status(500).json({ error: 'Failed to process source.', details: error.message });
  }
});

module.exports = router;
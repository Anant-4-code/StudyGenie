const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdfParse = require('pdf-parse');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf|txt/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only .jpeg, .jpg, .png, .pdf, and .txt files are allowed'));
  },
});

// Process uploaded file based on type
async function processFile(file) {
  const fileExt = path.extname(file.originalname).toLowerCase();
  let textContent = '';

  try {
    if (fileExt === '.pdf') {
      const dataBuffer = fs.readFileSync(file.path);
      const data = await pdfParse(dataBuffer);
      textContent = data.text;
    } else if (['.jpeg', '.jpg', '.png'].includes(fileExt)) {
      // For images, we'll use Gemini's vision capabilities
      // Just return the file path and let the model handle it
      return { type: 'image', path: file.path, name: file.originalname };
    } else if (fileExt === '.txt') {
      textContent = fs.readFileSync(file.path, 'utf-8');
    }

    // Clean up the file after processing
    fs.unlinkSync(file.path);
    
    return { type: 'text', content: textContent };
  } catch (error) {
    console.error('Error processing file:', error);
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    throw new Error('Failed to process file');
  }
}

// Basic chat endpoint with file upload support
router.post('/chat/basic', upload.single('file'), async (req, res) => {
  try {
    const { message } = req.body;
    const file = req.file;
    
    if (!message?.trim() && !file) {
      return res.status(400).json({ 
        error: 'Either a message or a file is required' 
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    let prompt = message?.trim() || '';
    let fileContent = null;

    // Process file if uploaded
    if (file) {
      fileContent = await processFile(file);
      
      if (fileContent.type === 'image') {
        // For images, we'll use the vision model
        const imageData = {
          inlineData: {
            data: fs.readFileSync(fileContent.path, 'base64'),
            mimeType: `image/${path.extname(fileContent.name).slice(1)}`,
          },
        };
        
        const result = await model.generateContent([prompt || 'Describe this image', imageData]);
        const response = await result.response;
        
        // Clean up the image file
        fs.unlinkSync(fileContent.path);
        
        return res.json({
          reply: response.text(),
          timestamp: new Date().toISOString(),
          contextId: null, // No context ID for single image processing
        });
      } else {
        // For text content from files, add it to the prompt
        prompt = `Document content:\n${fileContent.content}\n\n${prompt}`;
      }
    }

    // For text-only or text+file content
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    
    res.json({
      reply: response.text(),
      timestamp: new Date().toISOString(),
      contextId: null, // For basic chat, we don't maintain conversation context
    });
    
  } catch (error) {
    console.error('Error in /api/chat/basic:', error);
    
    // Clean up any remaining files in case of error
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      error: 'Failed to process your request',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;

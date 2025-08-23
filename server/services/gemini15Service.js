const { GoogleGenerativeAI } = require('@google/generative-ai');

class Gemini15Service {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.modelName = 'gemini-1.5-pro-latest';
    this.model = this.genAI.getGenerativeModel({ 
      model: this.modelName,
      generationConfig: {
        temperature: 0.5,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
      },
    });
  }

  async generateStructuredOutput(prompt, fileData = null) {
    try {
      const generationConfig = {
        temperature: 0.3,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      };

      const chat = this.model.startChat({
        generationConfig,
        systemInstruction: `You are a helpful study assistant. Always respond with valid JSON in this exact structure:
        {
          "summary": "A concise summary of the content",
          "keyPoints": ["point 1", "point 2", "point 3"],
          "flashcards": [
            {"question": "...", "answer": "..."}
          ],
          "quiz": [
            {
              "question": "...",
              "options": ["...", "...", "...", "..."],
              "correctIndex": 0
            }
          ]
        }`
      });

      const request = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              ...(fileData ? [{
                fileData: {
                  mimeType: fileData.mimeType,
                  data: fileData.data
                }
              }] : [])
            ]
          }
        ]
      };

      const result = await chat.sendMessage(request);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from markdown code block if present
      const jsonMatch = text.match(/```(?:json)?\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : text;
      
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error in generateStructuredOutput:', error);
      throw new Error('Failed to generate structured output');
    }
  }

  async processDocument(file, prompt = 'Please analyze this document and create study materials.') {
    try {
      const fileData = {
        mimeType: file.mimetype,
        data: file.buffer.toString('base64')
      };

      return await this.generateStructuredOutput(prompt, fileData);
    } catch (error) {
      console.error('Error processing document:', error);
      throw error;
    }
  }

  async processText(text, prompt = 'Please analyze this text and create study materials.') {
    try {
      return await this.generateStructuredOutput(`${prompt}\n\n${text}`);
    } catch (error) {
      console.error('Error processing text:', error);
      throw error;
    }
  }
}

module.exports = new Gemini15Service();

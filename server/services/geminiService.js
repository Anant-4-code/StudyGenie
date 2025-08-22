const { GoogleGenerativeAI } = require('@google/generative-ai'); // Re-enable Gemini API
require('dotenv').config(); // Re-enable dotenv config

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GeminiService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' }); // Re-enable model initialization
  }

  /**
   * Generate content using Gemini API
   * @param {string} prompt - The prompt to send to Gemini
   * @param {Object} options - Additional options for generation
   * @returns {Promise<string>} - The generated content
   */
  async generateContent(prompt, options = {}) {
    try {
      const generationConfig = {
        temperature: options.temperature || 0.7,
        topP: options.topP || 0.9,
        maxOutputTokens: options.maxOutputTokens || 2048,
      };

      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig,
      });

      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error(`Failed to generate content: ${error.message}`);
    }
  }

  /**
   * Generate study materials from text content
   * @param {string} content - The content to analyze
   * @param {string} type - Type of material to generate (quiz, summary, flashcards)
   * @returns {Promise<Object>} - The generated study materials
   */
  async generateStudyMaterials(content, type = 'summary') {
    try {
      const prompt = this._buildPrompt(content, type);
      const response = await this.generateContent(prompt);
      return this._parseResponse(response, type);
    } catch (error) {
      console.error('Error generating study materials:', error);
      throw error;
    }
  }

  _buildPrompt(content, type) {
    const prompts = {
      quiz: `Generate 5 multiple-choice questions based on the following content. 
             Each question should have 4 options and indicate the correct answer.
             Format the response as a JSON array of objects with properties: 
             question, options (array), and correctAnswer.
             
             Content: ${content.substring(0, 10000)}`,
      
      summary: `Create a concise summary of the following content, highlighting the key points.
                Format the response as a JSON object with properties: 
                overview and keyPoints (array).
                
                Content: ${content.substring(0, 10000)}`,
      
      flashcards: `Generate study flashcards from the following content.
                   Format the response as a JSON array of objects with properties: 
                   term and definition.
                   
                   Content: ${content.substring(0, 10000)}`
    };

    return prompts[type] || prompts.summary;
  }

  _parseResponse(response, type) {
    try {
      // Try to parse JSON response
      const startIndex = response.indexOf('{');
      const endIndex = response.lastIndexOf('}') + 1;
      const jsonStr = response.substring(startIndex, endIndex);
      return JSON.parse(jsonStr);
    } catch (error) {
      // If parsing fails, return the raw response
      console.warn('Failed to parse JSON response, returning raw text');
      return { content: response };
    }
  }
}

module.exports = new GeminiService();

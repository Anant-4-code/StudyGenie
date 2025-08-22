const { GoogleGenerativeAI } = require('@google/generative-ai'); // Re-enabled GoogleGenerativeAI import
const { v4: uuidv4 } = require('uuid'); // For unique session IDs

// Access your API key as an environment variable (preferable for security)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize Google Generative AI only if API key is provided and not a placeholder
let genAI;
if (GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY') {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  console.log("Gemini API initialized.");
} else {
  console.warn("Gemini API key not found or is a placeholder. Using mock AI responses.");
}

// In-memory store for session-specific sources (for advanced chat context)
const sessionSources = {};

const AIService = {
  /**
   * Generates a response from the AI model.
   * If GEMINI_API_KEY is not set or invalid, falls back to a mock response.
   * @param {string} prompt - The user's prompt.
   * @param {string} type - The type of interaction (e.g., 'basic', 'roadmap', 'quiz').
   * @returns {Promise<string>} - The AI-generated response.
   */
  async generateResponse(prompt, type = 'basic', context = {}) {
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } catch (error) {
        console.error("Error generating content with Gemini API:", error);
        // Fallback to mock response on API error
        return this.generateMockResponse(prompt, type, context);
      }
    } else {
      // Use mock response if API key is not set
      return this.generateMockResponse(prompt, type, context);
    }
  },

  /**
   * Generates a session-specific response, often with source content as context.
   * This is used for the basic chat to provide answers based on the uploaded source.
   * @param {string} sessionId - The ID of the current session.
   * @param {string} userMessage - The user's message.
   * @param {string} type - The type of interaction (e.g., 'tutor', 'quiz').
   * @returns {Promise<string>} - The AI-generated response.
   */
  async generateSessionResponse(sessionId, userMessage, type = 'tutor') {
    const sourceContent = sessionSources[sessionId] ? sessionSources[sessionId].content : 'No source provided.';
    const prompt = `Based on the following source content and our previous conversation, respond to the user's message.\n\nSource Content: ${sourceContent}\n\nUser: ${userMessage}`;

    // Use real API or mock based on genAI availability
    return this.generateResponse(prompt, type, { sourceContent });
  },

  /**
   * Provides intelligent mock AI responses for various scenarios.
   * This is a fallback when the actual Gemini API is not available or fails.
   * @param {string} prompt - The user's prompt.
   * @param {string} type - The type of interaction (e.g., 'basic', 'roadmap', 'quiz').
   * @param {object} context - Additional context for generating mock responses (e.g., sourceContent).
   * @returns {string} - A mock AI response.
   */
  generateMockResponse(prompt, type, context = {}) {
    console.warn("Generating mock AI response for type:", type, "Prompt:", prompt);
    const lowerCasePrompt = prompt.toLowerCase();
    const { sourceContent } = context;

    if (type === 'tutor' && sourceContent) {
      if (lowerCasePrompt.includes('summary')) {
        return `Based on the provided source, here's a brief summary: This document primarily discusses [main topic]. It highlights [key point 1] and [key point 2].`;
      } else if (lowerCasePrompt.includes('question') || lowerCasePrompt.includes('explain')) {
        return `Regarding your question about "${userMessage}" based on the source, [provide a relevant mock explanation from source].`;
      } else if (lowerCasePrompt.includes('physics')) {
        return `From the source, in physics, we can infer that the principles of motion are discussed, focusing on Newton's laws.`;
      } else if (lowerCasePrompt.includes('math')) {
        return `The source details mathematical concepts like algebra and calculus, essential for problem-solving.`;
      } else if (lowerCasePrompt.includes('chemistry')) {
        return `In chemistry, the source covers molecular structures and chemical reactions, fundamental for understanding matter.`;
      }
      return `Understood. Based on the source you provided, let's explore your query: "${lowerCasePrompt}". How can I assist further with this material?`;
    }

    switch (type) {
      case 'roadmap':
        return `Here's a personalized roadmap for you based on your input: 1. Core Concepts, 2. Advanced Topics, 3. Practice Quizzes.`;
      case 'quiz':
        return `Let's start a quiz! Question 1: What is the capital of France? (Mock response)`;
      case 'basic':
      default:
        if (lowerCasePrompt.includes('hello') || lowerCasePrompt.includes('hi')) {
          return 'Hello! How can I assist you with your studies today? Please provide a source (file, link, or text) to get started.';
        } else if (lowerCasePrompt.includes('your purpose') || lowerCasePrompt.includes('what can you do')) {
          return 'I am StudyGenie, your AI-powered tutor. I can help you learn by analyzing your sources, generating roadmaps, quizzes, and more!';
        } else if (lowerCasePrompt.includes('thank')) {
          return 'You\'re welcome! Let me know if you need anything else.';
        }
        return `I'm a mock AI. You asked: "${prompt}". To get real AI responses, please ensure the Gemini API key is correctly configured.`;
    }
  }
};

module.exports = AIService;
module.exports.sessionSources = sessionSources; // Export sessionSources
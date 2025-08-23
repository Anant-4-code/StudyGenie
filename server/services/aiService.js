const { GoogleGenerativeAI } = require('@google/generative-ai');
const { v4: uuidv4 } = require('uuid');

// Access your API key as an environment variable
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const { sessionSources } = require('../utils/sessionStore');

// Initialize Google Generative AI with enhanced configuration
let genAI;
let chatModel;

if (GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY') {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  chatModel = genAI.getGenerativeModel({ 
    model: "gemini-pro",
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 2048,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
    ],
  });
  console.log("Gemini API initialized with enhanced configuration.");
} else {
  console.warn("Gemini API key not found or is a placeholder. Using mock AI responses.");
}

// In-memory store for chat sessions
const chatSessions = new Map();

// // In-memory store for session-specific sources (for advanced chat context)
// const sessionSources = {}; // Removed as it's now from shared module

const AIService = {
  /**
   * Generates a response from the AI model.
   * If GEMINI_API_KEY is not set or invalid, falls back to a mock response.
   * @param {string} prompt - The user's prompt.
   * @param {string} type - The type of interaction (e.g., 'basic', 'roadmap', 'quiz').
   * @returns {Promise<string>} - The AI-generated response.
   */
  async generateResponse(prompt, type = 'basic', context = {}) {
    if (!chatModel) {
      return this.generateMockResponse(prompt, type, context);
    }

    try {
      // Add context to the prompt for better responses
      let enhancedPrompt = prompt;
      if (context.topic) {
        enhancedPrompt = `[Topic: ${context.topic}] ${enhancedPrompt}`;
      }
      if (context.previousMessages?.length) {
        const history = context.previousMessages
          .map(msg => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`)
          .join('\n');
        enhancedPrompt = `Previous conversation context:\n${history}\n\nCurrent message: ${enhancedPrompt}`;
      }

      const result = await chatModel.generateContent(enhancedPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating content with Gemini API:", error);
      return this.generateMockResponse(prompt, type, context);
    }
  },

  /**
   * Manages chat sessions and generates contextual responses
   * @param {string} sessionId - The ID of the current session
   * @param {string} userMessage - The user's message
   * @param {Array} messageHistory - Previous messages in the conversation
   * @param {Object} context - Additional context for the conversation
   * @returns {Promise<string>} - The AI's response
   */
  async chat(sessionId, userMessage, messageHistory = [], context = {}) {
    try {
      if (!chatSessions.has(sessionId)) {
        chatSessions.set(sessionId, {
          history: [],
          context: { ...context }
        });
      }

      const session = chatSessions.get(sessionId);
      
      // Add the user's message to the history
      session.history.push({
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString()
      });

      // Generate response with full context
      const response = await this.generateResponse(userMessage, 'chat', {
        ...context,
        previousMessages: session.history.slice(-10), // Keep last 10 messages for context
        sessionId
      });

      // Add AI's response to history
      session.history.push({
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      });

      // Prune old messages to prevent memory issues
      if (session.history.length > 20) {
        session.history = session.history.slice(-20);
      }

      return response;
    } catch (error) {
      console.error('Error in chat session:', error);
      return "I'm having trouble responding right now. Please try again later.";
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
   * Generates a personalized learning roadmap using the Gemini API.
   * @param {string} sessionId - The ID of the current session.
   * @param {object} roadmapParams - Parameters for roadmap generation (topic, level, timeframe, goals, preferences).
   * @param {string} roadmapParams.topic - The main topic for the roadmap.
   * @param {string} [roadmapParams.level='beginner'] - Learning level (beginner, intermediate, advanced).
   * @param {string} [roadmapParams.timeframe='4 weeks'] - Desired timeframe for the roadmap.
   * @param {Array<string>} [roadmapParams.goals=[]] - Specific learning goals.
   * @param {object} [roadmapParams.preferences={}] - User learning preferences (style, tools, pace, focus).
   * @returns {Promise<string>} - The AI-generated roadmap in a structured format.
   */
  async generateRoadmap(sessionId, roadmapParams) {
    const { topic, level = 'beginner', timeframe = '4 weeks', goals = [], preferences = {} } = roadmapParams;
    const sourceContent = sessionSources[sessionId] ? sessionSources[sessionId].content : 'No specific source content provided.';

    const prompt = `
Generate a detailed, personalized learning roadmap or syllabus for a student.

**Subject Area:** ${topic}
**Description/Context:** ${roadmapParams.description || 'No additional description provided.'}
**Learning Level:** ${level}
**Learning Style/Technique:** ${preferences.style || 'Mixed (e.g., visual, auditory, kinesthetic)'}
**Preferred Learning Tools:** ${preferences.tools ? preferences.tools.join(', ') : 'Any relevant tools'}
**Learning Pace:** ${preferences.pace || 'Self-paced'}
**Learning Focus:** ${preferences.focus || 'Comprehensive understanding'}
**Desired Timeframe:** ${timeframe}
**Specific Goals:** ${goals.length > 0 ? goals.join(', ') : 'Comprehensive understanding of the topic.'}

**Source Material (if provided):**
\`\`\`
${sourceContent}
\`\`\`

Create a structured roadmap that includes:
1.  **Overview:** A brief summary of the roadmap's objective.
2.  **Prerequisites:** Any foundational knowledge required.
3.  **Key Modules/Units:** Break down the topic into logical sections.
4.  **Topics within Modules:** List specific concepts or sub-topics for each module.
5.  **Learning Activities/Resources:** Suggest types of activities (e.g., readings, videos, exercises, projects) and resources (e.g., textbooks, online courses, articles).
6.  **Assessment/Milestones:** How progress can be tracked (e.g., quizzes, practice problems, project completion).
7.  **Interactive Tools Integration:** Suggest how interactive tools (quizzes, flashcards, mind maps) can be used at each stage.
8.  **Expected Outcomes:** What the student should be able to do after completing the roadmap.

Return the roadmap in a clear, readable format (e.g., Markdown). Prioritize understanding and application based on the provided source and preferences.
`;

    // Call the generic generateResponse, specifying 'roadmap' type
    return this.generateResponse(prompt, 'roadmap', { sourceContent });
  },

  /**
   * Provides intelligent mock AI responses for various scenarios.
   * This is a fallback when the actual Gemini API is not available or fails.
   * @param {string} prompt - The user's prompt.
   * @param {string} type - The type of interaction (e.g., 'basic', 'roadmap', 'quiz').
   * @param {object} context - Additional context for generating mock responses (e.g., sourceContent, userMessage).
   * @returns {string} - A mock AI response.
   */
  generateMockResponse(prompt, type, context = {}) {
    console.warn("Generating mock AI response for type:", type, "Prompt:", prompt);
    const lowerCasePrompt = prompt.toLowerCase();
    const { sourceContent, userMessage } = context; // Include userMessage in context

    if (type === 'tutor' && sourceContent) {
      if (lowerCasePrompt.includes('summary')) {
        return `Based on the provided source, here's a brief summary: This document primarily discusses [main topic]. It highlights [key point 1] and [key point 2].`;
      } else if (lowerCasePrompt.includes('question') || lowerCasePrompt.includes('explain')) {
        return `Regarding your question about "${userMessage || prompt}" based on the source, [provide a relevant mock explanation from source].`;
      } else if (lowerCasePrompt.includes('physics')) {
        return `From the source, in physics, we can infer that the principles of motion are discussed, focusing on Newton's laws.`;
      } else if (lowerCasePrompt.includes('math')) {
        return `The source details mathematical concepts like algebra and calculus, essential for problem-solving.`;
      } else if (lowerCasePrompt.includes('chemistry')) {
        return `In chemistry, the source covers molecular structures and chemical reactions, fundamental for understanding matter.`;
      }
      return `Understood. Based on the source you provided, let's explore your query: "${userMessage || prompt}". How can I assist further with this material?`;
    }

    switch (type) {
      case 'roadmap':
        return `Here's a **personalized mock roadmap** for you based on your input and source content:\n\n**Overview:** This roadmap will guide you through understanding [Topic from Prompt] with a focus on [Key points from Source if available].\n\n**Modules:**\n- **Module 1: Introduction to [Topic]** (Referencing: ${sourceContent ? 'Your Source' : 'General Concepts'})\n- **Module 2: Core Principles** (Referencing: ${sourceContent ? 'Your Source' : 'Textbook Examples'})\n- **Module 3: Advanced Applications** (Referencing: ${sourceContent ? 'Your Source' : 'Real-world Scenarios'})\n\n**Activities:** Readings, Quizzes, Practice Problems.\n**Timeline:** Customizable based on your pace.\n**Next Steps:** Let's start with Module 1!`;
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
// API Configuration for StudyGenie
const API_CONFIG = {
  // Backend server URL - change this based on your setup
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  
  // Request timeout
  TIMEOUT: 30000,
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// API endpoints - exported separately for easy access
export const ENDPOINTS = {
  CHAT: {
    MESSAGE: '/api/chat/message',
    SESSION: '/api/chat/session'
  },
  SOURCES: {
    UPLOAD: '/api/sources/upload',
    URL: '/api/sources/url'
  },
  ROADMAP: {
    GENERATE: '/api/roadmap/generate',
    PROGRESS: '/api/roadmap/progress'
  },
  TOOLS: {
    QUIZ: '/api/tools/generate-quiz',
    FLASHCARDS: '/api/tools/generate-flashcards',
    PROBLEMS: '/api/tools/generate-problems'
  },
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register'
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to make API requests
export const apiRequest = async (endpoint, options = {}) => {
  const url = buildApiUrl(endpoint);
  const config = {
    ...options,
    headers: {
      ...(options.isFormData ? {} : API_CONFIG.DEFAULT_HEADERS),
      ...options.headers
    }
  };

  // Remove isFormData flag from config before sending
  delete config.isFormData;

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("API failed:", error);
    alert("Backend is unreachable. Please try again later."); // Added for user feedback
    throw error;
  }
};

export default API_CONFIG;

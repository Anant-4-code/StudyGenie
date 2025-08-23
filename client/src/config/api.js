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
    MESSAGE: '/api/v1/chat/message',
    SESSION: '/api/v1/chat/session',
    BASIC: '/api/v1/chat/basic' // AI-driven chat endpoint
  },
  SOURCES: {
    UPLOAD: '/api/v1/sources/upload',
    URL: '/api/v1/sources/url'
  },
  ROADMAP: {
    GENERATE: '/api/v1/roadmap/generate',
    PROGRESS: '/api/v1/roadmap/progress'
  },
  TOOLS: {
    QUIZ: '/api/v1/tools/generate-quiz',
    FLASHCARDS: '/api/v1/tools/generate-flashcards',
    PROBLEMS: '/api/v1/tools/generate-problems',
    MINDMAP: '/api/v1/tools/mindmap'
  },
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    LOGOUT: '/api/v1/auth/logout',
    ME: '/api/v1/auth/me'
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to make API requests
export const apiRequest = async (endpoint, options = {}, isFormData = false) => {
  const url = endpoint.startsWith('http') ? endpoint : buildApiUrl(endpoint);
  
  // Clone headers to avoid mutating the original
  const headers = {
    ...API_CONFIG.DEFAULT_HEADERS,
    ...(options.headers || {})
  };

  // Handle FormData or JSON body
  let body = options.body;
  if (body) {
    if (isFormData || body instanceof FormData) {
      // For FormData, let the browser set the Content-Type with the correct boundary
      delete headers['Content-Type'];
    } else if (typeof body === 'object') {
      // Stringify JSON body
      body = JSON.stringify(body);
      headers['Content-Type'] = 'application/json';
    }
  }

  const config = {
    ...options,
    headers,
    body
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include' // Include cookies for authentication
    });

    // Handle non-JSON responses (like file downloads)
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const error = new Error(data.message || 'Something went wrong');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    console.error("API failed:", error);
    alert("Backend is unreachable. Please try again later."); // Added for user feedback
    throw error;
  }
};

export default API_CONFIG;

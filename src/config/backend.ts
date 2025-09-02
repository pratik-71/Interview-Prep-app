// Backend Configuration - Centralized settings
export const BACKEND_CONFIG = {
  // Production backend URL
  BASE_URL: 'http://localhost:10000',
  
  // Port (for local development if needed)
  PORT: 10000,
  
  // Full API base URL
  API_BASE_URL: 'http://localhost:10000',
  
  // API endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      VERIFY: '/auth/verify',
      LOGOUT: '/auth/logout'
    },
    QUESTIONS: {
      GET_ALL: '/questions',
      GET_BY_CATEGORY: '/questions/category',
      CREATE: '/questions',
      UPDATE: '/questions',
      DELETE: '/questions'
    },
    USER: {
      PROFILE: '/user/profile',
      UPDATE: '/user/update',
      DELETE: '/user/delete'
    }
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${BACKEND_CONFIG.API_BASE_URL}${endpoint}`;
};

// Helper function to get full URL with port (for local development)
export const getFullUrl = (endpoint: string): string => {
  return `${BACKEND_CONFIG.BASE_URL}:${BACKEND_CONFIG.PORT}${endpoint}`;
};

// Export individual values for direct use
export const BACKEND_URL = BACKEND_CONFIG.BASE_URL;
export const BACKEND_PORT = BACKEND_CONFIG.PORT;
export const API_URL = BACKEND_CONFIG.API_BASE_URL;

// Backend Configuration - Centralized settings
import { networkConfig } from '../utils/networkConfig';

export const BACKEND_CONFIG = {
  // Production backend URL
  get BASE_URL() {
    return networkConfig.getBaseUrl();
  },
  
  // Port (for production, not needed in URL)
  PORT: null,
  
  // Full API base URL
  get API_BASE_URL() {
    return networkConfig.getBaseUrl();
  },
  
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

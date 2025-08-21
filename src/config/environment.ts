// Environment Configuration
export const ENV = {
  // Development environment
  DEVELOPMENT: {
    BACKEND_URL: 'http://localhost:10000',
    API_BASE_URL: 'http://localhost:10000'
  },
  
  // Production environment
  PRODUCTION: {
    BACKEND_URL: 'https://interview-prep-backend-viok.onrender.com',
    API_BASE_URL: 'https://interview-prep-backend-viok.onrender.com'
  }
};

import { isCapacitorApp } from '../utils/platformDetection';

// Check if running in mobile app (Capacitor)
const isMobileApp = () => {
  return isCapacitorApp();
};

// Get current environment
export const getCurrentEnvironment = () => {
  // If it's a mobile app, always use production backend
  if (isMobileApp()) {
    return 'PRODUCTION';
  }
  
  // For web, check NODE_ENV
  return process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'DEVELOPMENT';
};

// Get current backend configuration
export const getCurrentBackendConfig = () => {
  const env = getCurrentEnvironment();
  return ENV[env];
};

// Export current backend URL
export const CURRENT_BACKEND_URL = getCurrentBackendConfig().BACKEND_URL;
export const CURRENT_API_BASE_URL = getCurrentBackendConfig().API_BASE_URL;

// Export mobile detection for other parts of the app
export const IS_MOBILE_APP = isMobileApp();

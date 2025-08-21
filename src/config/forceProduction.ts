// Force Production Backend Configuration
// Set this to true to always use production backend, false to use environment-based

export const FORCE_PRODUCTION_BACKEND = true;

// Production backend URL
export const PRODUCTION_BACKEND_URL = 'https://interview-prep-backend-viok.onrender.com';

// Development backend URL (when FORCE_PRODUCTION_BACKEND is false)
export const DEVELOPMENT_BACKEND_URL = 'http://localhost:10000';

// Get the backend URL based on configuration
export const getBackendUrl = (): string => {
  if (FORCE_PRODUCTION_BACKEND) {
    return PRODUCTION_BACKEND_URL;
  }
  
  // Fallback to environment-based (only when FORCE_PRODUCTION_BACKEND is false)
  const isProduction = process.env.NODE_ENV === 'production';
  return isProduction ? PRODUCTION_BACKEND_URL : DEVELOPMENT_BACKEND_URL;
};

// Export the current backend URL
export const CURRENT_BACKEND_URL = getBackendUrl();

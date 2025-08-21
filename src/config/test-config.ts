// Test Configuration - Demonstrates how backend URLs are selected
import { getBackendConfig, isMobileApp, getPlatformType } from '../utils/platformDetection';
import { getCurrentBackendConfig, IS_MOBILE_APP } from './environment';

// Test function to show current configuration
export const testBackendConfiguration = () => {
  console.log('=== Backend Configuration Test ===');
  
  // Test platform detection
  const platform = getPlatformType();
  const isMobile = isMobileApp();
  
  console.log('Platform Type:', platform);
  console.log('Is Mobile App:', isMobile);
  console.log('Is Mobile App (from env):', IS_MOBILE_APP);
  
  // Test backend configuration
  const backendConfig = getBackendConfig();
  const envConfig = getCurrentBackendConfig();
  
  console.log('Backend Config (Platform):', {
    BASE_URL: backendConfig.BASE_URL,
    API_BASE_URL: backendConfig.API_BASE_URL,
    IS_MOBILE: backendConfig.IS_MOBILE,
    PLATFORM: backendConfig.PLATFORM
  });
  
  console.log('Backend Config (Environment):', {
    BACKEND_URL: envConfig.BACKEND_URL,
    API_BASE_URL: envConfig.API_BASE_URL
  });
  
  // Test API service
  console.log('=== Expected Behavior ===');
  if (isMobile) {
    console.log('✅ Mobile App: Will use production backend');
    console.log('   URL: https://interview-prep-backend-viok.onrender.com');
    console.log('   No CORS issues expected');
  } else {
    console.log('🌐 Web Browser: Will use environment-based backend');
    if (process.env.NODE_ENV === 'production') {
      console.log('   Production: https://interview-prep-backend-viok.onrender.com');
    } else {
      console.log('   Development: http://localhost:10000');
    }
  }
  
  console.log('========================');
  
  return {
    platform,
    isMobile,
    backendConfig,
    envConfig
  };
};

// Export for use in development
export default testBackendConfiguration;

// Platform Detection Utility
export const PlatformType = {
  WEB: 'web',
  ANDROID: 'android',
  IOS: 'ios',
  UNKNOWN: 'unknown'
} as const;

export type PlatformTypeValue = typeof PlatformType[keyof typeof PlatformType];

// Detect if running in Capacitor mobile app
export const isCapacitorApp = (): boolean => {
  try {
    // Check for Capacitor global object
    if (typeof window !== 'undefined' && (window as any).Capacitor) {
      return true;
    }
    
    // Check for Capacitor plugins
    if (typeof window !== 'undefined' && (window as any).Capacitor?.Plugins) {
      return true;
    }
    
    return false;
  } catch {
    return false;
  }
};

// Detect platform type
export const getPlatformType = (): PlatformTypeValue => {
  try {
    if (isCapacitorApp()) {
      // Check user agent for specific platform
      const userAgent = navigator.userAgent.toLowerCase();
      
      if (userAgent.includes('android')) {
        return PlatformType.ANDROID;
      } else if (userAgent.includes('iphone') || userAgent.includes('ipad') || userAgent.includes('ipod')) {
        return PlatformType.IOS;
      }
      
      // Default to Android if we can't determine
      return PlatformType.ANDROID;
    }
    
    return PlatformType.WEB;
  } catch {
    return PlatformType.UNKNOWN;
  }
};

// Check if running on mobile device (including mobile web)
export const isMobileDevice = (): boolean => {
  try {
    // Check for mobile user agent
    const userAgent = navigator.userAgent.toLowerCase();
    return /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  } catch {
    return false;
  }
};

// Check if running in mobile app (not mobile web)
export const isMobileApp = (): boolean => {
  return isCapacitorApp();
};

// Check if running in mobile web browser
export const isMobileWeb = (): boolean => {
  return isMobileDevice() && !isCapacitorApp();
};

// Check if running in desktop web browser
export const isDesktopWeb = (): boolean => {
  return !isMobileDevice() && !isCapacitorApp();
};

// Get environment-specific backend configuration
export const getBackendConfig = () => {
  if (isMobileApp()) {
    // Mobile apps always use production backend
    return {
      BASE_URL: 'https://interview-prep-backend-viok.onrender.com',
      API_BASE_URL: 'https://interview-prep-backend-viok.onrender.com',
      IS_MOBILE: true,
      PLATFORM: getPlatformType()
    };
  }
  
  // Web browsers use environment-based configuration
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    BASE_URL: isProduction 
      ? 'https://interview-prep-backend-viok.onrender.com' 
      : 'http://localhost:10000',
    API_BASE_URL: isProduction 
      ? 'https://interview-prep-backend-viok.onrender.com' 
      : 'http://localhost:10000',
    IS_MOBILE: false,
    PLATFORM: PlatformType.WEB
  };
};

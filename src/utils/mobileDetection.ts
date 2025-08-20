/**
 * Utility functions for mobile platform detection
 */

/**
 * Check if the current platform is mobile (Android/iOS)
 * @returns boolean indicating if running on mobile
 */
export const isMobilePlatform = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  
  const userAgent = navigator.userAgent;
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
};

/**
 * Check if the current platform supports hover
 * @returns boolean indicating if hover is supported
 */
export const supportsHover = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
};

/**
 * Check if the current platform supports touch
 * @returns boolean indicating if touch is supported
 */
export const supportsTouch = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Get the current platform type
 * @returns 'android' | 'ios' | 'web' | 'unknown'
 */
export const getPlatformType = (): 'android' | 'ios' | 'web' | 'unknown' => {
  if (typeof navigator === 'undefined') return 'unknown';
  
  const userAgent = navigator.userAgent;
  
  if (/Android/i.test(userAgent)) return 'android';
  if (/iPhone|iPad|iPod/i.test(userAgent)) return 'ios';
  if (/Chrome|Firefox|Safari|Edge/i.test(userAgent)) return 'web';
  
  return 'unknown';
};

/**
 * Check if running in Capacitor environment
 * @returns boolean indicating if running in Capacitor
 */
export const isCapacitorEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return !!(window as any).Capacitor;
};

/**
 * Get device info for debugging
 * @returns object with device information
 */
export const getDeviceInfo = () => {
  return {
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    platform: getPlatformType(),
    isMobile: isMobilePlatform(),
    supportsHover: supportsHover(),
    supportsTouch: supportsTouch(),
    isCapacitor: isCapacitorEnvironment(),
    screenSize: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'unknown',
    timestamp: new Date().toISOString()
  };
};

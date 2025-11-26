import { isCapacitorApp, getPlatformType } from './platformDetection';

// Network Configuration for Mobile Apps
export class NetworkConfig {
  private static instance: NetworkConfig;
  private baseUrl: string = '';

  private constructor() {
    this.initializeBaseUrl();
  }

  public static getInstance(): NetworkConfig {
    if (!NetworkConfig.instance) {
      NetworkConfig.instance = new NetworkConfig();
    }
    return NetworkConfig.instance;
  }

  private initializeBaseUrl() {
    // Check if we're in a browser environment (not Capacitor)
    if (typeof window !== 'undefined') {
      // First, check for environment variable (set in Vercel)
      const envBackendUrl = process.env.REACT_APP_BACKEND_URL;
      
      if (envBackendUrl) {
        // Use environment variable if set (for Vercel deployment)
        this.baseUrl = envBackendUrl;
      } else {
        // Check if we're in production
        const isProduction = process.env.NODE_ENV === 'production' || 
                            (window.location.hostname !== 'localhost' && 
                            !window.location.hostname.includes('127.0.0.1'));
        
        if (isProduction) {
          // Production: use production backend URL
          this.baseUrl = process.env.REACT_APP_API_URL || 'https://interview-prep-backend-viok.onrender.com';
        } else {
          // Development: use localhost
          this.baseUrl = 'http://localhost:10000';
        }
      }
    } else {
      // Fallback for non-browser environments (Capacitor mobile apps)
      // Mobile apps should use production backend
      this.baseUrl = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_URL || 'https://interview-prep-backend-viok.onrender.com';
    }
    
    console.log('🌐 Initialized base URL:', this.baseUrl);
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public getApiUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  // Method to update base URL (useful for debugging)
  public setBaseUrl(url: string): void {
    this.baseUrl = url;
    console.log('🌐 Updated base URL to:', url);
  }

  // Get network info for debugging
  public getNetworkInfo() {
    return {
      baseUrl: this.baseUrl,
      platform: getPlatformType(),
      isCapacitor: isCapacitorApp(),
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
  }

  // Test network connectivity
  public async testConnection(): Promise<boolean> {
    // Test by trying to access the base URL
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        timeout: 5000
      } as any);
      return response.ok || response.status !== 404;
    } catch (error) {
      console.error('❌ Network test failed:', error);
      return false;
    }
  }

  // Auto-detect the correct IP address for physical devices
  public async autoDetectIP(): Promise<string | null> {
    // Since we're using production URL, just return the current base URL
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        timeout: 5000
      } as any);
      
      if (response.ok || response.status !== 404) {
        console.log('✅ Backend is accessible');
        return this.baseUrl;
      }
    } catch (error) {
      console.error('❌ Backend not accessible:', error);
    }
    
    return null;
  }
}

export const networkConfig = NetworkConfig.getInstance();

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
    // Use production backend URL for all platforms
    this.baseUrl = 'https://interview-prep-backend-viok.onrender.com';
    
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
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        timeout: 5000
      } as any);
      return response.ok;
    } catch (error) {
      console.error('❌ Network test failed:', error);
      return false;
    }
  }

  // Auto-detect the correct IP address for physical devices
  public async autoDetectIP(): Promise<string | null> {
    // Since we're using production URL, just test the current URL
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        timeout: 5000
      } as any);
      
      if (response.ok) {
        console.log('✅ Production backend is accessible');
        return this.baseUrl;
      }
    } catch (error) {
      console.error('❌ Production backend not accessible:', error);
    }
    
    return null;
  }
}

export const networkConfig = NetworkConfig.getInstance();

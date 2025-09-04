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
    if (isCapacitorApp()) {
      const platform = getPlatformType();
      
      if (platform === 'android') {
        // Android emulator can use 10.0.2.2 to access localhost
        this.baseUrl = 'http://10.0.2.2:10000';
      } else if (platform === 'ios') {
        // iOS simulator can use localhost
        this.baseUrl = 'http://localhost:10000';
      } else {
        // Physical device - try multiple common IP ranges
        // You can update this with your actual IP address
        const possibleIPs = [
          'http://192.168.1.100:10000',  // Common home network
          'http://192.168.0.100:10000',  // Alternative home network
          'http://10.0.0.100:10000',     // Some corporate networks
          'http://172.16.0.100:10000'    // Docker networks
        ];
        this.baseUrl = possibleIPs[0]; // Default to first option
      }
    } else {
      // Web development
      this.baseUrl = 'http://localhost:10000';
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
    if (!isCapacitorApp()) return null;
    
    const possibleIPs = [
      'http://192.168.1.100:10000',
      'http://192.168.0.100:10000', 
      'http://10.0.0.100:10000',
      'http://172.16.0.100:10000',
      'http://192.168.1.101:10000',
      'http://192.168.1.102:10000',
      'http://192.168.1.103:10000'
    ];

    for (const ip of possibleIPs) {
      try {
        const response = await fetch(`${ip}/health`, {
          method: 'GET',
          timeout: 3000
        } as any);
        
        if (response.ok) {
          console.log('✅ Found working IP:', ip);
          this.setBaseUrl(ip);
          return ip;
        }
      } catch (error) {
        // Continue to next IP
        continue;
      }
    }
    
    console.error('❌ Could not find working IP address');
    return null;
  }
}

export const networkConfig = NetworkConfig.getInstance();

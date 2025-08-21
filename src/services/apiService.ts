import { getBackendConfig } from '../utils/platformDetection';

// Centralized API Service
export class ApiService {
  private static instance: ApiService;
  private baseUrl: string;

  private constructor() {
    const config = getBackendConfig();
    this.baseUrl = config.API_BASE_URL;
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Generic request method
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      mode: 'cors', // Explicitly set CORS mode
      credentials: 'include', // Include credentials for CORS
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Debug logging
    console.log('🚀 API Request:', {
      url,
      method: config.method || 'GET',
      body: config.body,
      headers: config.headers
    });

    try {
      const response = await fetch(url, config);
      
      // Debug response
      console.log('📡 API Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      const data = await response.json();
      
      console.log('📦 Response Data:', data);

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('❌ API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string, token?: string): Promise<T> {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  // POST request
  async post<T>(endpoint: string, data: any, token?: string): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json', // Ensure Content-Type is set
      'Accept': 'application/json'
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Debug the data being sent
    console.log('📤 POST Data:', data);
    console.log('📤 POST Headers:', headers);
    
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      headers
    });
  }

  // PUT request
  async put<T>(endpoint: string, data: any, token?: string): Promise<T> {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers
    });
  }

  // DELETE request
  async delete<T>(endpoint: string, token?: string): Promise<T> {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }

  // Get current backend URL
  getBackendUrl(): string {
    return this.baseUrl;
  }

  // Check if backend is accessible
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, { method: 'GET' });
      return response.ok;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const apiService = ApiService.getInstance();

// Export helper functions
export const getApiUrl = (endpoint: string): string => {
  const config = getBackendConfig();
  return `${config.API_BASE_URL}${endpoint}`;
};

export const getBackendUrl = (): string => {
  const config = getBackendConfig();
  return config.API_BASE_URL;
};

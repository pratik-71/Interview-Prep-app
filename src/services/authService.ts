import { BACKEND_CONFIG } from '../config/backend';

export interface RegisterData {
  email: string;
  username: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  username?: string;
  created_at: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string | null;
  refreshToken?: string | null;
}

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    
    return response.json();
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const url = `${BACKEND_CONFIG.API_BASE_URL}/auth/login`;
    console.log('🔐 Attempting login to:', url);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      console.log('📡 Login response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Login failed:', errorText);
        throw new Error(`Login failed: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Login successful');
      return result;
    } catch (error) {
      console.error('🚨 Login error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Network error: Unable to connect to backend at ${url}. Make sure the backend is running and accessible.`);
      }
      throw error;
    }
  }

  async getCurrentUser(token: string): Promise<{ user: User }> {
    const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get current user');
    }
    
    return response.json();
  }

  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }
    
    return response.json();
  }

  // Helper method to get token from localStorage (for backward compatibility)
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Helper method to set token in localStorage (for backward compatibility)
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Helper method to remove token from localStorage (for backward compatibility)
  removeToken(): void {
    localStorage.removeItem('authToken');
  }

  // Helper method to check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();

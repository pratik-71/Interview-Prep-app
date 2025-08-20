const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

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
}

class AuthService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser(token: string): Promise<{ user: User }> {
    return this.request<{ user: User }>('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Helper method to get token from localStorage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Helper method to set token in localStorage
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Helper method to remove token from localStorage
  removeToken(): void {
    localStorage.removeItem('authToken');
  }

  // Helper method to check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();

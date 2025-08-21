import { apiService } from './apiService';

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
  async register(data: RegisterData): Promise<AuthResponse> {
    return apiService.post<AuthResponse>('/auth/register', data);
  }

  async login(data: LoginData): Promise<AuthResponse> {
    return apiService.post<AuthResponse>('/auth/login', data);
  }

  async getCurrentUser(token: string): Promise<{ user: User }> {
    return apiService.get<{ user: User }>('/auth/me', token);
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

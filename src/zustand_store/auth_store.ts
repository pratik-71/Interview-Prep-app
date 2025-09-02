import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, User, LoginData, RegisterData } from '../services/authService';
import { BACKEND_CONFIG } from '../config/backend';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null; // Add refresh token
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  // Actions
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
  
  // State setters
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (data: LoginData) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await authService.login(data);
          
          if (response.token) {
            set({
              user: response.user,
              token: response.token,
              refreshToken: response.refreshToken || null, // Add refresh token
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            set({
              isLoading: false,
              error: 'Login successful but no token received',
            });
          }
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
          });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        try {
          set({ isLoading: true, error: null });
          
          await authService.register(data);
          
          // Do NOT auto-login. Simply finish successfully.
          set({ isLoading: false, error: null });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Registration failed',
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: async () => {
        try {
          // Get token from current state (Zustand store)
          const currentState = useAuthStore.getState();
          const token = currentState.token;
          
          if (!token) {
            set({ isAuthenticated: false, user: null });
            return;
          }

          set({ isLoading: true });
          
          // Call the /auth/me endpoint directly with the token from Zustand store
          const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/auth/me`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            
            // If it's a 401, try to refresh the token
            if (response.status === 401) {
              const currentState = useAuthStore.getState();
              const refreshToken = currentState.refreshToken;
              
              if (refreshToken) {
                try {
                  const refreshResponse = await authService.refreshToken(refreshToken);
                  
                  if (refreshResponse.token) {
                    set({
                      user: currentState.user,
                      token: refreshResponse.token,
                      refreshToken: refreshResponse.refreshToken || refreshToken,
                      isAuthenticated: true,
                      isLoading: false,
                      error: null,
                    });
                    return; // Successfully refreshed, don't throw error
                  }
                } catch (refreshError) {
                  // Token refresh failed
                }
              }
            }
            
            throw new Error(`Token validation failed: ${response.status} ${errorText}`);
          }
          
          const data = await response.json();
          
          set({
            user: data.user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          // Token is invalid, clear auth state
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      // State setters
      setUser: (user: User | null) => set({ user }),
      setToken: (token: string | null) => set({ token, isAuthenticated: !!token }),
      setLoading: (isLoading: boolean) => set({ isLoading }),
      setError: (error: string | null) => set({ error }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

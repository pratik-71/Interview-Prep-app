import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../zustand_store/auth_store';
import { useThemeStore } from '../../zustand_store/theme_store';
import { useNavigate, useLocation } from 'react-router-dom';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError } = useAuthStore();
  const { primaryColor, secondaryColor, tertiaryColor } = useThemeStore();

  const justRegistered = location.state?.justRegistered;

  useEffect(() => {
    if (justRegistered) {
      clearError();
    }
  }, [justRegistered, clearError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔐 Login Component - Form submitted');
    console.log('🔐 Login Component - Form data:', formData);
    
    if (!formData.email || !formData.password) {
      console.log('🔐 Login Component - Missing email or password');
      return;
    }

    try {
      console.log('🔐 Login Component - Calling login with:', {
        email: formData.email,
        password: formData.password,
      });
      
      await login({
        email: formData.email,
        password: formData.password,
      });
      
      console.log('🔐 Login Component - Login successful, redirecting...');
      // Redirect to practice interview page after successful login
      navigate('/practice', { replace: true });
    } catch (error) {
      // Error is handled by the store
      console.error('🔐 Login Component - Login error:', error);
    }
  };

  return (
    <div className="w-full flex items-center justify-center" style={{ backgroundColor: secondaryColor, minHeight: 'calc(100vh - 64px)' }}>
      <div className="w-full max-w-md md:max-w-lg lg:max-w-lg px-6 md:px-7 lg:px-8">
        <div className="text-center mb-6 md:mb-7 lg:mb-8">
          <div className="mx-auto h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 flex items-center justify-center rounded-full" style={{ backgroundColor: primaryColor }}>
            <svg className="h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
          <h2 className="mt-4 text-2xl md:text-2xl lg:text-3xl font-bold" style={{ color: tertiaryColor }}>
            Welcome back
          </h2>
          <p className="mt-1 text-sm md:text-sm lg:text-base" style={{ color: tertiaryColor }}>
            Sign in to continue practicing interviews
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-7 lg:p-8 border border-gray-100">
          {justRegistered && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor, border: `1px solid ${primaryColor}30` }}>
              ✅ Account created successfully! Please sign in to continue.
            </div>
          )}

          <form className="space-y-4 md:space-y-5 lg:space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 md:px-3 md:py-2 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-3 md:space-y-3 lg:space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1 md:mb-1" style={{ color: tertiaryColor }}>
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-3 py-2 md:px-3 md:py-2 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 text-gray-900 placeholder-gray-500 text-sm"
                  style={{ 
                    borderColor: error ? '#ef4444' : '#d1d5db'
                  }}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1 md:mb-1" style={{ color: tertiaryColor }}>
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full px-3 py-2 md:px-3 md:py-2 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 text-gray-900 placeholder-gray-500 text-sm"
                  style={{ 
                    borderColor: error ? '#ef4444' : '#d1d5db'
                  }}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="pt-2 md:pt-2 lg:pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2 md:py-2 lg:py-3 px-4 md:px-4 lg:px-5 border border-transparent rounded-lg text-sm font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:-translate-y-0.5"
                style={{ backgroundColor: primaryColor }}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 md:h-4 md:w-4 lg:h-5 lg:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            <div className="text-center pt-2 md:pt-2 lg:pt-3">
              <p className="text-sm" style={{ color: tertiaryColor }}>
                Don't have an account?{' '}
                <a 
                  href="/register" 
                  className="font-medium hover:underline transition-colors duration-200"
                  style={{ color: primaryColor }}
                >
                  Sign up
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { useAuthStore } from '../../zustand_store/auth_store';
import { useThemeStore } from '../../zustand_store/theme_store';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const { 
    primaryColor, 
    backgroundColor, 
    surfaceColor, 
    textColor, 
    textSecondaryColor,
    borderColor,
    inputColor
  } = useThemeStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.username || !formData.password) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      clearError();
      return;
    }

    try {
      await register({
        email: formData.email,
        username: formData.username,
        password: formData.password,
      });
      // Navigate to login after successful registration
      navigate('/login', { replace: true, state: { justRegistered: true } });
    } catch (error) {
      // Error is handled by the store
      console.error('Registration error:', error);
    }
  };

  return (
    <div 
      className="w-full flex items-center justify-center min-h-screen transition-colors duration-300" 
      style={{ backgroundColor: backgroundColor }}
    >
      <div className="w-full max-w-md md:max-w-lg lg:max-w-lg px-6 md:px-7 lg:px-8">
        <div className="text-center mb-6 md:mb-7 lg:mb-8">
          <div className="mx-auto h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 flex items-center justify-center rounded-full" style={{ backgroundColor: primaryColor }}>
            <svg className="h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="mt-4 text-2xl md:text-2xl lg:text-3xl font-bold transition-colors duration-300" style={{ color: textColor }}>
            Create account
          </h2>
          <p className="mt-1 text-sm md:text-sm lg:text-base transition-colors duration-300" style={{ color: textSecondaryColor }}>
            Join us to start practicing interviews
          </p>
        </div>
        
        <div 
          className="rounded-xl shadow-lg p-6 md:p-7 lg:p-8 border transition-colors duration-300"
          style={{ 
            backgroundColor: surfaceColor, 
            borderColor: borderColor 
          }}
        >
          <form className="space-y-4 md:space-y-5 lg:space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 md:px-3 md:py-2 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-3 md:space-y-3 lg:space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1 md:mb-1 transition-colors duration-300" style={{ color: textColor }}>
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-3 py-2 md:px-3 md:py-2 lg:px-4 lg:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 text-sm"
                  style={{
                    backgroundColor: inputColor,
                    borderColor: borderColor,
                    color: textColor
                  }}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-1 md:mb-1 transition-colors duration-300" style={{ color: textColor }}>
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="w-full px-3 py-2 md:px-3 md:py-2 lg:px-4 lg:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 text-sm"
                  style={{
                    backgroundColor: inputColor,
                    borderColor: borderColor,
                    color: textColor
                  }}
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1 md:mb-1 transition-colors duration-300" style={{ color: textColor }}>
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="w-full px-3 py-2 md:px-3 md:py-2 lg:px-4 lg:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 text-sm"
                  style={{
                    backgroundColor: inputColor,
                    borderColor: borderColor,
                    color: textColor
                  }}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1 md:mb-1 transition-colors duration-300" style={{ color: textColor }}>
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="w-full px-3 py-2 md:px-3 md:py-2 lg:px-4 lg:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 text-sm"
                  style={{
                    backgroundColor: inputColor,
                    borderColor: borderColor,
                    color: textColor
                  }}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 md:py-2 lg:py-3 px-4 md:px-4 lg:px-5 bg-blue-600 text-white font-medium rounded-lg text-sm md:text-sm lg:text-base hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm transition-colors duration-300" style={{ color: textSecondaryColor }}>
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="font-medium hover:underline transition-colors duration-200"
                style={{ color: primaryColor }}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

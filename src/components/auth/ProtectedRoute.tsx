import React, { useEffect } from 'react';
import { useAuthStore } from '../../zustand_store/auth_store';
import { useThemeStore } from '../../zustand_store/theme_store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback = (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fbfbfe' }}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#00b2d6' }}></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}) => {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const { primaryColor, secondaryColor, tertiaryColor } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: secondaryColor }}>
        <div className="max-w-md w-full text-center px-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="h-16 w-16 mx-auto rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: primaryColor }}>
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: tertiaryColor }}>
              Access Required
            </h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in to access this page. Please sign in to continue.
            </p>
            <div className="space-y-3">
              <a
                href="/login"
                className="block w-full py-3 px-4 rounded-lg text-sm font-medium text-white transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                style={{ backgroundColor: primaryColor }}
              >
                Sign In
              </a>
              <a
                href="/register"
                className="block w-full py-3 px-4 rounded-lg text-sm font-medium border-2 transition-all duration-200 hover:bg-gray-50"
                style={{ 
                  borderColor: primaryColor,
                  color: primaryColor
                }}
              >
                Create Account
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

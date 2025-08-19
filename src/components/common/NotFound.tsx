import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../zustand_store/theme_store';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { primaryColor, secondaryColor, tertiaryColor } = useThemeStore();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: secondaryColor }}>
      <div className="max-w-md mx-auto text-center px-6">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6" style={{ backgroundColor: `${primaryColor}15` }}>
            <svg className="w-12 h-12" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-6xl font-bold mb-4" style={{ color: primaryColor }}>
          404
        </h1>
        <h2 className="text-2xl font-bold mb-4" style={{ color: tertiaryColor }}>
          Page Not Found
        </h2>
        <p className="text-lg mb-8" style={{ color: `${tertiaryColor}80` }}>
          Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleGoHome}
            className="w-full py-3 px-6 rounded-lg text-white font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Go to Home</span>
            </div>
          </button>

          <button
            onClick={handleGoBack}
            className="w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 border-2"
            style={{ 
              borderColor: `${primaryColor}30`,
              backgroundColor: `${primaryColor}08`,
              color: primaryColor
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${primaryColor}15`;
              e.currentTarget.style.borderColor = primaryColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = `${primaryColor}08`;
              e.currentTarget.style.borderColor = `${primaryColor}30`;
            }}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Go Back</span>
            </div>
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 p-4 rounded-lg" style={{ backgroundColor: `${primaryColor}08` }}>
          <p className="text-sm" style={{ color: `${tertiaryColor}70` }}>
            Need help? Check the navigation menu or contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

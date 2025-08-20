import React, { useState, useEffect } from 'react';
import { useThemeStore } from '../zustand_store/theme_store';
import { isMobilePlatform } from '../utils/mobileDetection';

interface LoadingQuestionsProps {
  field: string;
  subfield: string;
  onCancel: () => void;
}

const LoadingQuestions: React.FC<LoadingQuestionsProps> = ({ field, subfield, onCancel }) => {
  const [isMobile, setIsMobile] = useState(false);
  const { primaryColor, secondaryColor, tertiaryColor } = useThemeStore();

  // Detect mobile platform
  useEffect(() => {
    setIsMobile(isMobilePlatform());
  }, []);

  // Mobile-friendly event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isMobile) {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: `${tertiaryColor}cc` }}>
      <div className="w-full max-w-md mx-auto" style={{ backgroundColor: secondaryColor }}>
        <div className="rounded-2xl shadow-2xl overflow-hidden border" style={{ borderColor: `${primaryColor}30` }}>
          {/* Header */}
          <div className="px-6 py-5" style={{ backgroundColor: `${primaryColor}08` }}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: tertiaryColor }}>Generating Questions</h2>
                <p className="text-sm" style={{ color: `${tertiaryColor}80` }}>
                  Creating interview questions for {field} - {subfield}
                </p>
              </div>
            </div>
          </div>

          {/* Loading Content */}
          <div className="px-6 py-8 text-center">
            {/* Animated Loading Icon */}
            <div className="mb-6">
              <div className="relative w-20 h-20 mx-auto">
                <div 
                  className="absolute inset-0 rounded-full border-4 border-transparent animate-spin"
                  style={{ 
                    borderTopColor: primaryColor,
                    borderRightColor: `${primaryColor}80`,
                    borderBottomColor: `${primaryColor}40`,
                    borderLeftColor: `${primaryColor}20`
                  }}
                />
                <div className="absolute inset-2 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Loading Text */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold" style={{ color: tertiaryColor }}>
                AI is crafting your questions...
              </h3>
              <p className="text-sm" style={{ color: `${tertiaryColor}80` }}>
                We're generating 24 tailored interview questions across three difficulty levels using Gemini AI.
              </p>
              
              {/* Progress Steps */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: primaryColor }}>
                    ✓
                  </div>
                  <span className="text-sm" style={{ color: `${tertiaryColor}80` }}>Analyzing field requirements</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: primaryColor }}>
                    ✓
                  </div>
                  <span className="text-sm" style={{ color: `${tertiaryColor}80` }}>Generating beginner questions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: primaryColor }}>
                    ✓
                  </div>
                  <span className="text-sm" style={{ color: `${tertiaryColor}80` }}>Creating intermediate questions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: primaryColor }}>
                    ✓
                  </div>
                  <span className="text-sm" style={{ color: `${tertiaryColor}80` }}>Formulating expert questions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse" style={{ backgroundColor: primaryColor }}>
                    ⚡
                  </div>
                  <span className="text-sm" style={{ color: `${tertiaryColor}80` }}>Finalizing and formatting</span>
                </div>
              </div>
            </div>

            {/* Cancel Button */}
            <button
              onClick={onCancel}
              onTouchStart={handleTouchStart}
              className="mt-6 px-6 py-2 border-2 rounded-lg transition-all duration-200 font-medium active:scale-95"
              style={{ 
                borderColor: `${primaryColor}30`,
                color: tertiaryColor,
                backgroundColor: secondaryColor
              }}
            >
              Cancel Generation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingQuestions;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../zustand_store/theme_store';
import { useQuestionsStore } from '../zustand_store/questions_store';
import { sampleQuestions } from '../data/sampleQuestions';
import { isMobilePlatform } from '../utils/mobileDetection';

const QuestionsDisplay: React.FC = () => {
  const { questions, setQuestions } = useQuestionsStore();
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'beginner' | 'intermediate' | 'expert'>('beginner');
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const { primaryColor, secondaryColor, tertiaryColor } = useThemeStore();

  // Detect mobile platform
  useEffect(() => {
    setIsMobile(isMobilePlatform());
  }, []);

  const toggleQuestionExpansion = (questionId: string) => {
    if (openQuestionId === questionId) {
      setOpenQuestionId(null);
    } else {
      setOpenQuestionId(questionId);
    }
  };

  const handleCategoryClick = (category: 'beginner' | 'intermediate' | 'expert') => {
    setActiveCategory(category);
  };

  const handleStartTest = () => {
    if (questions) {
      navigate('/test');
    }
  };

  // Mobile-friendly event handlers
  const handleTouchStart = (e: React.TouchEvent, questionId: string) => {
    if (isMobile) {
      e.preventDefault();
      toggleQuestionExpansion(questionId);
    }
  };

  const handleTouchStartCategory = (e: React.TouchEvent, category: 'beginner' | 'intermediate' | 'expert') => {
    if (isMobile) {
      e.preventDefault();
      handleCategoryClick(category);
    }
  };

  const renderHeader = () => (
    <div className='flex items-center justify-between mb-1 sm:mb-2 md:mb-2 px-2 pt-2'>
      <h2 className='text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold'
        style={{ color: tertiaryColor }}>
        Interview Questions
      </h2>
      <button
        className="rounded-lg px-4 py-2 md:px-4 md:py-2 lg:px-5 lg:py-3 text-white transition-all duration-300 hover:scale-105 active:scale-95"
        style={{ backgroundColor: primaryColor }}
        onClick={handleStartTest}
        disabled={!questions}
      >
        Start Test
      </button>
    </div>
  );

  const renderCategoryTabs = () => {
    const categories = ['beginner', 'intermediate', 'expert'] as const;

    return (
      <div className='flex space-x-1 sm:space-x-2 mb-4 sm:mb-4 md:mb-4 justify-center'>
        {categories.map((category, index) => {
          const isActive = activeCategory === category;
          const categoryColors = [
            { bg: `${primaryColor}15`, text: primaryColor, border: `${primaryColor}30` },
            { bg: `${secondaryColor}`, text: tertiaryColor, border: `${primaryColor}20` },
            { bg: `${tertiaryColor}15`, text: tertiaryColor, border: `${primaryColor}40` }
          ];
          const colors = categoryColors[index];

          return (
            <div
              key={category}
              className={`flex items-center justify-center space-x-2 sm:space-x-3 px-2 sm:px-3 md:px-3 lg:px-4 py-2 sm:py-3 md:py-3 rounded-lg sm:rounded-xl font-medium sm:font-semibold shadow-md sm:shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 ${isActive ? 'ring-2 ring-offset-2' : ''}`}
              style={{
                backgroundColor: isActive ? primaryColor : colors.bg,
                color: isActive ? 'white' : colors.text,
                border: `2px solid ${isActive ? primaryColor : colors.border}`
              }}
              onClick={() => handleCategoryClick(category)}
              onTouchStart={(e) => handleTouchStartCategory(e, category)}
            >
              <span className='capitalize text-xs sm:text-sm md:text-sm lg:text-base'>
                {category}
              </span>
              <span className='px-1 sm:px-2 md:px-2 py-1 rounded-full text-xs sm:text-sm font-bold text-white'
                style={{
                  backgroundColor: isActive ? 'white' : primaryColor,
                  color: isActive ? primaryColor : 'white'
                }}>
                {questions?.[category]?.length || 0}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderQuestionCard = (question: any, index: number) => {
    const categoryColors = {
      beginner: `${primaryColor}30`,
      intermediate: `${primaryColor}20`,
      expert: `${primaryColor}40`
    };
    const borderColor = categoryColors[activeCategory];
    const isExpanded = openQuestionId === question.id;

    return (
      <div
        key={question.id}
        className='p-3 sm:p-4 md:p-4 lg:p-5 rounded-lg sm:rounded-xl border-2 shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer'
        style={{
          borderColor: borderColor,
          backgroundColor: secondaryColor
        }}
        onClick={() => toggleQuestionExpansion(question.id)}
        onTouchStart={(e) => handleTouchStart(e, question.id)}
      >
        <div className='flex items-start space-x-2 sm:space-x-3 md:space-x-3'>
          <div className='w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-white text-sm sm:text-base md:text-base font-bold flex-shrink-0'
            style={{ backgroundColor: primaryColor }}>
            {index + 1}
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-sm sm:text-base md:text-base lg:text-lg font-medium mb-2 sm:mb-3'
              style={{ color: tertiaryColor }}>
              {question.question}
            </p>
            <div className='flex items-center justify-between'>
              <span className='px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold text-white'
                style={{ backgroundColor: primaryColor }}>
                {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
              </span>
              <div className='flex items-center space-x-2'>
                <span className='text-xs sm:text-sm' style={{ color: `${tertiaryColor}60` }}>
                  {isExpanded ? 'Tap to collapse' : 'Tap to expand'}
                </span>
                <svg className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
                  style={{ color: primaryColor }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Answer Section with CSS Transitions */}
        <div 
          className='overflow-hidden transition-all duration-300 ease-in-out'
          style={{ 
            maxHeight: isExpanded ? '1000px' : '0px',
            opacity: isExpanded ? 1 : 0,
            transform: isExpanded ? 'translateY(0)' : 'translateY(-10px)'
          }}
        >
          <div className='mt-4 pt-4 border-t' style={{ borderColor: `${primaryColor}20` }}>
            <div className='space-y-4'>
              <div>
                <div className='p-4 rounded-lg' style={{ backgroundColor: `${primaryColor}05`, border: `1px solid ${primaryColor}20` }}>
                  <p className='text-sm sm:text-base md:text-lg leading-relaxed'
                    style={{ color: tertiaryColor }}>{question.answer}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderQuestionsList = () => {
    if (!questions) return null;

    return (
      <div className='flex-1 overflow-y-auto px-2 sm:px-4 md:px-6 custom-scrollbar'
        style={{
          minHeight: 0,
          scrollbarWidth: 'thin',
          scrollbarColor: `${primaryColor} ${secondaryColor}`
        }}>
        <div className='space-y-4 sm:space-y-6'>
          <div className='space-y-3 sm:space-y-4 mb-8'>
            {questions[activeCategory]?.map((question, index) =>
              renderQuestionCard(question, index)
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!questions) {
    return (
      <div className='text-center flex flex-col items-center justify-center flex-1 px-4'>
        <div className='w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-4 sm:mb-6'
          style={{ backgroundColor: `${primaryColor}15` }}>
          <svg className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12'
            style={{ color: primaryColor }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4'
          style={{ color: tertiaryColor }}>Practice Interview</h2>
        <p className='text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6'
          style={{ color: `${tertiaryColor}80` }}>
          Load sample questions to get started
        </p>
        <button
          onClick={() => setQuestions(sampleQuestions)}
          className='px-6 py-3 text-white rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl active:scale-95'
          style={{ backgroundColor: primaryColor }}
        >
          Load Sample Questions
        </button>
      </div>
    );
  }

  return (
    <div className='space-y-4 flex-1 flex flex-col min-h-0'>
      {renderHeader()}
      {renderCategoryTabs()}
      {renderQuestionsList()}
    </div>
  );
};

export default QuestionsDisplay;

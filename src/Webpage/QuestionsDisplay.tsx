import React, { useState, useEffect, useRef, useCallback, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../zustand_store/theme_store';
import { useQuestionsStore } from '../zustand_store/questions_store';
import { sampleQuestions } from '../data/sampleQuestions';

// State management with reducer pattern
interface ExpansionState {
  openId: string | null;
  heights: { [key: string]: number };
  lastInteraction: number;
  isAnimating: boolean;
}

type ExpansionAction = 
  | { type: 'TOGGLE'; id: string }
  | { type: 'CLOSE_ALL' }
  | { type: 'SET_HEIGHT'; id: string; height: number }
  | { type: 'SET_ANIMATING'; isAnimating: boolean }
  | { type: 'RESET' };

const expansionReducer = (state: ExpansionState, action: ExpansionAction): ExpansionState => {
  switch (action.type) {
    case 'TOGGLE':
      return {
        ...state,
        openId: state.openId === action.id ? null : action.id,
        lastInteraction: Date.now(),
        isAnimating: true
      };
    case 'CLOSE_ALL':
      return {
        ...state,
        openId: null,
        lastInteraction: Date.now()
      };
    case 'SET_HEIGHT':
      return {
        ...state,
        heights: { ...state.heights, [action.id]: action.height }
      };
    case 'SET_ANIMATING':
      return {
        ...state,
        isAnimating: action.isAnimating
      };
    case 'RESET':
      return {
        openId: null,
        heights: {},
        lastInteraction: 0,
        isAnimating: false
      };
    default:
      return state;
  }
};

const QuestionsDisplay: React.FC = () => {
  const { questions, setQuestions } = useQuestionsStore();
  const [activeCategory, setActiveCategory] = useState<'beginner' | 'intermediate' | 'expert'>('beginner');
  const [touchState, setTouchState] = useState<{
    isPressed: boolean;
    startX: number;
    startY: number;
  }>({ isPressed: false, startX: 0, startY: 0 });
  
  const [expansionState, dispatch] = useReducer(expansionReducer, {
    openId: null,
    heights: {},
    lastInteraction: 0,
    isAnimating: false
  });
  
  const navigate = useNavigate();
  const { 
    primaryColor, 
    backgroundColor, 
    surfaceColor, 
    textColor, 
    textSecondaryColor
  } = useThemeStore();

  // Refs for measuring answer heights
  const answerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);


  // Reset state when questions or category change
  useEffect(() => {
    if (questions && questions[activeCategory]) {
      dispatch({ type: 'RESET' });
    }
  }, [questions, activeCategory]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, []);

  // Robust interaction handlers
  const toggleQuestionExpansion = useCallback((questionId: string) => {
    // Prevent rapid interactions
    const now = Date.now();
    if (now - expansionState.lastInteraction < 200) return;
    
    dispatch({ type: 'TOGGLE', id: questionId });
    
    // Measure height after animation starts
    if (expansionState.openId !== questionId) {
      interactionTimeoutRef.current = setTimeout(() => {
        if (answerRefs.current[questionId]) {
          const height = answerRefs.current[questionId]?.scrollHeight || 0;
          dispatch({ type: 'SET_HEIGHT', id: questionId, height });
        }
        dispatch({ type: 'SET_ANIMATING', isAnimating: false });
      }, 50);
    }
  }, [expansionState.openId, expansionState.lastInteraction]);

  const handleCategoryClick = useCallback((category: 'beginner' | 'intermediate' | 'expert') => {
    setActiveCategory(category);
    dispatch({ type: 'CLOSE_ALL' });
  }, []);

  const handleStartTest = useCallback(() => {
    if (questions) {
      navigate('/test');
    }
  }, [questions, navigate]);

  // Universal interaction handler
  const handleInteraction = useCallback((e: React.MouseEvent | React.TouchEvent, questionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent double-triggering
    if (e.type === 'touchend' && (e as React.TouchEvent).changedTouches[0]) {
      const touch = (e as React.TouchEvent).changedTouches[0];
      const distance = Math.sqrt(
        Math.pow(touch.clientX - touchState.startX, 2) +
        Math.pow(touch.clientY - touchState.startY, 2)
      );
      
      // Only trigger if it's a tap (not a swipe)
      if (distance > 10) return;
    }
    
    toggleQuestionExpansion(questionId);
  }, [toggleQuestionExpansion, touchState]);

  const handleCategoryInteraction = useCallback((e: React.MouseEvent | React.TouchEvent, category: 'beginner' | 'intermediate' | 'expert') => {
    e.preventDefault();
    e.stopPropagation();
    handleCategoryClick(category);
  }, [handleCategoryClick]);

  // Touch state management
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchState({
      isPressed: true,
      startX: touch.clientX,
      startY: touch.clientY
    });
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    setTouchState(prev => ({ ...prev, isPressed: false }));
  }, []);

  // Keyboard accessibility
  const handleKeyDown = useCallback((e: React.KeyboardEvent, questionId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleQuestionExpansion(questionId);
    }
  }, [toggleQuestionExpansion]);

  const renderHeader = () => (
    <div className='flex items-center justify-between mb-1 sm:mb-2 md:mb-2 px-2 pt-2'>
      <h2 className='text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold transition-colors duration-300'
        style={{ color: textColor }}>
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
            { bg: surfaceColor, text: textColor, border: `${primaryColor}20` },
            { bg: `${textColor}15`, text: textColor, border: `${primaryColor}40` }
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
              onClick={(e) => handleCategoryInteraction(e, category)}
              onTouchEnd={(e) => handleCategoryInteraction(e, category)}
              onTouchStart={handleTouchStart}
              onTouchCancel={handleTouchEnd}
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
    const isExpanded = expansionState.openId === question.id;
    const answerHeight = expansionState.heights[question.id] || 0;

    return (
      <div
        key={question.id}
        className={`question-card p-3 sm:p-4 md:p-4 lg:p-5 rounded-lg sm:rounded-xl border-2 shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
          touchState.isPressed ? 'scale-98' : ''
        }`}
        style={{
          borderColor: borderColor,
          backgroundColor: surfaceColor
        }}
        onClick={(e) => handleInteraction(e, question.id)}
        onTouchEnd={(e) => handleInteraction(e, question.id)}
        onTouchStart={handleTouchStart}
        onTouchCancel={handleTouchEnd}
        onKeyDown={(e) => handleKeyDown(e, question.id)}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-controls={`answer-${question.id}`}
      >
        <div className='flex items-start space-x-2 sm:space-x-3 md:space-x-3'>
          <div className='w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-white text-sm sm:text-base md:text-base font-bold flex-shrink-0'
            style={{ backgroundColor: primaryColor }}>
            {index + 1}
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-sm sm:text-base md:text-base lg:text-lg font-medium mb-2 sm:mb-3'
              style={{ color: textColor }}>
              {question.question}
            </p>
            <div className='flex items-center justify-between'>
              <span className='px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold text-white'
                style={{ backgroundColor: primaryColor }}>
                {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
              </span>
              <div className='flex items-center space-x-2'>
                <span className='text-xs sm:text-sm' style={{ color: `${textSecondaryColor}60` }}>
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

        {/* Answer Section with Robust Animations */}
        <div 
          id={`answer-${question.id}`}
          className='answer-section overflow-hidden transition-all duration-300 ease-out'
          style={{ 
            maxHeight: isExpanded ? `${answerHeight + 32}px` : '0px',
            opacity: isExpanded ? 1 : 0,
            transform: isExpanded ? 'translateY(0)' : 'translateY(-8px)',
            marginTop: isExpanded ? '16px' : '0px',
            paddingTop: isExpanded ? '16px' : '0px',
            borderTop: isExpanded ? `1px solid ${primaryColor}20` : '1px solid transparent',
            visibility: isExpanded ? 'visible' : 'hidden'
          }}
        >
          <div 
            ref={(el) => { answerRefs.current[question.id] = el; }}
            className='space-y-4'
          >
            <div>
              <div className='p-4 rounded-lg' style={{ backgroundColor: `${primaryColor}05`, border: `1px solid ${primaryColor}20` }}>
                <p className='text-sm sm:text-base md:text-lg leading-relaxed'
                  style={{ color: textColor }}>{question.answer}</p>
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
          scrollbarColor: `${primaryColor} ${backgroundColor}`
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
          style={{ color: textColor }}>Practice Interview</h2>
        <p className='text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6'
          style={{ color: `${textSecondaryColor}80` }}>
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
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${primaryColor}40;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${primaryColor}60;
        }
        .question-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .answer-section {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
      {renderHeader()}
      {renderCategoryTabs()}
      {renderQuestionsList()}
    </div>
  );
};

export default QuestionsDisplay;

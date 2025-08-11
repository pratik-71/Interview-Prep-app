import React, { useState } from 'react';
import { InterviewQuestion, InterviewQuestionsResponse } from '../services/geminiService';
import { useThemeStore } from '../zustand_store/theme_store';

interface QuestionsDisplayProps {
  questions: InterviewQuestionsResponse;
  field: string;
  subfield: string;
  onClose: () => void;
}

const QuestionsDisplay: React.FC<QuestionsDisplayProps> = ({ questions, field, subfield, onClose }) => {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<'beginner' | 'intermediate' | 'expert'>('beginner');
  const { primaryColor, secondaryColor, tertiaryColor } = useThemeStore();

  const toggleQuestion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'beginner':
        return '#10b981'; // Green
      case 'intermediate':
        return '#f59e0b'; // Amber
      case 'expert':
        return '#ef4444'; // Red
      default:
        return primaryColor;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'beginner':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'intermediate':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'expert':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const renderQuestions = (questionList: InterviewQuestion[], category: string) => {
    return questionList.map((question, index) => {
      const isExpanded = expandedQuestions.has(question.id);
      const categoryColor = getCategoryColor(category);

      return (
        <div
          key={question.id}
          className="mb-4 border-2 rounded-xl overflow-hidden transition-all duration-300"
          style={{ 
            borderColor: isExpanded ? categoryColor : `${primaryColor}20`,
            backgroundColor: isExpanded ? `${categoryColor}05` : secondaryColor
          }}
        >
          {/* Question Header */}
          <button
            onClick={() => toggleQuestion(question.id)}
            className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-opacity-80 transition-all duration-200"
            style={{ backgroundColor: `${categoryColor}10` }}
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: categoryColor }}
              >
                {index + 1}
              </div>
              <span className="font-medium" style={{ color: tertiaryColor }}>
                {question.question}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span 
                className="px-2 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: categoryColor }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                style={{ color: categoryColor }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {/* Answer Content */}
          {isExpanded && (
            <div className="px-4 pb-4 space-y-3">
              <div className="pt-3 border-t" style={{ borderColor: `${categoryColor}20` }}>
                <h4 className="font-semibold mb-2" style={{ color: tertiaryColor }}>Answer:</h4>
                <p className="text-sm leading-relaxed" style={{ color: `${tertiaryColor}80` }}>
                  {question.answer}
                </p>
              </div>

              {question.explanation && (
                <div>
                  <h4 className="font-semibold mb-2" style={{ color: tertiaryColor }}>Why This Matters:</h4>
                  <p className="text-sm leading-relaxed" style={{ color: `${tertiaryColor}80` }}>
                    {question.explanation}
                  </p>
                </div>
              )}

              {question.tips && question.tips.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2" style={{ color: tertiaryColor }}>Pro Tips:</h4>
                  <ul className="space-y-1">
                    {question.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start space-x-2">
                        <div 
                          className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                          style={{ backgroundColor: categoryColor }}
                        />
                        <span className="text-sm" style={{ color: `${tertiaryColor}80` }}>
                          {tip}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: `${tertiaryColor}cc` }}>
      <div className="w-full max-w-6xl mx-auto max-h-[90vh] overflow-hidden" style={{ backgroundColor: secondaryColor }}>
        <div className="rounded-2xl shadow-2xl overflow-hidden border" style={{ borderColor: `${primaryColor}30` }}>
          {/* Header */}
          <div className="px-6 py-5" style={{ backgroundColor: `${primaryColor}08` }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: tertiaryColor }}>
                    Interview Questions
                  </h2>
                  <p className="text-sm" style={{ color: `${tertiaryColor}80` }}>
                    {field} - {subfield}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{ 
                  backgroundColor: `${primaryColor}15`,
                  color: primaryColor
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${primaryColor}25`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${primaryColor}15`;
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="px-6 py-4 border-b" style={{ borderColor: `${primaryColor}20` }}>
            <div className="flex space-x-1">
              {(['beginner', 'intermediate', 'expert'] as const).map((category) => {
                const isActive = activeCategory === category;
                const categoryColor = getCategoryColor(category);
                
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isActive ? 'text-white' : 'hover:bg-opacity-80'
                    }`}
                    style={{
                      backgroundColor: isActive ? categoryColor : `${categoryColor}15`,
                      color: isActive ? 'white' : categoryColor
                    }}
                  >
                    {getCategoryIcon(category)}
                    <span className="capitalize">{category}</span>
                    <span className="px-2 py-1 rounded-full text-xs" style={{ 
                      backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : `${categoryColor}30` 
                    }}>
                      {questions[category].length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Questions Content */}
          <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
            <div className="space-y-4">
              {renderQuestions(questions[activeCategory], activeCategory)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionsDisplay;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../zustand_store/theme_store';
import { useQuestionsStore } from '../zustand_store/questions_store';
import GeminiService from '../services/geminiService';
import LoadingQuestions from './LoadingQuestions';
import { sampleQuestions } from '../data/sampleQuestions';
import { isMobilePlatform } from '../utils/mobileDetection';

interface TechOption {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const PracticeInterview: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTech, setSelectedTech] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);
  
  const navigate = useNavigate();
  const { primaryColor, secondaryColor, tertiaryColor } = useThemeStore();
  const { setQuestions } = useQuestionsStore();

  // Detect mobile platform
  useEffect(() => {
    setIsMobile(isMobilePlatform());
  }, []);

  const techOptions: TechOption[] = [
    {
      id: 'java',
      name: 'Java',
      icon: '☕',
      color: '#f89820'
    },
    {
      id: 'python',
      name: 'Python',
      icon: '🐍',
      color: '#3776ab'
    },
    {
      id: 'javascript',
      name: 'JavaScript',
      icon: '⚡',
      color: '#f7df1e'
    },
    {
      id: 'cpp',
      name: 'C++',
      icon: '⚙️',
      color: '#00599c'
    },
    {
      id: 'reactjs',
      name: 'React.js',
      icon: '⚛️',
      color: '#61dafb'
    },
    {
      id: 'nodejs',
      name: 'Node.js',
      icon: '🟢',
      color: '#339933'
    }
  ];

  const handleTechClick = async (techId: string) => {
    setIsLoading(true);
    setSelectedTech(techId);
    
    try {
      const geminiService = GeminiService.getInstance();
      const tech = techOptions.find(t => t.id === techId);
      
      const generatedQuestions = await geminiService.generateInterviewQuestions(
        tech?.name || techId,
        'Programming',
        ''
      );
      
      setQuestions(generatedQuestions);
      navigate('/practice/questions');
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to generate questions:', err);
      setIsLoading(false);
      // Fallback to sample questions on error
      setQuestions(sampleQuestions);
      navigate('/practice/questions');
    }
  };

  const handleGoOffline = () => {
    setQuestions(sampleQuestions);
    navigate('/practice/questions');
  };

  // Mobile-friendly event handlers
  const handleTouchStart = (e: React.TouchEvent, techId: string) => {
    if (isMobile) {
      e.preventDefault();
      handleTechClick(techId);
    }
  };

  const handleTouchStartOffline = (e: React.TouchEvent) => {
    if (isMobile) {
      e.preventDefault();
      handleGoOffline();
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden" style={{ backgroundColor: secondaryColor }}>
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 custom-scrollbar"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: `${primaryColor} ${secondaryColor}`
          }}>
          <div className="w-full max-w-4xl mx-auto py-6">
            <LoadingQuestions
              field={techOptions.find(t => t.id === selectedTech)?.name || selectedTech}
              subfield="Programming"
              onCancel={() => {
                setIsLoading(false);
                setSelectedTech('');
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden" style={{ backgroundColor: secondaryColor }}>
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 custom-scrollbar"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: `${primaryColor} ${secondaryColor}`
        }}>
        <div className="w-full max-w-4xl mx-auto py-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: `${primaryColor}15` }}>
              <svg className="w-8 h-8" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: tertiaryColor }}>
              Practice Interview
            </h1>
            <p className="text-lg" style={{ color: `${tertiaryColor}80` }}>
              Choose your technology focus area
            </p>
          </div>

          {/* Offline Button */}
          <div className="text-center mb-6">
            <button
              onClick={handleGoOffline}
              onTouchStart={handleTouchStartOffline}
              className="px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg border-2"
              style={{ 
                borderColor: `${primaryColor}30`,
                backgroundColor: `${primaryColor}08`,
                color: primaryColor
              }}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>Go Offline - Load Sample Questions</span>
              </div>
            </button>
          </div>

          {/* Technology Grid */}
          <div className="grid grid-cols-2 gap-4">
            {techOptions.map((tech) => (
              <button
                key={tech.id}
                onClick={() => handleTechClick(tech.id)}
                onTouchStart={(e) => handleTouchStart(e, tech.id)}
                disabled={isLoading}
                className="p-4 rounded-xl border-2 transition-all duration-300 text-center group hover:scale-105 active:scale-95 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  borderColor: `${primaryColor}20`,
                  backgroundColor: 'white'
                }}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div 
                    className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ backgroundColor: tech.color }}
                  >
                    {tech.icon}
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: tertiaryColor }}>
                    {tech.name}
                  </h3>
                  {isLoading && (
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeInterview;

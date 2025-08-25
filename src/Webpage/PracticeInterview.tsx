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
  const { 
    primaryColor, 
    backgroundColor, 
    surfaceColor, 
    textColor, 
    textSecondaryColor,
    borderColor,
    cardColor
  } = useThemeStore();
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

  if (isLoading) {
    return (
      <LoadingQuestions 
        field={techOptions.find(t => t.id === selectedTech)?.name || selectedTech}
        subfield="Programming"
        onCancel={() => {
          setIsLoading(false);
          setSelectedTech('');
        }}
      />
    );
  }

  return (
    <div 
      className="min-h-screen transition-colors duration-300" 
      style={{ backgroundColor: backgroundColor }}
    >
      <div className="max-w-6xl mx-auto py-6 md:py-8 lg:py-10 px-4 md:px-5 lg:px-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10 lg:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-5 lg:mb-6 transition-colors duration-300" style={{ color: textColor }}>
            Practice Interview
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl transition-colors duration-300" style={{ color: textSecondaryColor }}>
            Choose a technology to start practicing
          </p>
        </div>

        {/* Technology Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6 mb-8 md:mb-10 lg:mb-12">
          {techOptions.map((tech) => (
            <button
              key={tech.id}
              onClick={() => handleTechClick(tech.id)}
              className="group p-6 md:p-7 lg:p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 active:scale-95"
              style={{ 
                backgroundColor: surfaceColor,
                borderColor: borderColor
              }}
            >
              <div className="text-center">
                <div className="text-4xl md:text-5xl lg:text-6xl mb-4 md:mb-5">
                  {tech.icon}
                </div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-2 md:mb-3 transition-colors duration-300" style={{ color: textColor }}>
                  {tech.name}
                </h3>
                <p className="text-sm md:text-base transition-colors duration-300" style={{ color: textSecondaryColor }}>
                  Click to start
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Offline Option */}
        <div className="text-center">
          <button
            onClick={handleGoOffline}
            className="inline-flex items-center space-x-2 px-6 md:px-7 lg:px-8 py-3 md:py-3 lg:py-4 rounded-lg border-2 transition-all duration-200 hover:shadow-lg"
            style={{ 
              borderColor: `${primaryColor}30`,
              backgroundColor: `${primaryColor}08`,
              color: primaryColor
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Practice with Sample Questions (Offline)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PracticeInterview;

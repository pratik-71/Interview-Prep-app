import React, { useState, useEffect } from 'react';
import { fieldsData, Subfield } from '../data/fieldsData';
import { useThemeStore } from '../zustand_store/theme_store';
import GeminiService, { InterviewQuestionsResponse } from '../services/geminiService';
import LoadingQuestions from './LoadingQuestions';

interface PracticeInterviewProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestionsGenerated: (questions: InterviewQuestionsResponse) => void;
}

const PracticeInterview: React.FC<PracticeInterviewProps> = ({ isOpen, onClose, onQuestionsGenerated }) => {
  const [selectedField, setSelectedField] = useState<string>('');
  const [selectedSubfield, setSelectedSubfield] = useState<string>('');
  const [customInput, setCustomInput] = useState<string>('');
  const [availableSubfields, setAvailableSubfields] = useState<Subfield[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { primaryColor, secondaryColor, tertiaryColor } = useThemeStore();

  useEffect(() => {
    if (selectedField) {
      const field = fieldsData.find(f => f.id === selectedField);
      setAvailableSubfields(field ? field.subfields : []);
      setSelectedSubfield(''); // Reset subfield when field changes
      setCustomInput(''); // Reset custom input when field changes
    } else {
      setAvailableSubfields([]);
      setSelectedSubfield('');
      setCustomInput('');
    }
  }, [selectedField]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedField('');
      setSelectedSubfield('');
      setCustomInput('');
      setAvailableSubfields([]);
    }
  }, [isOpen]);

  const handleStartPractice = async () => {
    if (selectedField && selectedSubfield) {
      setIsLoading(true);
      setError(null);
      
      try {
        const geminiService = GeminiService.getInstance();
        const fieldName = fieldsData.find(f => f.id === selectedField)?.name || selectedField;
        const subfieldName = availableSubfields.find(s => s.id === selectedSubfield)?.name || selectedSubfield;
        
        const generatedQuestions = await geminiService.generateInterviewQuestions(
          fieldName,
          subfieldName,
          customInput
        );
        
        onQuestionsGenerated(generatedQuestions);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate questions');
        setIsLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  // Show loading state
  if (isLoading) {
    return (
      <LoadingQuestions
        field={fieldsData.find(f => f.id === selectedField)?.name || selectedField}
        subfield={availableSubfields.find(s => s.id === selectedSubfield)?.name || selectedSubfield}
        onCancel={() => {
          setIsLoading(false);
          setError(null);
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: `${tertiaryColor}cc` }}>
      <div className="w-full max-w-lg mx-auto" style={{ backgroundColor: secondaryColor }}>
        <div className="rounded-2xl shadow-2xl overflow-hidden border" style={{ borderColor: `${primaryColor}30` }}>
          {/* Header */}
          <div className="px-6 py-5" style={{ backgroundColor: `${primaryColor}08` }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: tertiaryColor }}>Practice Interview</h2>
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

                  {/* Content */}
          <div className="px-6 py-6 space-y-6">
            {/* Field Dropdown */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold" style={{ color: tertiaryColor }}>
                Select Field
              </label>
              <div className="relative">
                <select
                  value={selectedField}
                  onChange={(e) => setSelectedField(e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 appearance-none cursor-pointer"
                  style={{ 
                    borderColor: selectedField ? primaryColor : `${primaryColor}30`,
                    backgroundColor: selectedField ? `${primaryColor}05` : secondaryColor
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = `0 0 0 4px ${primaryColor}20`;
                    e.target.style.borderColor = primaryColor;
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none';
                    e.target.style.borderColor = selectedField ? primaryColor : `${primaryColor}30`;
                  }}
                >
                  <option value="">Choose a field...</option>
                  {fieldsData.map((field) => (
                    <option key={field.id} value={field.id}>
                      {field.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="w-5 h-5" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Subfield Dropdown */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold" style={{ color: tertiaryColor }}>
                Select Subfield
              </label>
              <div className="relative">
                <select
                  value={selectedSubfield}
                  onChange={(e) => setSelectedSubfield(e.target.value)}
                  disabled={!selectedField}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 appearance-none cursor-pointer disabled:cursor-not-allowed"
                  style={{ 
                    borderColor: selectedField ? (selectedSubfield ? primaryColor : `${primaryColor}30`) : '#d1d5db',
                    backgroundColor: selectedField ? (selectedSubfield ? `${primaryColor}05` : secondaryColor) : '#f9fafb'
                  }}
                  onFocus={(e) => {
                    if (selectedField) {
                      e.target.style.boxShadow = `0 0 0 4px ${primaryColor}20`;
                      e.target.style.borderColor = primaryColor;
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none';
                    e.target.style.borderColor = selectedField ? (selectedSubfield ? primaryColor : `${primaryColor}30`) : '#d1d5db';
                  }}
                >
                  <option value="">Choose a subfield...</option>
                  {availableSubfields.map((subfield) => (
                    <option key={subfield.id} value={subfield.id}>
                      {subfield.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="w-5 h-5" style={{ color: selectedField ? primaryColor : '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Description */}
            {selectedSubfield && (
              <div className="p-4 rounded-xl" style={{ backgroundColor: `${primaryColor}08`, border: `1px solid ${primaryColor}20` }}>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: primaryColor }}>
                      {availableSubfields.find(s => s.id === selectedSubfield)?.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Custom Input Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold" style={{ color: tertiaryColor }}>
                Additional Notes (Optional)
              </label>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter any specific topics, skills, or areas you want to focus on..."
                rows={3}
                className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 resize-none"
                style={{ 
                  borderColor: customInput ? primaryColor : `${primaryColor}30`,
                  backgroundColor: customInput ? `${primaryColor}05` : secondaryColor
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = `0 0 0 4px ${primaryColor}20`;
                  e.target.style.borderColor = primaryColor;
                  e.target.style.backgroundColor = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'none';
                  e.target.style.borderColor = customInput ? primaryColor : `${primaryColor}30`;
                  e.target.style.backgroundColor = customInput ? `${primaryColor}05` : secondaryColor;
                }}
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 rounded-xl border-2" style={{ 
                backgroundColor: '#fef2f2',
                borderColor: '#ef4444'
              }}>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#ef4444' }}>
                    !
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#dc2626' }}>
                      {error}
                    </p>
                    <p className="text-xs" style={{ color: '#dc2626' }}>
                      Please check your internet connection and try again.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 rounded-xl transition-all duration-300 font-medium"
                style={{ 
                  borderColor: `${primaryColor}30`,
                  color: tertiaryColor,
                  backgroundColor: secondaryColor
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${primaryColor}08`;
                  e.currentTarget.style.borderColor = primaryColor;
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = secondaryColor;
                  e.currentTarget.style.borderColor = `${primaryColor}30`;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleStartPractice}
                disabled={!selectedField || !selectedSubfield}
                className="flex-1 px-6 py-3 rounded-xl transition-all duration-300 font-medium disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: (!selectedField || !selectedSubfield) ? '#9ca3af' : primaryColor,
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  if (selectedField && selectedSubfield) {
                    e.currentTarget.style.backgroundColor = `${primaryColor}e6`;
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedField && selectedSubfield) {
                    e.currentTarget.style.backgroundColor = primaryColor;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                Start Practice
              </button>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeInterview;

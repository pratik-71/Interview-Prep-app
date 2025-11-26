import React, { useState, useEffect, useRef, useReducer, useCallback, useMemo } from 'react'
import { useThemeStore } from '../zustand_store/theme_store'
import { useQuestionsStore } from '../zustand_store/questions_store'
import { useAuthStore } from '../zustand_store/auth_store'
import { AnswerEvaluation, AudioAnswerEvaluation, GeminiService } from '../services/geminiService'
import { Device } from '@capacitor/device'
import { useNavigate } from 'react-router-dom'
import { isMobilePlatform } from '../utils/mobileDetection'
import { gsap } from 'gsap'
import { BACKEND_CONFIG } from '../config/backend'

// Types for analytics data
interface TestAnalytics {
  technology: string;
  totalQuestions: number;
  questionsAnswered: number;
  totalMarks: number;
  maxPossibleMarks: number;
  percentageScore: number;
  timeSpent: number;
}

// State interface
interface TestState {
  currentQuestionIndex: number;
  answer: string;
  showRecordingModal: boolean;
  hasResponseArrived: boolean;
  isAudioResult: boolean;
  audioResult: AudioAnswerEvaluation | null;
  testResult: AnswerEvaluation | null;
  isEvaluatingText: boolean;
  showExitModal: boolean;
  questionMarks: { [key: number]: number };
  questionResults: { [key: number]: AnswerEvaluation | AudioAnswerEvaluation };
  showFinalResults: boolean;
  testStartTime: number | null;
  testEndTime: number | null;
  isTestCompleted: boolean;
}

// Action types
type TestAction = 
  | { type: 'SET_CURRENT_QUESTION_INDEX'; payload: number }
  | { type: 'SET_ANSWER'; payload: string }
  | { type: 'SET_SHOW_RECORDING_MODAL'; payload: boolean }
  | { type: 'SET_HAS_RESPONSE_ARRIVED'; payload: boolean }
  | { type: 'SET_IS_AUDIO_RESULT'; payload: boolean }
  | { type: 'SET_AUDIO_RESULT'; payload: AudioAnswerEvaluation | null }
  | { type: 'SET_TEST_RESULT'; payload: AnswerEvaluation | null }
  | { type: 'SET_IS_EVALUATING_TEXT'; payload: boolean }
  | { type: 'SET_SHOW_EXIT_MODAL'; payload: boolean }
  | { type: 'UPDATE_QUESTION_MARKS'; payload: { index: number; marks: number; result: AnswerEvaluation | AudioAnswerEvaluation } }
  | { type: 'SET_SHOW_FINAL_RESULTS'; payload: boolean }
  | { type: 'START_TEST'; payload: number }
  | { type: 'COMPLETE_TEST'; payload: number }
  | { type: 'RESET_TEST' };

// Initial state
const initialState: TestState = {
  currentQuestionIndex: 0,
  answer: '',
  showRecordingModal: false,
  hasResponseArrived: false,
  isAudioResult: false,
  audioResult: null,
  testResult: null,
  isEvaluatingText: false,
  showExitModal: false,
  questionMarks: {},
  questionResults: {},
  showFinalResults: false,
  testStartTime: null,
  testEndTime: null,
  isTestCompleted: false
};

// Reducer function
function testReducer(state: TestState, action: TestAction): TestState {
  switch (action.type) {
    case 'SET_CURRENT_QUESTION_INDEX':
      return { ...state, currentQuestionIndex: action.payload };
    case 'SET_ANSWER':
      return { ...state, answer: action.payload };
    case 'SET_SHOW_RECORDING_MODAL':
      return { ...state, showRecordingModal: action.payload };
    case 'SET_HAS_RESPONSE_ARRIVED':
      return { ...state, hasResponseArrived: action.payload };
    case 'SET_IS_AUDIO_RESULT':
      return { ...state, isAudioResult: action.payload };
    case 'SET_AUDIO_RESULT':
      return { ...state, audioResult: action.payload };
    case 'SET_TEST_RESULT':
      return { ...state, testResult: action.payload };
    case 'SET_IS_EVALUATING_TEXT':
      return { ...state, isEvaluatingText: action.payload };
    case 'SET_SHOW_EXIT_MODAL':
      return { ...state, showExitModal: action.payload };
    case 'UPDATE_QUESTION_MARKS':
      return {
        ...state,
        questionMarks: { ...state.questionMarks, [action.payload.index]: action.payload.marks },
        questionResults: { ...state.questionResults, [action.payload.index]: action.payload.result }
      };
    case 'SET_SHOW_FINAL_RESULTS':
      return { ...state, showFinalResults: action.payload };
    case 'START_TEST':
      return { ...state, testStartTime: action.payload };
    case 'COMPLETE_TEST':
      return { ...state, testEndTime: action.payload, isTestCompleted: true };
    case 'RESET_TEST':
      return { ...initialState };
    default:
      return state;
  }
}

const TestComponent: React.FC = () => {
  const { questions } = useQuestionsStore();
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  

  
  // Helper function to safely get audio-specific properties
  const getAudioProperties = (result: AnswerEvaluation | AudioAnswerEvaluation | undefined) => {
    if (result && 'confidence_marks' in result) {
      return {
        confidence_level: (result as AudioAnswerEvaluation).confidence_marks,
        fluency_score: (result as AudioAnswerEvaluation).fluency_marks
      };
    }
    return { confidence_level: 0, fluency_score: 0 };
  };
  
  // Use useReducer for state management
  const [state, dispatch] = useReducer(testReducer, initialState);
  
  // Add state for textarea value to trigger re-renders
  const [textareaValue, setTextareaValue] = useState('');
  
  // Refs for animations
  const headerRef = useRef<HTMLDivElement>(null);
  const questionCardRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const inputSectionRef = useRef<HTMLDivElement>(null);
  
  // Refs for auto-scrolling to results
  const textResultRef = useRef<HTMLDivElement>(null);
  const audioResultRef = useRef<HTMLDivElement>(null);
  
  // Time tracking refs
  const testStartTimeRef = useRef<number>(0);
  
  // Select 15 questions: 5 from each difficulty level - memoized to prevent re-shuffling
  const allQuestions = useMemo(() => {
    if (!questions) return [];
    
    const beginnerQuestions = questions.beginner || [];
    const intermediateQuestions = questions.intermediate || [];
    const expertQuestions = questions.expert || [];
    
    // Take 5 from each difficulty (or all if less than 5 available)
    const selectedBeginner = beginnerQuestions.slice(0, 5);
    const selectedIntermediate = intermediateQuestions.slice(0, 5);
    const selectedExpert = expertQuestions.slice(0, 5);
    
    // Combine and shuffle
    const allSelected = [...selectedBeginner, ...selectedIntermediate, ...selectedExpert];
    
    // Fisher-Yates shuffle algorithm
    for (let i = allSelected.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allSelected[i], allSelected[j]] = [allSelected[j], allSelected[i]];
    }
    
    return allSelected;
  }, [questions]);
  
  // Get colors from theme store
   const { 
     primaryColor, 
     backgroundColor, 
     textColor, 
     textSecondaryColor,
     borderColor,
     cardColor,
     hoverColor
  } = useThemeStore();

  // Detect mobile platform
  useEffect(() => {
    setIsMobile(isMobilePlatform());
  }, []);
  
  // Start test timer when component mounts
  useEffect(() => {
    testStartTimeRef.current = Date.now();
    dispatch({ type: 'START_TEST', payload: Date.now() });
  }, []);
  
  // COMPLETELY DIFFERENT APPROACH: Direct DOM manipulation timer
  const timerRef = useRef<HTMLSpanElement>(null);
  const questionStartTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Textarea refs for direct DOM manipulation
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaValueRef = useRef<string>('');
  
  // Reset timer when question changes - NO STATE UPDATES
  useEffect(() => {
    // Clear previous interval
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    // Reset timer start time
    questionStartTimeRef.current = Date.now();
    
    // Update display immediately to 0:00
    if (timerRef.current) {
      timerRef.current.textContent = '0:00';
    }
    
    // Start new interval that ONLY updates the DOM element
    timerIntervalRef.current = setInterval(() => {
      if (timerRef.current && questionStartTimeRef.current > 0) {
        const elapsed = Math.floor((Date.now() - questionStartTimeRef.current) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        timerRef.current.textContent = `${minutes}:${String(seconds).padStart(2, '0')}`;
      }
    }, 1000);
    
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [state.currentQuestionIndex]);

  // Entrance animations
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    
    tl.fromTo(headerRef.current, 
      { y: -20, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.4 }
    )
    .fromTo(progressBarRef.current, 
      { scaleX: 0, opacity: 0 }, 
      { scaleX: 1, opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.2"
    )
    .fromTo(questionCardRef.current, 
      { y: 20, opacity: 0, scale: 0.98 }, 
      { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }, "-=0.3"
    )
    .fromTo(inputSectionRef.current, 
      { y: 20, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.3 }, "-=0.2"
    );
  }, []);

  // Animate question changes - DISABLED to fix typing issue
  // useEffect(() => {
  //   if (questionCardRef.current && state.currentQuestionIndex > 0) {
  //     gsap.fromTo(questionCardRef.current, 
  //       { x: -15, opacity: 0.9 }, 
  //       { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
  //     );
  //   }
  // }, [state.currentQuestionIndex]);

  // Auto-scroll to results when they arrive
  useEffect(() => {
    if (state.hasResponseArrived) {
      const targetRef = state.isAudioResult ? audioResultRef.current : textResultRef.current;
      if (targetRef) {
        // Add a small delay to ensure the DOM has updated
        setTimeout(() => {
          targetRef.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
          
          // Simple fade-in animation for results
          gsap.fromTo(targetRef, 
            { opacity: 0, y: 10 }, 
            { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
          );
        }, 100);
      }
    }
  }, [state.hasResponseArrived, state.isAudioResult]);

  // Calculate final results
  const calculateFinalResults = useCallback(() => {
    const answeredQuestions = Object.keys(state.questionMarks).length;
    if (answeredQuestions === 0) return null;

    const totalMarks = Object.values(state.questionMarks).reduce((sum, marks) => sum + marks, 0);
    const maxPossibleMarks = answeredQuestions * 10; // Assuming 10 is max per question
    const averageMarks = totalMarks / answeredQuestions;
    const percentage = (totalMarks / maxPossibleMarks) * 100;

    // Calculate breakdown by difficulty
    const difficultyBreakdown = {
      beginner: { count: 0, totalMarks: 0, average: 0 },
      intermediate: { count: 0, totalMarks: 0, average: 0 },
      expert: { count: 0, totalMarks: 0, average: 0 }
    };

    Object.entries(state.questionResults).forEach(([index, result]) => {
      const questionIndex = parseInt(index);
      const question = allQuestions[questionIndex];
      const difficulty = question.category as keyof typeof difficultyBreakdown;
      const marks = result.marks;

      if (difficultyBreakdown[difficulty]) {
        difficultyBreakdown[difficulty].count++;
        difficultyBreakdown[difficulty].totalMarks += marks;
      }
    });

    // Calculate averages for each difficulty
    Object.keys(difficultyBreakdown).forEach(difficulty => {
      const key = difficulty as keyof typeof difficultyBreakdown;
      if (difficultyBreakdown[key].count > 0) {
        difficultyBreakdown[key].average = difficultyBreakdown[key].totalMarks / difficultyBreakdown[key].count;
      }
    });

    return {
      totalMarks,
      maxPossibleMarks,
      averageMarks,
      percentage,
      answeredQuestions,
      totalQuestions: allQuestions.length,
      difficultyBreakdown
    };
  }, [state.questionMarks, state.questionResults, allQuestions]);

  // Send analytics to backend
  const sendAnalyticsToBackend = useCallback(async (analytics: TestAnalytics) => {
    try {
      const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/analytics/test-results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(analytics)
      });

      if (!response.ok) {
        throw new Error('Failed to send analytics');
      }
    } catch (error) {
     console.error('Failed to send analytics');
    }
  }, [token]);

  // Handle test completion
  const handleTestCompletion = useCallback(async () => {
    const results = calculateFinalResults();
    if (!results) return;

    // Calculate total time spent
    const endTime = Date.now();
    const totalTimeSpent = Math.round((endTime - testStartTimeRef.current) / 1000 / 60); // in minutes
    
    dispatch({ type: 'COMPLETE_TEST', payload: endTime });

    // Prepare analytics data
    const analytics: TestAnalytics = {
      technology: 'Interview Practice', // You can make this dynamic based on question type
        totalQuestions: allQuestions.length,
        questionsAnswered: results.answeredQuestions,
        totalMarks: results.totalMarks,
        maxPossibleMarks: results.maxPossibleMarks,
        percentageScore: results.percentage,
      timeSpent: totalTimeSpent
    };

    // Send analytics to backend
    await sendAnalyticsToBackend(analytics);

    // Show final results
    dispatch({ type: 'SET_SHOW_FINAL_RESULTS', payload: true });
  }, [calculateFinalResults, allQuestions.length, sendAnalyticsToBackend]);

  // Check if test should auto-complete
  useEffect(() => {
    if (state.currentQuestionIndex >= allQuestions.length - 1 && Object.keys(state.questionMarks).length > 0) {
      // Auto-complete test when last question is answered
      setTimeout(() => {
        handleTestCompletion();
      }, 2000);
    }
  }, [state.currentQuestionIndex, state.questionMarks, allQuestions.length, handleTestCompletion]);

  const handleBackClick = () => {
    dispatch({ type: 'SET_SHOW_EXIT_MODAL', payload: true });
  };

  const handleConfirmExit = () => {
    // Mobile-friendly navigation - always go to practice instead of relying on history
    if (isMobile) {
      navigate('/practice');
    } else {
      // On web, try to use history if available
      try {
        if (typeof window !== 'undefined' && window.history && window.history.length > 1) {
          navigate(-1);
        } else {
          navigate('/practice');
        }
      } catch (error) {
        // Fallback to practice page
        navigate('/practice');
      }
    }
    dispatch({ type: 'SET_SHOW_EXIT_MODAL', payload: false });
  };

  const handleCancelExit = () => {
    dispatch({ type: 'SET_SHOW_EXIT_MODAL', payload: false });
  };

  // Update question marks
  const updateQuestionMarks = useCallback((questionIndex: number, marks: number, result: AnswerEvaluation | AudioAnswerEvaluation) => {
    dispatch({ type: 'UPDATE_QUESTION_MARKS', payload: { index: questionIndex, marks, result } });
  }, []);

  const handleSubmitText = async () => {
    try {
      if (textareaValueRef.current.trim()) {
        dispatch({ type: 'SET_IS_EVALUATING_TEXT', payload: true });
        
        // Get current question for context
        const currentQuestion = allQuestions[state.currentQuestionIndex]?.question || 'Interview question';
        
        // Evaluate text answer using Gemini
        const geminiService = GeminiService.getInstance();
        const evaluation = await geminiService.evaluateAnswer(currentQuestion, textareaValueRef.current);
        
        // Set the result and trigger display
        dispatch({ type: 'SET_TEST_RESULT', payload: evaluation });
        dispatch({ type: 'SET_IS_AUDIO_RESULT', payload: false });
        dispatch({ type: 'SET_HAS_RESPONSE_ARRIVED', payload: true });
        
        // Track marks for this question
        updateQuestionMarks(state.currentQuestionIndex, evaluation.marks, evaluation);
        
        // Don't clear the answer - keep it visible for the user to see
        // Text answer evaluated
      }
    } catch (error) {
              // Error evaluating text answer
      alert('Failed to evaluate answer. Please try again.');
    } finally {
      dispatch({ type: 'SET_IS_EVALUATING_TEXT', payload: false });
    }
  };;

  // Check if we have questions and if current index is valid
  if (!allQuestions || !Array.isArray(allQuestions) || allQuestions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen transition-colors duration-300" style={{ backgroundColor: backgroundColor }}>
        <div className="text-center p-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" 
               style={{ backgroundColor: `${primaryColor}15` }}>
            <svg className="w-10 h-10" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className='text-2xl font-bold mb-4 transition-colors duration-300' style={{ color: textColor }}>No Questions Available</h2>
          <p className="text-lg transition-colors duration-300" style={{ color: textSecondaryColor }}>Please load some questions first</p>
        </div>
      </div>
    );
  }

  if (state.currentQuestionIndex >= allQuestions.length) {
    return (
      <div className="flex items-center justify-center min-h-screen transition-colors duration-300" style={{ backgroundColor: backgroundColor }}>
        <div className="text-center p-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" 
               style={{ backgroundColor: `${primaryColor}15` }}>
            <svg className="w-10 h-10" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h2 className='text-2xl font-bold mb-4 transition-colors duration-300' style={{ color: textColor }}>Test Completed!</h2>
          <p className="text-lg mb-6 transition-colors duration-300" style={{ color: textSecondaryColor }}>You've answered all the questions</p>

          <button 
            onClick={() => dispatch({ type: 'RESET_TEST' })}
            className="px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg"
            style={{ backgroundColor: primaryColor }}
          >
            Restart Test
          </button>
        </div>
      </div>
    );
  }
  
  const currentQuestion = allQuestions[state.currentQuestionIndex];
  const progressPercentage = ((state.currentQuestionIndex + 1) / allQuestions.length) * 100;

  return (
    <div className="h-screen p-4 sm:p-6 md:p-8 overflow-y-auto custom-scrollbar transition-colors duration-300" style={{ backgroundColor: backgroundColor }}>
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div ref={headerRef} className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {/* Left: Back Button */}
            <div className="flex-shrink-0">
              <button
                type="button"
                onClick={handleBackClick}
                className="inline-flex items-center px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors hover:shadow-sm hover:scale-105 active:scale-95"
                style={{ borderColor: `${primaryColor}40`, color: primaryColor }}
                aria-label="Go back"
                title="Go back"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: primaryColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="ml-2">Back</span>
              </button>
            </div>

            {/* Right: Page Indicator */}
            <div className="flex-shrink-0">
              <span className="text-lg font-semibold transition-all duration-200 hover:scale-110" style={{ color: primaryColor }}>
              {state.currentQuestionIndex + 1} / {allQuestions.length}
              </span>
            </div>
            
            {/* Timer */}
            <div className="flex-shrink-0 ml-4">
              <div className="flex flex-col items-center gap-1">
                <div className="text-xs font-medium" style={{ color: `${textColor}70` }}>Question Time</div>
                <div 
                  className="flex items-center gap-2 px-3 py-1 rounded-lg border-2 transition-all duration-300" 
                  style={{ 
                    borderColor: `${primaryColor}30`, 
                    backgroundColor: `${primaryColor}08`,
                    transform: 'scale(1)' // No animation to avoid state interference
                  }}
                >
                  <svg className="w-4 h-4" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span 
                    ref={timerRef}
                    className="text-sm font-medium" 
                    style={{ color: primaryColor }}
                  >
                    0:00
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div ref={progressBarRef} className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
            <div 
              className="h-3 rounded-full transition-all duration-500 ease-out shadow-lg"
              style={{ 
                width: `${progressPercentage}%`,
                backgroundColor: primaryColor
              }}
            />
          </div>
        </div>

        {/* Question Card */}
         <div ref={questionCardRef} className="rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 mb-8 transition-all duration-300 hover:scale-105" style={{ backgroundColor: cardColor }}>

          {/* Question Header with Difficulty */}
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold leading-relaxed flex-1" 
                style={{ color: textColor }}>
              {currentQuestion.question}
            </h2>
            <span className="ml-4 px-3 py-1 rounded-full text-sm font-semibold text-white capitalize"
                  style={{ 
                    backgroundColor: currentQuestion.category === 'beginner' ? '#10b981' : 
                                 currentQuestion.category === 'intermediate' ? '#f59e0b' : '#ef4444'
                  }}>
              {currentQuestion.category}
            </span>
          </div>

          {/* Answer Input */}
          <div ref={inputSectionRef} className="mb-4">
            <div className='flex justify-between items-center mb-4'>
            <label className="block text-lg font-semibold mb-2" style={{ color: primaryColor }}>
              Your Answer:
            </label>
            <button onClick={() => dispatch({ type: 'SET_SHOW_RECORDING_MODAL', payload: true })} className='py-2 px-4 text-sm rounded-lg transition-all duration-200 hover:scale-105 active:scale-95' style={{ backgroundColor: primaryColor, color: 'white' }}>
             Record Answer  
            </button>
            </div>
            <textarea
              ref={textareaRef}
              placeholder="Type your answer here..."
              className="w-full p-4 border-2 rounded-xl text-lg resize-none focus:outline-none focus:ring-4 transition-all duration-300 hover:scale-105"
              style={{ 
                borderColor: `${primaryColor}30`,
                backgroundColor: `${primaryColor}05`,
                color: textColor,
                minHeight: '200px'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = primaryColor
                e.target.style.backgroundColor = `${primaryColor}08`
              }}
              onBlur={(e) => {
                e.target.style.borderColor = `${primaryColor}30`
                e.target.style.backgroundColor = `${primaryColor}05`
              }}
              onInput={(e) => {
                // Update both ref and state to trigger re-renders
                const target = e.target as HTMLTextAreaElement;
                const value = target.value;
                textareaValueRef.current = value;
                setTextareaValue(value);
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Submit Button */}
            <button 
              onClick={handleSubmitText}
              disabled={!textareaValue.trim() || state.isEvaluatingText}
              className="flex-1 px-4 py-2 rounded-xl text-white font-semibold text-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              style={{ 
                backgroundColor: textareaValue.trim() && !state.isEvaluatingText ? primaryColor : `${primaryColor}50`
              }}
            >
              {state.isEvaluatingText ? 'Evaluating...' : 'Submit Answer'}
            </button>

            {/* Next Button */}
           <div className='flex justify-between gap-4'>
                       <button 
              onClick={() => {
                // Move to previous question - no analytics needed
                dispatch({ type: 'SET_CURRENT_QUESTION_INDEX', payload: state.currentQuestionIndex - 1 });
                
                // Clear all previous question state
                dispatch({ type: 'SET_ANSWER', payload: '' });
                dispatch({ type: 'SET_HAS_RESPONSE_ARRIVED', payload: false });
                dispatch({ type: 'SET_IS_AUDIO_RESULT', payload: false });
                dispatch({ type: 'SET_AUDIO_RESULT', payload: null });
                dispatch({ type: 'SET_TEST_RESULT', payload: null });
                dispatch({ type: 'SET_IS_EVALUATING_TEXT', payload: false });
                
                // Clear textarea using refs and state
                textareaValueRef.current = '';
                setTextareaValue('');
                if (textareaRef.current) {
                  textareaRef.current.value = '';
                }
                
                // Reset question start time for new question
                questionStartTimeRef.current = Date.now();
                
                // Scroll to top of the page
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                // Also scroll the main container if it exists
                const mainContainer = document.querySelector('.min-h-screen');
                if (mainContainer) {
                  mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              disabled={state.currentQuestionIndex === 0}
              className="flex-1 px-4 py-2 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 border-2 shadow-lg"
              style={{ 
                borderColor: primaryColor,
                color: primaryColor,
                backgroundColor: 'transparent'
              }}
            >
              Prev
            </button>

            <button 
              onClick={async () => {
                // Save current question data to backend ONLY if marks exist (answer was submitted)
                if (state.questionMarks[state.currentQuestionIndex]) {
                  try {
                    // Prepare analytics data for current question
                    const currentQuestion = allQuestions[state.currentQuestionIndex];
                    const questionData = {
                      technology: currentQuestion.category,
                      difficulty_level: currentQuestion.category,
                      question_text: currentQuestion.question,
                      user_answer: textareaValueRef.current.trim() || 'Audio Answer',
                      marks_obtained: state.questionMarks[state.currentQuestionIndex],
                      max_marks: 10,
                      time_spent: Math.floor((Date.now() - questionStartTimeRef.current) / 1000), // Time spent on this question
                      ...getAudioProperties(state.questionResults[state.currentQuestionIndex]),
                      feedback: state.questionResults[state.currentQuestionIndex]?.feedback || '',
                      test_date: new Date().toISOString()
                    };

                                                    // Send to backend
                                 await fetch(`${BACKEND_CONFIG.API_BASE_URL}/analytics/question-results`, {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                  },
                                  body: JSON.stringify(questionData)
                                });

                   
                  } catch (error) {
                    // Error saving question data
                    // Don't block user experience if analytics fails
                  }
                }

                // Move to next question
                dispatch({ type: 'SET_CURRENT_QUESTION_INDEX', payload: state.currentQuestionIndex + 1 });
                
                // Clear all previous question state
                dispatch({ type: 'SET_ANSWER', payload: '' });
                dispatch({ type: 'SET_HAS_RESPONSE_ARRIVED', payload: false });
                dispatch({ type: 'SET_IS_AUDIO_RESULT', payload: false });
                dispatch({ type: 'SET_AUDIO_RESULT', payload: null });
                dispatch({ type: 'SET_TEST_RESULT', payload: null });
                dispatch({ type: 'SET_IS_EVALUATING_TEXT', payload: false });
                
                // Clear textarea using refs and state
                textareaValueRef.current = '';
                setTextareaValue('');
                if (textareaRef.current) {
                  textareaRef.current.value = '';
                }
                
                // Reset question start time for new question
                questionStartTimeRef.current = Date.now();
                
                // Scroll to top of the page
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                // Also scroll the main container if it exists
                const mainContainer = document.querySelector('.min-h-screen');
                if (mainContainer) {
                  mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              disabled={state.currentQuestionIndex === allQuestions.length - 1}
              className="flex-1 px-4 py-2 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 border-2 shadow-lg"
              style={{ 
                borderColor: primaryColor,
                color: primaryColor,
                backgroundColor: 'transparent'
              }}
            >
              Next
            </button>
           </div>


          </div>
        </div>

        {/* Text Result Display */}
        {!state.isAudioResult && state.hasResponseArrived && state.testResult && (
           <div ref={textResultRef} className='rounded-2xl shadow-xl p-4 sm:p-4 md:p-6 mb-8 transition-all duration-300 hover:scale-105' style={{ backgroundColor: cardColor }}>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-12 h-12 rounded-full flex items-center justify-center' style={{ backgroundColor: `${primaryColor}15` }}>
                <svg className='w-6 h-6' style={{ color: primaryColor }} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                </svg>
              </div>
              <h2 className='text-xl sm:text-2xl md:text-3xl font-bold' style={{ color: textColor }}>
                Text Answer Evaluation
              </h2>
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-1'>
              {/* Marks Section */}
              <div className='p-3 rounded-xl' style={{ backgroundColor: `${primaryColor}08` }}>
                <div className='flex items-center gap-3 mb-3'>
                  <div className='w-8 h-8 rounded-full flex items-center justify-center' style={{ backgroundColor: primaryColor }}>
                    <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
                    </svg>
                  </div>
                  <span className='text-lg font-semibold' style={{ color: textColor }}>Overall Score</span>
                </div>
                <div className='text-3xl font-bold' style={{ color: primaryColor }}>
                  {state.testResult.marks}/10
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2 mt-2'>
                  <div 
                    className='h-2 rounded-full transition-all duration-500'
                    style={{ 
                      width: `${(state.testResult.marks / 10) * 100}%`,
                      backgroundColor: primaryColor
                    }}
                  />
                </div>
              </div>

              {/* Feedback Section */}
              <div className='p-3 rounded-xl' style={{ backgroundColor: `${primaryColor}08` }}>
                <div className='flex items-center gap-3 mb-3'>
                  <div className='w-8 h-8 rounded-full flex items-center justify-center' style={{ backgroundColor: primaryColor }}>
                    <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
                    </svg>
                  </div>
                  <span className='text-lg font-semibold' style={{ color: textColor }}>Feedback</span>
                </div>
                <p className='text-base leading-relaxed' style={{ color: textColor }}>
                  {state.testResult.feedback}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Audio Result Display */}
        {state.isAudioResult && state.hasResponseArrived && state.audioResult && (
           <div ref={audioResultRef} className='rounded-2xl shadow-xl p-4 sm:p-4 md:p-6 mb-8 transition-colors duration-300' style={{ backgroundColor: cardColor }}>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-12 h-12 rounded-full flex items-center justify-center' style={{ backgroundColor: `${primaryColor}15` }}>
                <svg className='w-6 h-6' style={{ color: primaryColor }} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' />
                </svg>
              </div>
              <h2 className='text-xl sm:text-2xl md:text-3xl font-bold' style={{ color: textColor }}>
                Audio Answer Evaluation
              </h2>
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-3 gap-1 mb-6'>
              {/* Overall Marks */}
              <div className='p-3 rounded-xl text-center' style={{ backgroundColor: `${primaryColor}08` }}>
                <div className='text-2xl font-bold' style={{ color: primaryColor }}>
                  {state.audioResult.marks}/100
                </div>
                <div className='text-sm font-medium' style={{ color: textColor }}>Overall Score</div>
                <div className='w-full bg-gray-200 rounded-full h-2 mt-2'>
                  <div 
                    className='h-2 rounded-full transition-all duration-500'
                    style={{ 
                      width: `${state.audioResult.marks}%`,
                      backgroundColor: primaryColor
                    }}
                  />
                </div>
              </div>

              {/* Confidence Marks */}
              <div className='p-3 rounded-xl text-center' style={{ backgroundColor: `${primaryColor}08` }}>
                <div className='text-2xl font-bold' style={{ color: primaryColor }}>
                  {state.audioResult.confidence_marks}/100
                </div>
                <div className='text-sm font-medium' style={{ color: textColor }}>Confidence</div>
                <div className='w-full bg-gray-200 rounded-full h-2 mt-2'>
                  <div 
                    className='h-2 rounded-full transition-all duration-500'
                    style={{ 
                      width: `${state.audioResult.confidence_marks}%`,
                      backgroundColor: primaryColor
                    }}
                  />
                </div>
              </div>

              {/* Fluency Marks */}
              <div className='p-3 rounded-xl text-center' style={{ backgroundColor: `${primaryColor}08` }}>
                <div className='text-2xl font-bold' style={{ color: primaryColor }}>
                  {state.audioResult.fluency_marks}/100
                </div>
                <div className='text-sm font-medium' style={{ color: textColor }}>Fluency</div>
                <div className='w-full bg-gray-200 rounded-full h-2 mt-2'>
                  <div 
                    className='h-2 rounded-full transition-all duration-500'
                    style={{ 
                      width: `${state.audioResult.fluency_marks}%`,
                      backgroundColor: primaryColor
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Feedback Section */}
            <div className='p-3 rounded-xl' style={{ backgroundColor: `${primaryColor}05` }}>
              <div className='flex items-center gap-3 mb-3'>
                <div className='w-8 h-8 rounded-full flex items-center justify-center' style={{ backgroundColor: primaryColor }}>
                  <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 12h.01M12 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
                  </svg>
                </div>
                <span className='text-lg font-semibold' style={{ color: textColor }}>Detailed Feedback</span>
              </div>
              <p className='text-base leading-relaxed' style={{ color: textColor }}>
                {state.audioResult.feedback}
              </p>
            </div>
          </div>
        )}


      </div>
                          {state.showRecordingModal && (
               <>
                 {/* Backdrop with blur effect */}
                 <div 
                   className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
                   onClick={() => dispatch({ type: 'SET_SHOW_RECORDING_MODAL', payload: false })}
                 />
                 {/* Modal */}
                 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                   <RecordAnswer 
                       dispatch={dispatch} 
                       currentQuestion={allQuestions[state.currentQuestionIndex]?.question || 'Interview question'}
                       currentQuestionIndex={state.currentQuestionIndex}
                     updateQuestionMarks={updateQuestionMarks}
                   />
                 </div>
               </>
             )}

      {/* Final Results Modal */}
      {state.showFinalResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
           <div className="rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-300" style={{ backgroundColor: cardColor }}>
            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="mx-auto flex items-center justify-center w-20 h-20 rounded-full mb-4" style={{ backgroundColor: `${primaryColor}15` }}>
                  <svg className="w-10 h-10" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold mb-2" style={{ color: textColor }}>
                  Test Results
                </h2>
                                 <p className="text-lg" style={{ color: `${textSecondaryColor}80` }}>
                  Here's how you performed in your interview test
                </p>
              </div>

              {/* Results Summary */}
              {(() => {
                const results = calculateFinalResults();
                if (!results) return null;

                return (
                  <div className="space-y-6">
                    {/* Overall Score */}
                    <div className="text-center p-6 rounded-2xl" style={{ backgroundColor: `${primaryColor}08` }}>
                      <div className="text-4xl font-bold mb-2" style={{ color: primaryColor }}>
                        {results.totalMarks}/{results.maxPossibleMarks}
                      </div>
                                             <div className="text-xl font-semibold mb-2" style={{ color: textColor }}>
                        {results.percentage.toFixed(1)}%
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="h-3 rounded-full transition-all duration-1000"
                          style={{ 
                            width: `${results.percentage}%`,
                            backgroundColor: primaryColor
                          }}
                        />
                      </div>
                                             <div className="text-sm mt-2" style={{ color: `${textSecondaryColor}70` }}>
                        {results.answeredQuestions} out of {results.totalQuestions} questions answered
                      </div>
                    </div>

                    {/* Difficulty Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(results.difficultyBreakdown).map(([difficulty, stats]) => (
                        stats.count > 0 && (
                          <div key={difficulty} className="p-4 rounded-xl text-center" style={{ backgroundColor: `${primaryColor}05` }}>
                            <div className="text-lg font-semibold mb-2 capitalize" style={{ color: textColor }}>
                              {difficulty}
                            </div>
                            <div className="text-2xl font-bold mb-1" style={{ color: primaryColor }}>
                              {stats.average.toFixed(1)}/10
                            </div>
                            <div className="text-sm" style={{ color: `${textColor}70` }}>
                              {stats.count} question{stats.count !== 1 ? 's' : ''}
                            </div>
                          </div>
                        )
                      ))}
                    </div>

                    {/* Question-by-Question Results */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold" style={{ color: textColor }}>
                        Question Details
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        {allQuestions.map((question, index) => {
                          const marks = state.questionMarks[index];
                          const isAnswered = marks !== undefined;
                          
                          return (
                            <div key={index} className="p-4 rounded-xl border-2 transition-colors duration-300" style={{
                              borderColor: isAnswered ? '#10b981' : borderColor,
                              backgroundColor: isAnswered ? `${primaryColor}10` : cardColor
                            }}>
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className="text-sm font-medium px-2 py-1 rounded-full text-white capitalize"
                                          style={{ 
                                            backgroundColor: question.category === 'beginner' ? '#10b981' : 
                                                         question.category === 'intermediate' ? '#f59e0b' : '#ef4444'
                                          }}>
                                      {question.category}
                                    </span>
                                    <span className="text-sm" style={{ color: `${textColor}70` }}>
                                      Question {index + 1}
                                    </span>
                                  </div>
                                  <div className="text-sm" style={{ color: textColor }}>
                                    {question.question.length > 100 ? question.question.substring(0, 100) + '...' : question.question}
                                  </div>
                                </div>
                                <div className="text-right ml-4">
                                  {isAnswered ? (
                                    <div className="text-lg font-bold" style={{ color: primaryColor }}>
                                      {marks}/10
                                    </div>
                                  ) : (
                                    <div className="text-sm" style={{ color: `${textColor}50` }}>
                                      Not answered
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Difficulty Level Summary */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold" style={{ color: textColor }}>
                        Difficulty Level Summary
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Beginner Summary */}
                        <div className="p-4 rounded-xl border-2" style={{ borderColor: '#10b981', backgroundColor: '#f0fdf4' }}>
                          <div className="text-center">
                            <div className="text-lg font-semibold mb-2 text-green-800">Beginner</div>
                            <div className="text-2xl font-bold mb-1 text-green-600">
                              {(() => {
                                const beginnerStats = results.difficultyBreakdown.beginner;
                                return beginnerStats.count > 0 ? `${beginnerStats.totalMarks}/${beginnerStats.count * 10}` : '0/0';
                              })()}
                            </div>
                            <div className="text-sm text-green-700">
                              {(() => {
                                const beginnerStats = results.difficultyBreakdown.beginner;
                                return beginnerStats.count > 0 ? `${beginnerStats.average.toFixed(1)}/10 avg` : 'No questions';
                              })()}
                            </div>
                          </div>
                        </div>

                        {/* Intermediate Summary */}
                        <div className="p-4 rounded-xl border-2" style={{ borderColor: '#f59e0b', backgroundColor: '#fffbeb' }}>
                          <div className="text-center">
                            <div className="text-lg font-semibold mb-2 text-amber-800">Intermediate</div>
                            <div className="text-2xl font-bold mb-1 text-amber-600">
                              {(() => {
                                const intermediateStats = results.difficultyBreakdown.intermediate;
                                return intermediateStats.count > 0 ? `${intermediateStats.totalMarks}/${intermediateStats.count * 10}` : '0/0';
                              })()}
                            </div>
                            <div className="text-sm text-amber-700">
                              {(() => {
                                const intermediateStats = results.difficultyBreakdown.intermediate;
                                return intermediateStats.count > 0 ? `${intermediateStats.average.toFixed(1)}/10 avg` : 'No questions';
                              })()}
                            </div>
                          </div>
                        </div>

                        {/* Expert Summary */}
                        <div className="p-4 rounded-xl border-2" style={{ borderColor: '#ef4444', backgroundColor: '#fef2f2' }}>
                          <div className="text-center">
                            <div className="text-lg font-semibold mb-2 text-red-800">Expert</div>
                            <div className="text-2xl font-bold mb-1 text-red-600">
                              {(() => {
                                const expertStats = results.difficultyBreakdown.expert;
                                return expertStats.count > 0 ? `${expertStats.totalMarks}/${expertStats.count * 10}` : '0/0';
                              })()}
                            </div>
                            <div className="text-sm text-red-700">
                              {(() => {
                                const expertStats = results.difficultyBreakdown.expert;
                                return expertStats.count > 0 ? `${expertStats.average.toFixed(1)}/10 avg` : 'No questions';
                              })()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  onClick={() => {
                      dispatch({ type: 'RESET_TEST' });
                  }}
                  className="flex-1 px-6 py-3 rounded-xl font-medium text-white transition-all duration-300 hover:scale-105 shadow-lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  Take Test Again
                </button>
                <button
                  onClick={() => {
                    dispatch({ type: 'SET_SHOW_FINAL_RESULTS', payload: false });
                    navigate('/practice');
                  }}
                  className="flex-1 px-6 py-3 rounded-xl font-medium border-2 transition-all duration-300 hover:scale-105"
                  style={{ 
                    borderColor: primaryColor,
                    color: primaryColor,
                     backgroundColor: cardColor
                  }}
                >
                  Back to Practice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exit Confirmation Modal */}
      {state.showExitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
           <div className="rounded-2xl shadow-2xl max-w-md w-full p-6 transition-colors duration-300" style={{ backgroundColor: cardColor }}>
            <div className="text-center">
              {/* Warning Icon */}
              <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: `${primaryColor}15` }}>
                <svg className="w-8 h-8" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-bold mb-2" style={{ color: textColor }}>
                End Test?
              </h3>
              
              {/* Message */}
                               <p className="mb-6 transition-colors duration-300" style={{ color: textSecondaryColor }}>
                Are you sure you want to end this test? Your progress will be lost.
              </p>
              
              {/* Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleCancelExit}
                  className="flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-colors"
                  style={{ 
                    borderColor: `${primaryColor}40`,
                    color: primaryColor,
                     backgroundColor: cardColor
                  }}
                  onMouseEnter={(e) => {
                     e.currentTarget.style.backgroundColor = hoverColor
                  }}
                  onMouseLeave={(e) => {
                     e.currentTarget.style.backgroundColor = cardColor
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmExit}
                  className="flex-1 px-4 py-2 rounded-lg font-medium text-white transition-colors"
                  style={{ backgroundColor: primaryColor }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1'
                  }}
                >
                  End Test
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    
  )
}

export default TestComponent

const RecordAnswer = ({dispatch, currentQuestion, currentQuestionIndex, updateQuestionMarks}: {dispatch: React.Dispatch<any>, currentQuestion: string, currentQuestionIndex: number, updateQuestionMarks: (questionIndex: number, marks: number, result: AnswerEvaluation | AudioAnswerEvaluation) => void}) => {
  const { primaryColor, textColor, cardColor, hoverColor } = useThemeStore();
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt' | 'checking'>('checking');
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile and get permissions
  useEffect(() => {
    const checkDeviceAndPermissions = async () => {
      try {
        // Check if device is mobile
        const info = await Device.getInfo();
        setIsMobile(info.platform === 'ios' || info.platform === 'android');
        
        // Check microphone permission
        if (navigator.permissions && navigator.permissions.query) {
          const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          setPermissionStatus(permission.state);
        } else {
          // Fallback for browsers that don't support permissions API
          setPermissionStatus('prompt');
        }
      } catch (error) {
        // Device info not available, assuming web browser
        setIsMobile(false);
        setPermissionStatus('prompt');
      }
    };
    
    checkDeviceAndPermissions();
  }, []);

  // Request microphone permission
  const requestMicrophonePermission = async () => {
    try {
      // Request permission with mobile-optimized settings
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: isMobile ? 44100 : 48000,
          channelCount: 1
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setPermissionStatus('granted');
      stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
      return true;
    } catch (error) {
              // Microphone permission denied
      setPermissionStatus('denied');
      return false;
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      // Always request permission when user clicks Start Recording
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        alert('Microphone permission is required to record audio.');
        return;
      }
      
      // Get audio stream with mobile-optimized settings
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: isMobile ? 44100 : 48000,
          channelCount: 1
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Handle MIME type compatibility for Android
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm')) {
        mimeType = 'audio/webm';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
        mimeType = 'audio/ogg';
      } else {
        mimeType = 'audio/webm'; // fallback
      }
      
      const recorder = new MediaRecorder(stream, { mimeType });
      
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (e) => chunks.push(e.data);
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
      
      // Timer for recording
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      recorder.onstop = () => {
        clearInterval(timer);
        const blob = new Blob(chunks, { type: mimeType });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      };
    } catch (error) {
              // Error accessing microphone
      if (isMobile) {
        if (error instanceof DOMException && error.name === 'NotAllowedError') {
          alert('Microphone permission denied. Please enable it in your device settings.');
        } else if (error instanceof DOMException && error.name === 'NotSupportedError') {
          alert('Audio recording is not supported on this device.');
        } else {
          alert('Microphone access error. Please check your device settings and try again.');
        }
      } else {
        alert('Please allow microphone access to record audio');
      }
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  // Play recorded audio
  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
      setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
    }
  };

  // Handle file upload
  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioBlob(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setRecordingTime(0);
    }
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
     <div className='rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transition-colors duration-300' style={{ backgroundColor: cardColor, border: `1px solid ${primaryColor}20` }}>
      {/* Header */}
      <div className='p-6 pb-4' style={{ backgroundColor: `${primaryColor}05` }}>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 rounded-full flex items-center justify-center' style={{ backgroundColor: primaryColor }}>
              <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' />
              </svg>
            </div>
    <div>
              <h3 className='text-lg font-semibold' style={{ color: textColor }}>
                Audio Answer
              </h3>
              <p className='text-sm' style={{ color: `${textColor}70` }}>
                Record or upload your answer
              </p>
            </div>
          </div>
          <button 
            onClick={() => dispatch({ type: 'SET_SHOW_RECORDING_MODAL', payload: false })}
             className='p-2 rounded-full hover:shadow-sm transition-all duration-200'
             style={{ backgroundColor: 'transparent' }}
             onMouseEnter={(e) => {
               e.currentTarget.style.backgroundColor = hoverColor
             }}
             onMouseLeave={(e) => {
               e.currentTarget.style.backgroundColor = 'transparent'
             }}
           >
            <svg className='w-5 h-5' style={{ color: textColor }} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className='p-6'>
        {/* Permission Status */}
        {isMobile && (
          <div className='mb-4 p-3 rounded-lg border-2' style={{ 
            backgroundColor: permissionStatus === 'granted' ? `${primaryColor}10` : `${primaryColor}05`,
            borderColor: permissionStatus === 'granted' ? `${primaryColor}30` : `${primaryColor}20`
          }}>
            <div className='flex items-center space-x-2'>
              <div className={`w-3 h-3 rounded-full ${
                permissionStatus === 'granted' ? 'bg-green-500' : 
                permissionStatus === 'denied' ? 'bg-red-500' : 'bg-yellow-500'
              }`}></div>
              <span className='text-sm font-medium' style={{ color: textColor }}>
                {permissionStatus === 'granted' ? 'Microphone Ready' :
                 permissionStatus === 'denied' ? 'Microphone Access Denied' :
                 permissionStatus === 'checking' ? 'Checking...' : 'Click Start Recording to Grant Permission'}
              </span>
            </div>
            {permissionStatus === 'denied' && (
              <p className='text-xs mt-1' style={{ color: `${textColor}70` }}>
                Please enable microphone access in your device settings.
              </p>
            )}
          </div>
        )}

        {/* Recording Controls */}
        <div className='space-y-3 mb-6'>
          {!isRecording ? (
            <button 
              onClick={startRecording}
              className='w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-xl text-white font-medium transition-all duration-200 hover:scale-105 shadow-lg'
              style={{ backgroundColor: primaryColor }}
            >
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3 3z' />
              </svg>
              <span className='text-lg'>Start Recording</span>
            </button>
          ) : (
            <button 
              onClick={stopRecording}
              className='w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-xl text-white font-medium transition-all duration-200 hover:scale-105 shadow-lg'
              style={{ backgroundColor: '#ef4444' }}
            >
                              <div className='w-4 h-4 rounded-full animate-pulse' style={{ backgroundColor: cardColor }}></div>
              <span className='text-lg'>Stop Recording</span>
            </button>
          )}

          {/* Divider */}
          <div className='flex items-center'>
            <div className='flex-1 h-px' style={{ backgroundColor: `${primaryColor}20` }}></div>
            <span className='px-4 text-sm' style={{ color: `${textColor}50` }}>or</span>
            <div className='flex-1 h-px' style={{ backgroundColor: `${primaryColor}20` }}></div>
          </div>

          {/* Upload Button */}
          <label className='w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg' style={{ borderColor: primaryColor, color: primaryColor }}>
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' />
            </svg>
            <span className='text-lg'>Upload Audio File</span>
            <input type='file' accept='audio/*' className='hidden' onChange={handleAudioChange} />
          </label>
        </div>

        {/* Audio Player */}
        {audioUrl && (
          <div className='p-4 rounded-xl border-2' style={{ backgroundColor: `${primaryColor}05`, borderColor: `${primaryColor}20` }}>
            <div className='flex items-center space-x-4 mb-4'>
              <button 
                onClick={playAudio}
                disabled={isPlaying}
                className='flex items-center justify-center w-14 h-14 rounded-full transition-all duration-200 hover:scale-105 shadow-lg'
                style={{ backgroundColor: isPlaying ? `${primaryColor}50` : primaryColor }}
              >
                {isPlaying ? (
                  <svg className='w-7 h-7 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 9v6m4-6v6' />
                  </svg>
                ) : (
                  <svg className='w-7 h-7 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                )}
              </button>
              
              <div className='flex-1'>
                <div className='text-sm font-semibold' style={{ color: textColor }}>
                  {audioBlob ? `Recorded Audio` : 'Uploaded Audio'}
                </div>
                <div className='text-xs' style={{ color: `${textColor}70` }}>
                  {audioBlob ? `${formatTime(recordingTime)} • ${(audioBlob.size / 1024).toFixed(1)} KB` : 'Audio file loaded'}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex space-x-3'>
              <button 
                onClick={() => {
                  setAudioBlob(null);
                  setAudioUrl('');
                  setRecordingTime(0);
                }}
                className='flex-1 py-3 px-4 text-sm rounded-lg transition-all duration-200 hover:scale-105 border-2'
                 style={{ borderColor: `${primaryColor}30`, color: primaryColor, backgroundColor: cardColor }}
              >
                Clear
              </button>
              <button 
                onClick={async () => {
                  if (audioBlob) {
                    try {
                      setIsEvaluating(true);
                      
                      // Evaluate audio using Gemini
                      const geminiService = GeminiService.getInstance();
                      const evaluation = await geminiService.evaluateAudioAnswer(currentQuestion, audioBlob);
                      
                      // Don't set the answer text, just store the evaluation results
                      dispatch({ type: 'SET_ANSWER', payload: '' }); // Clear the input box
                      dispatch({ type: 'SET_AUDIO_RESULT', payload: evaluation });
                      dispatch({ type: 'SET_IS_AUDIO_RESULT', payload: true });
                      dispatch({ type: 'SET_HAS_RESPONSE_ARRIVED', payload: true }); // Show the results
                      dispatch({ type: 'SET_SHOW_RECORDING_MODAL', payload: false });
                      // handleSubmitAudio(); // This function is no longer needed here
                      updateQuestionMarks(currentQuestionIndex, evaluation.marks, evaluation);
                    } catch (error) {
                      // Error evaluating audio
                      console.error('Error evaluating audio:', error);
                      alert('Failed to evaluate audio. Please try again.');
                      setIsEvaluating(false);
                    } finally {
                      setIsEvaluating(false);
                    }
                  }
                }}
                disabled={!audioBlob || isEvaluating}
                className='flex-1 py-3 px-4 text-sm rounded-lg text-white transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
                style={{ backgroundColor: audioBlob && !isEvaluating ? primaryColor : `${primaryColor}50` }}
              >
                {isEvaluating ? 'Evaluating...' : 'Submit Answer'}
              </button>
            </div>
          </div>
        )}

        {/* Recording Status */}
        {isRecording && (
          <div className='flex items-center justify-center space-x-3 py-3 px-4 rounded-xl' style={{ backgroundColor: `${primaryColor}10` }}>
            <div className='w-3 h-3 rounded-full bg-red-500 animate-pulse'></div>
            <span className='text-sm font-medium' style={{ color: '#ef4444' }}>
              Recording... {formatTime(recordingTime)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

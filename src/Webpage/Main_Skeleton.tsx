import React, { useState } from 'react'
import PracticeInterview from './PracticeInterview'
import { useThemeStore } from '../zustand_store/theme_store'
import { InterviewQuestionsResponse } from '../services/geminiService'
import { sampleQuestions } from '../data/sampleQuestions'
import TestComponent from './Test_Component'

const MainSkeleton = () => {
    // ===== STATE MANAGEMENT =====
    const [activeTab, setActiveTab] = useState('dashboard')
    const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false)
    const [questions, setQuestions] = useState<InterviewQuestionsResponse | null>(null)
    const [openQuestionId, setOpenQuestionId] = useState<string | null>(null)
    const [activeCategory, setActiveCategory] = useState<'beginner' | 'intermediate' | 'expert'>('beginner')
    const [isTestStarted, setIsTestStarted] = useState(false)

    // Get colors from theme store
    const { primaryColor, secondaryColor, tertiaryColor } = useThemeStore()

    // ===== HELPER FUNCTIONS =====

    // Toggle question expansion - show or hide answer
    const toggleQuestionExpansion = (questionId: string) => {
        if (openQuestionId === questionId) {
            // If open, close it
            setOpenQuestionId(null)
        } else {
            // If closed, open it (and close any other open question)
            setOpenQuestionId(questionId)
        }
    }

    // Handle main tab click
    const handleMainTabClick = (tabName: 'practice' | 'dashboard') => {
        setActiveTab(tabName)
        if (tabName === 'practice' && !questions) {
            setIsPracticeModalOpen(true)
        }
    }

    const handleCategoryClick = (category: 'beginner' | 'intermediate' | 'expert') => {
        setActiveCategory(category)
    }

    // Render the main header
    const renderHeader = () => (
        <div className='flex items-center justify-between mb-1 sm:mb-2 md:mb-4'>
            {/* Left side - Title */}
            <h2 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold'
                style={{ color: tertiaryColor }}>
                Interview Questions
            </h2>

            {/* Right side - Button */}
            <button
                className="rounded-lg px-4 py-2 text-white transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: primaryColor }}
                onClick={() => setIsTestStarted(true)}
            >
                Start Test
            </button>
        </div>
    )

    // Render category tabs (Beginner, Intermediate, Expert)
    const renderCategoryTabs = () => {
        const categories = ['beginner', 'intermediate', 'expert'] as const

        return (
            <div className='flex space-x-1 sm:space-x-2 mb-4 sm:mb-6 md:mb-8 justify-center'>
                {categories.map((category, index) => {
                    const isActive = activeCategory === category

                    // Define colors for each category
                    const categoryColors = [
                        { bg: `${primaryColor}15`, text: primaryColor, border: `${primaryColor}30` },     // Beginner
                        { bg: `${secondaryColor}`, text: tertiaryColor, border: `${primaryColor}20` },   // Intermediate  
                        { bg: `${tertiaryColor}15`, text: tertiaryColor, border: `${primaryColor}40` }   // Expert
                    ]
                    const colors = categoryColors[index]

                    return (
                        <div
                            key={category}
                            className={`flex items-center justify-center space-x-2 sm:space-x-3 px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 md:py-4 rounded-lg sm:rounded-xl font-medium sm:font-semibold shadow-md sm:shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 ${isActive ? 'ring-2 ring-offset-2' : ''
                                }`}
                            style={{
                                backgroundColor: isActive ? primaryColor : colors.bg,
                                color: isActive ? 'white' : colors.text,
                                border: `2px solid ${isActive ? primaryColor : colors.border}`
                            }}
                            onClick={() => handleCategoryClick(category)}
                        >
                            {/* Category name */}
                            <span className='capitalize text-xs sm:text-sm md:text-base lg:text-lg'>
                                {category}
                            </span>

                            {/* Question count badge */}
                            <span className='px-1 sm:px-2 md:px-3 py-1 rounded-full text-xs sm:text-sm font-bold text-white'
                                style={{
                                    backgroundColor: isActive ? 'white' : primaryColor,
                                    color: isActive ? primaryColor : 'white'
                                }}>
                                {questions?.[category]?.length || 0}
                            </span>
            </div>
                    )
                })}
          </div>
        )
    }

    // Render a single question card
    const renderQuestionCard = (question: any, index: number) => {
        // Get border color based on active category
        const categoryColors = {
            beginner: `${primaryColor}30`,
            intermediate: `${primaryColor}20`,
            expert: `${primaryColor}40`
        }
        const borderColor = categoryColors[activeCategory]
        const isExpanded = openQuestionId === question.id

        return (
            <div
                key={question.id}
                className='p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg sm:rounded-xl border-2 shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer'
                style={{
                    borderColor: borderColor,
                    backgroundColor: secondaryColor
                }}
                onClick={() => toggleQuestionExpansion(question.id)}
            >
                {/* Question header with number and text */}
                <div className='flex items-start space-x-2 sm:space-x-3 md:space-x-4'>
                    {/* Question number circle */}
                    <div className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white text-sm sm:text-base md:text-lg font-bold flex-shrink-0'
                        style={{ backgroundColor: primaryColor }}>
                        {index + 1}
                    </div>

                    {/* Question content */}
                    <div className='flex-1 min-w-0'>
                        <p className='text-sm sm:text-base md:text-lg lg:text-xl font-medium mb-2 sm:mb-3'
                            style={{ color: tertiaryColor }}>
                            {question.question}
                        </p>

                        {/* Question footer with category and expand info */}
                        <div className='flex items-center justify-between'>
                            {/* Category badge */}
                            <span className='px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold text-white'
                                style={{ backgroundColor: primaryColor }}>
                                {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
                            </span>

                            {/* Expand/collapse indicator */}
                            <div className='flex items-center space-x-2'>
                                {isExpanded ? (
                                    // If expanded, show "Click to collapse" with down arrow
                                    <>
                                        <span className='text-xs sm:text-sm' style={{ color: `${tertiaryColor}60` }}>
                                            Click to collapse
                                        </span>
                                        <svg className='w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 rotate-180'
                                            style={{ color: primaryColor }}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </>
                                ) : (
                                    // If NOT expanded, show "Click to expand" with up arrow
                                    <>
                                        <span className='text-xs sm:text-sm' style={{ color: `${tertiaryColor}60` }}>
                                            Click to expand
                                        </span>
                                        <svg className='w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300'
                                            style={{ color: primaryColor }}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Answer section - only show when expanded */}
                {isExpanded && (
                    <div className='mt-4 pt-4 border-t' style={{ borderColor: `${primaryColor}20` }}>
                        <div className='space-y-4'>
                            {/* Answer */}
                            <div>
                                <h4 className='text-sm sm:text-base md:text-lg font-semibold mb-3'
                                    style={{ color: primaryColor }}>Sample Answer:</h4>
                                <div className='p-4 rounded-lg' style={{ backgroundColor: `${primaryColor}05`, border: `1px solid ${primaryColor}20` }}>
                                    <p className='text-sm sm:text-base md:text-lg leading-relaxed'
                                        style={{ color: tertiaryColor }}>{question.answer}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
          </div>
        )
    }

    // Render the questions list
    const renderQuestionsList = () => {
        if (!questions) return null

        return (
            <div className='flex-1 overflow-y-auto px-2 sm:px-4 md:px-6 custom-scrollbar'
                style={{
                    minHeight: 0,
                    scrollbarWidth: 'thin',
                    scrollbarColor: `${primaryColor} ${secondaryColor}`
                }}>
                <div className='space-y-4 sm:space-y-6'>
                    <div className='space-y-3 sm:space-y-4'>
                        {/* Render questions for active category */}
                        {questions[activeCategory]?.map((question, index) =>
                            renderQuestionCard(question, index)
                        )}
                    </div>
            </div>
          </div>
        )
    }

    // Render the practice interview content
    const renderPracticeContent = () => {
        if (questions) {
            // Show questions interface
            return (
                <div className='space-y-6 flex-1 flex flex-col min-h-0'>
                    {renderHeader()}
                    {renderCategoryTabs()}
                    {renderQuestionsList()}
                </div>
            )
        } else {
            // Show empty state with sample questions button
        return (
                <div className='text-center flex flex-col items-center justify-center flex-1 px-4'>
                    {/* Icon */}
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

                    {/* Title and description */}
                    <h2 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4'
                        style={{ color: tertiaryColor }}>Practice Interview</h2>
                    <p className='text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6'
                        style={{ color: `${tertiaryColor}80` }}>
                        Click the Practice Interview tab below to get started
                    </p>

                    {/* Sample questions button for testing */}
                    <div className='space-y-4 mb-6'>
                        <button
                            onClick={() => setQuestions(sampleQuestions)}
                            className='px-6 py-3 text-white rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl'
                            style={{ backgroundColor: primaryColor }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = `${primaryColor}e6`
                                e.currentTarget.style.transform = 'translateY(-1px)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = primaryColor
                                e.currentTarget.style.transform = 'translateY(0)'
                            }}
                        >
                            Load Sample Questions (Testing)
                        </button>
                        <p className='text-xs sm:text-sm' style={{ color: `${tertiaryColor}60` }}>
                            Use this button to test the interface without API calls
                        </p>
                    </div>

                    {/* Info box */}
                    <div className='p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl'
                        style={{ backgroundColor: `${primaryColor}08`, border: `1px solid ${primaryColor}20` }}>
                        <p className='text-xs sm:text-sm md:text-base' style={{ color: primaryColor }}>
                            Select your field and subfield to generate personalized interview questions
                        </p>
            </div>
          </div>
        )
        }
    }

    // Render the dashboard content
    const renderDashboardContent = () => (
        <div className='text-center flex flex-col items-center justify-center flex-1 px-4'>
            {/* Dashboard icon */}
            <div className='w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-4 sm:mb-6'
                style={{ backgroundColor: `${primaryColor}15` }}>
                <svg className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12'
                    style={{ color: primaryColor }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
      </div>
      
            {/* Dashboard title and description */}
            <h2 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4'
                style={{ color: tertiaryColor }}>Dashboard</h2>
            <p className='text-sm sm:text-base md:text-lg lg:text-xl'
                style={{ color: `${tertiaryColor}80` }}>
                View your progress and analytics
            </p>
        </div>
    )

    // Render bottom navigation tabs
    const renderBottomTabs = () => (
        <div className='px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4'
            style={{ backgroundColor: secondaryColor, borderTop: `2px solid ${primaryColor}20` }}>
            <div className='flex justify-around'>
                {/* Practice Interview Tab */}
                <button
                    onClick={() => handleMainTabClick('practice')}
                    className={`flex flex-col items-center py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6 rounded-lg sm:rounded-xl transition-all duration-300 ${activeTab === 'practice' ? 'text-white shadow-lg' : 'hover:scale-105'
                        }`}
                    style={{
                        backgroundColor: activeTab === 'practice' ? primaryColor : 'transparent',
                        color: activeTab === 'practice' ? 'white' : tertiaryColor
                    }}
                >
                    <div className='w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mb-1 sm:mb-2'>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <span className='text-xs sm:text-sm md:text-base font-medium sm:font-semibold'>
                        Practice Interview
                    </span>
                </button>

                {/* Dashboard Tab */}
            <button
                    onClick={() => handleMainTabClick('dashboard')}
                    className={`flex flex-col items-center py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6 rounded-lg sm:rounded-xl transition-all duration-300 ${activeTab === 'dashboard' ? 'text-white shadow-lg' : 'hover:scale-105'
                        }`}
                    style={{
                        backgroundColor: activeTab === 'dashboard' ? primaryColor : 'transparent',
                        color: activeTab === 'dashboard' ? 'white' : tertiaryColor
                    }}
                >
                    <div className='w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mb-1 sm:mb-2'>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <span className='text-xs sm:text-sm md:text-base font-medium sm:font-semibold'>
                        Dashboard
                    </span>
            </button>
            </div>
        </div>
    )

    // ===== MAIN RENDER =====
    return (
        <div className='flex flex-col h-screen'>

            {
                isTestStarted ? (
                     <div className='flex-1 flex flex-col p-2 sm:p-4 md:p-6 overflow-hidden' style={{ backgroundColor: secondaryColor }}>
                    <TestComponent 
                      question={questions ? [
                          ...(questions.beginner || []),
                          ...(questions.intermediate || []),
                          ...(questions.expert || [])
                      ] : []} 
                      onBack={() => setIsTestStarted(false)}
                    />
                    </div>
                ): (
                <div className='flex-1 flex flex-col p-2 sm:p-4 md:p-6 overflow-hidden'
                style={{ backgroundColor: secondaryColor }}>
                {activeTab === 'practice' ? renderPracticeContent() : renderDashboardContent()}

                 </div>
                )
            }

            {/* Bottom Tab Navigation */}
            {renderBottomTabs()}

            {/* Practice Interview Modal - Only render when needed */}
            {isPracticeModalOpen && (
                <PracticeInterview
                    isOpen={true}
                    onClose={() => setIsPracticeModalOpen(false)}
                    onQuestionsGenerated={(generatedQuestions) => {
                        setQuestions(generatedQuestions)
                        setIsPracticeModalOpen(false)
                    }}
                />
            )}
    </div>
  )
}

export default MainSkeleton

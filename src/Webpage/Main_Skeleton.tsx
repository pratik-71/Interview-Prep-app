import React, { useState } from 'react'
import { useThemeStore } from '../zustand_store/theme_store'

const MainSkeleton = () => {
    const [activeTab, setActiveTab] = useState('dashboard')
    
    const { primaryColor, secondaryColor, tertiaryColor } = useThemeStore()

    const handleMainTabClick = (tabName: 'practice' | 'dashboard') => {
        setActiveTab(tabName)
    }
    const renderDashboardContent = () => (
        <div className='text-center flex flex-col items-center justify-center flex-1 px-4'>
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
            <h2 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4'
                style={{ color: tertiaryColor }}>Dashboard</h2>
            <p className='text-sm sm:text-base md:text-lg lg:text-xl'
                style={{ color: `${tertiaryColor}80` }}>
                View your progress and analytics
            </p>
        </div>
    )

    // Render practice interview content
    const renderPracticeContent = () => (
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
                Select your field and subfield to get started
            </p>
            <button
                onClick={() => window.location.href = '/practice'}
                className='px-6 py-3 text-white rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl'
                style={{ backgroundColor: primaryColor }}
            >
                Start Practice
            </button>
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
        <div className='flex flex-col h-screen mt-6'>
            <div className='flex-1 flex flex-col p-2 sm:p-4 md:p-6 overflow-hidden'
                style={{ backgroundColor: secondaryColor }}>
                {activeTab === 'practice' ? renderPracticeContent() : renderDashboardContent()}
            </div>

            {/* Bottom Tab Navigation */}
            {renderBottomTabs()}
        </div>
    )
}

export default MainSkeleton

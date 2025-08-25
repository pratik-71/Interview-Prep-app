import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../zustand_store/auth_store';
import { useThemeStore } from '../../zustand_store/theme_store';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    primaryColor, 
    backgroundColor, 
    surfaceColor, 
    textColor, 
    textSecondaryColor, 
    cardColor,
    borderColor,
    hoverColor
  } = useThemeStore();

  const handleStartPractice = () => {
    navigate('/practice');
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: backgroundColor }}>
      <div className="max-w-5xl mx-auto py-6 md:py-8 lg:py-10 px-4 md:px-5 lg:px-6">
        {/* Welcome Section */}
        <div className="mb-8 md:mb-10 lg:mb-12">
          <div 
            className="rounded-2xl shadow-lg p-6 md:p-7 lg:p-8 border transition-colors duration-300"
            style={{ 
              backgroundColor: surfaceColor, 
              borderColor: borderColor 
            }}
          >
            <div className="flex items-center space-x-4 md:space-x-5 lg:space-x-6 mb-6 md:mb-7">
              <div className="h-16 w-16 md:h-16 md:w-16 lg:h-20 lg:w-20 rounded-full flex items-center justify-center text-2xl md:text-2xl lg:text-3xl font-bold text-white" style={{ backgroundColor: primaryColor }}>
                {user?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-2xl md:text-2xl lg:text-3xl font-bold transition-colors duration-300" style={{ color: textColor }}>
                  Welcome back, {user?.username || 'User'}!
                </h1>
                <p className="text-base md:text-base lg:text-lg transition-colors duration-300" style={{ color: textSecondaryColor }}>
                  Ready to ace your next interview?
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 lg:gap-5">
              <div 
                className="rounded-xl p-4 md:p-5 lg:p-6 transition-colors duration-300"
                style={{ backgroundColor: cardColor }}
              >
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="h-9 w-9 md:h-10 md:w-10 lg:h-11 lg:w-11 rounded-lg flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                    <svg className="h-5 w-5 md:h-5 md:w-5 lg:h-6 lg:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium transition-colors duration-300" style={{ color: textSecondaryColor }}>Member since</p>
                    <p className="text-base md:text-lg lg:text-xl font-semibold transition-colors duration-300" style={{ color: textColor }}>
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div 
                className="rounded-xl p-4 md:p-5 lg:p-6 transition-colors duration-300"
                style={{ backgroundColor: cardColor }}
              >
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="h-9 w-9 md:h-10 md:w-10 lg:h-11 lg:w-11 rounded-lg flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                    <svg className="h-5 w-5 md:h-5 md:w-5 lg:h-6 lg:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium transition-colors duration-300" style={{ color: textSecondaryColor }}>Practice sessions</p>
                    <p className="text-base md:text-lg lg:text-xl font-semibold transition-colors duration-300" style={{ color: textColor }}>0</p>
                  </div>
                </div>
              </div>
              
              <div 
                className="rounded-xl p-4 md:p-5 lg:p-6 transition-colors duration-300"
                style={{ backgroundColor: cardColor }}
              >
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="h-9 w-9 md:h-10 md:w-10 lg:h-11 lg:w-11 rounded-lg flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                    <svg className="h-5 w-5 md:h-5 md:w-5 lg:h-6 lg:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium transition-colors duration-300" style={{ color: textSecondaryColor }}>Progress score</p>
                    <p className="text-base md:text-lg lg:text-xl font-semibold transition-colors duration-300" style={{ color: textColor }}>0%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 lg:gap-6 items-stretch">
          <div 
            className="rounded-2xl shadow-lg p-5 md:p-6 lg:p-7 border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col"
            style={{ 
              backgroundColor: surfaceColor, 
              borderColor: borderColor 
            }}
          >
            <div className="h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 rounded-xl flex items-center justify-center mb-4 md:mb-5" style={{ backgroundColor: primaryColor }}>
              <svg className="h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-2 md:mb-3 transition-colors duration-300" style={{ color: textColor }}>
              Practice Questions
            </h3>
            <p className="mb-4 md:mb-5 text-sm md:text-base transition-colors duration-300" style={{ color: textSecondaryColor }}>
              Start practicing with our curated interview questions across different categories and difficulty levels.
            </p>
            <button 
              onClick={handleStartPractice}
              className="mt-auto w-full py-3 md:py-3 lg:py-4 px-4 md:px-5 lg:px-6 rounded-lg text-sm md:text-sm lg:text-base font-medium text-white transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5" 
              style={{ backgroundColor: primaryColor }}
            >
              Start Practice
            </button>
          </div>

          <div 
            className="rounded-2xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col"
            style={{ 
              backgroundColor: surfaceColor, 
              borderColor: borderColor 
            }}
          >
            <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: primaryColor }}>
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 transition-colors duration-300" style={{ color: textColor }}>
              Mock Interviews
            </h3>
            <p className="text-lg mb-4 transition-colors duration-300" style={{ color: textSecondaryColor }}>
              Take full mock interviews to test your skills in a realistic environment with time constraints.
            </p>
            <button className="mt-auto w-full py-3 px-4 rounded-lg text-sm font-medium text-white transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5" style={{ backgroundColor: primaryColor }}>
              Start Interview
            </button>
          </div>

          <div 
            className="rounded-2xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col"
            style={{ 
              backgroundColor: surfaceColor, 
              borderColor: borderColor 
            }}
          >
            <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: primaryColor }}>
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 transition-colors duration-300" style={{ color: textColor }}>
              Progress Tracking
            </h3>
            <p className="mb-4 transition-colors duration-300" style={{ color: textSecondaryColor }}>
              Monitor your improvement over time with detailed analytics and performance insights.
            </p>
            <button className="mt-auto w-full py-3 px-4 rounded-lg text-sm font-medium text-white transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5" style={{ backgroundColor: primaryColor }}>
              View Progress
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8">
          <div 
            className="rounded-2xl shadow-lg p-6 border transition-colors duration-300"
            style={{ 
              backgroundColor: surfaceColor, 
              borderColor: borderColor 
            }}
          >
            <h3 className="text-xl font-bold mb-4 transition-colors duration-300" style={{ color: textColor }}>
              Recent Activity
            </h3>
            <div className="text-center py-8">
              <div className="h-16 w-16 mx-auto rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: primaryColor }}>
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="transition-colors duration-300" style={{ color: textSecondaryColor }}>No recent activity</p>
              <p className="text-sm mt-1 transition-colors duration-300" style={{ color: textSecondaryColor }}>Start practicing to see your progress here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../zustand_store/auth_store';
import { useThemeStore } from '../../zustand_store/theme_store';
import { gsap } from 'gsap';
import DashboardService, { DashboardData, RecentActivity } from '../../services/dashboardService';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const { 
    primaryColor, 
    backgroundColor, 
    surfaceColor, 
    textColor, 
    textSecondaryColor,
    cardColor,
    borderColor
  } = useThemeStore();

  // Dashboard data state
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Refs for animations
  const welcomeSectionRef = useRef<HTMLDivElement>(null);
  const statsGridRef = useRef<HTMLDivElement>(null);
  const actionCardsRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const dashboardService = DashboardService.getInstance();
      const data = await dashboardService.getDashboardData(token);
      
      setDashboardData(data);
      setRecentActivity(dashboardService.formatRecentActivity(data));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Entrance animations
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    
    tl.fromTo(welcomeSectionRef.current, 
      { y: -30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.4 }
    )
    .fromTo(avatarRef.current, 
      { scale: 0.8, rotation: -90 }, 
      { scale: 1, rotation: 0, duration: 0.4, ease: "power2.out" }, "-=0.2"
    )
    .fromTo(titleRef.current, 
      { x: -20, opacity: 0 }, 
      { x: 0, opacity: 1, duration: 0.3 }, "-=0.3"
    )
    .fromTo(subtitleRef.current, 
      { x: -20, opacity: 0 }, 
      { x: 0, opacity: 1, duration: 0.3 }, "-=0.3"
    );
    
    // Animate stats grid children if ref exists
    if (statsGridRef.current) {
      tl.fromTo(statsGridRef.current.children, 
        { y: 20, opacity: 0, scale: 0.95 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.3, stagger: 0.05, ease: "power2.out" }, "-=0.2"
      );
    }
    
    // Animate action cards children if ref exists
    if (actionCardsRef.current) {
      tl.fromTo(actionCardsRef.current.children, 
        { y: 30, opacity: 0, scale: 0.95 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.08, ease: "power2.out" }, "-=0.3"
      );
    }
  }, []);

  const handleStartPractice = () => {
    // Animate button click
    const button = document.querySelector('[data-action="practice"]');
    if (button) {
      gsap.to(button, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
    }
    setTimeout(() => navigate('/practice'), 150);
  };

  const handleStartTest = () => {
    // Animate button click
    const button = document.querySelector('[data-action="test"]');
    if (button) {
      gsap.to(button, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
    }
    setTimeout(() => navigate('/test'), 150);
  };

  const handleAskAI = () => {
    // Animate button click
    const button = document.querySelector('[data-action="ask-ai"]');
    if (button) {
      gsap.to(button, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
    }
    setTimeout(() => navigate('/ask-ai'), 150);
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: backgroundColor }}>
      <div className="max-w-5xl mx-auto py-6 md:py-8 lg:py-10 px-4 md:px-5 lg:px-6">
        {/* Welcome Section */}
        <div className="mb-8 md:mb-10 lg:mb-12">
          <div 
            ref={welcomeSectionRef}
            className="rounded-2xl shadow-lg p-6 md:p-7 lg:p-8 border transition-all duration-300 hover:scale-105"
            style={{ 
              backgroundColor: surfaceColor, 
              borderColor: borderColor 
            }}
          >
            <div className="flex items-center space-x-4 md:space-x-5 lg:space-x-6 mb-6 md:mb-7">
              <div 
                ref={avatarRef}
                className="h-16 w-16 md:h-16 md:w-16 lg:h-20 lg:w-20 rounded-full flex items-center justify-center text-2xl md:text-2xl lg:text-3xl font-bold text-white transition-all duration-200 hover:scale-110" 
                style={{ backgroundColor: primaryColor }}
              >
                {user?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h1 
                  ref={titleRef}
                  className="text-2xl md:text-2xl lg:text-3xl font-bold transition-colors duration-300" 
                  style={{ color: textColor }}
                >
                  Welcome back, {user?.username || 'User'}!
                </h1>
                <p 
                  ref={subtitleRef}
                  className="text-base md:text-base lg:text-lg transition-colors duration-300" 
                  style={{ color: textSecondaryColor }}
                >
                  Ready to ace your next interview?
                </p>
              </div>
            </div>
            
            <div 
              ref={statsGridRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5"
            >
              <div 
                className="rounded-xl p-4 md:p-5 lg:p-6 transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{ backgroundColor: cardColor }}
              >
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="h-9 w-9 md:h-10 md:w-10 lg:h-11 lg:w-11 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110" style={{ backgroundColor: primaryColor }}>
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
                className="rounded-xl p-4 md:p-5 lg:p-6 transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{ backgroundColor: cardColor }}
              >
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="h-9 w-9 md:h-10 md:w-10 lg:h-11 lg:w-11 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110" style={{ backgroundColor: primaryColor }}>
                    <svg className="h-5 w-5 md:h-5 md:w-5 lg:h-6 lg:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium transition-colors duration-300" style={{ color: textSecondaryColor }}>Practice sessions</p>
                    <p className="text-base md:text-lg lg:text-xl font-semibold transition-colors duration-300" style={{ color: textColor }}>
                      {isLoading ? '...' : dashboardData?.progress?.total_tests || 0}
                    </p>
                  </div>
                </div>
              </div>
              
              <div 
                className="rounded-xl p-4 md:p-5 lg:p-6 transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{ backgroundColor: cardColor }}
              >
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="h-9 w-9 md:h-10 md:w-10 lg:h-11 lg:w-11 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110" style={{ backgroundColor: primaryColor }}>
                    <svg className="h-5 w-5 md:h-5 md:w-5 lg:h-6 lg:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium transition-colors duration-300" style={{ color: textSecondaryColor }}>Progress score</p>
                    <p className="text-base md:text-lg lg:text-xl font-semibold transition-colors duration-300" style={{ color: textColor }}>
                      {isLoading ? '...' : `${dashboardData?.progress?.average_score?.toFixed(1) || 0}%`}
                    </p>
                  </div>
                </div>
              </div>

              <div 
                className="rounded-xl p-4 md:p-5 lg:p-6 transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{ backgroundColor: cardColor }}
              >
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="h-9 w-9 md:h-10 md:w-10 lg:h-11 lg:w-11 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110" style={{ backgroundColor: primaryColor }}>
                    <svg className="h-5 w-5 md:h-5 md:w-5 lg:h-6 lg:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium transition-colors duration-300" style={{ color: textSecondaryColor }}>Questions answered</p>
                    <p className="text-base md:text-lg lg:text-xl font-semibold transition-colors duration-300" style={{ color: textColor }}>
                      {isLoading ? '...' : dashboardData?.progress?.total_questions || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div 
          ref={actionCardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {/* Practice Interview Card */}
          <div 
            data-action="practice"
            onClick={handleStartPractice}
            className="group cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div 
              className="rounded-2xl shadow-lg p-6 md:p-7 lg:p-8 border transition-all duration-300 h-full"
              style={{ 
                backgroundColor: surfaceColor, 
                borderColor: borderColor 
              }}
            >
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <div className="h-16 w-16 md:h-18 md:w-18 lg:h-20 lg:w-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: primaryColor }}>
                    <svg className="h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3 transition-colors duration-300" style={{ color: textColor }}>
                    Practice Interview
            </h3>
                  <p className="text-base md:text-lg transition-colors duration-300" style={{ color: textSecondaryColor }}>
                    Sharpen your skills with realistic interview scenarios and get instant feedback.
                  </p>
                </div>
                <div className="mt-6">
                  <div className="inline-flex items-center space-x-2 text-sm font-medium transition-colors duration-300 group-hover:text-blue-600" style={{ color: primaryColor }}>
                    <span>Start practicing</span>
                    <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Take Test Card */}
          <div 
            data-action="test"
            onClick={handleStartTest}
            className="group cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div 
              className="rounded-2xl shadow-lg p-6 md:p-7 lg:p-8 border transition-all duration-300 h-full"
              style={{ 
                backgroundColor: surfaceColor, 
                borderColor: borderColor 
              }}
            >
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <div className="h-16 w-16 md:h-18 md:w-18 lg:h-20 lg:w-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: primaryColor }}>
                    <svg className="h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3 transition-colors duration-300" style={{ color: textColor }}>
                    Take Test
            </h3>
                  <p className="text-base md:text-lg transition-colors duration-300" style={{ color: textSecondaryColor }}>
                    Test your knowledge with comprehensive assessments and track your progress.
                  </p>
                </div>
                <div className="mt-6">
                  <div className="inline-flex items-center space-x-2 text-sm font-medium transition-colors duration-300 group-hover:text-blue-600" style={{ color: primaryColor }}>
                    <span>Start test</span>
                    <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ask AI Card */}
          <div 
            data-action="ask-ai"
            onClick={handleAskAI}
            className="group cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div 
              className="rounded-2xl shadow-lg p-6 md:p-7 lg:p-8 border transition-all duration-300 h-full"
              style={{ 
                backgroundColor: surfaceColor, 
                borderColor: borderColor 
              }}
            >
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <div className="h-16 w-16 md:h-18 md:w-18 lg:h-20 lg:w-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: primaryColor }}>
                    <svg className="h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3 transition-colors duration-300" style={{ color: textColor }}>
                    Ask AI
            </h3>
                  <p className="text-base md:text-lg transition-colors duration-300" style={{ color: textSecondaryColor }}>
                    Get instant answers to your questions and learn from our AI-powered assistant.
                  </p>
                </div>
                <div className="mt-6">
                  <div className="inline-flex items-center space-x-2 text-sm font-medium transition-colors duration-300 group-hover:text-blue-600" style={{ color: primaryColor }}>
                    <span>Ask now</span>
                    <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div 
            className="rounded-2xl shadow-lg p-6 border transition-colors duration-300"
            style={{ 
              backgroundColor: surfaceColor, 
              borderColor: borderColor 
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold transition-colors duration-300" style={{ color: textColor }}>
                Recent Activity
              </h3>
              <button
                onClick={fetchDashboardData}
                disabled={isLoading}
                className="p-2 rounded-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: primaryColor }}
                title="Refresh data"
              >
                <svg 
                  className={`h-5 w-5 text-white ${isLoading ? 'animate-spin' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="h-16 w-16 mx-auto rounded-full flex items-center justify-center mb-4 animate-pulse" style={{ backgroundColor: primaryColor }}>
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="transition-colors duration-300" style={{ color: textSecondaryColor }}>Loading...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="h-16 w-16 mx-auto rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#ef4444' }}>
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <p className="transition-colors duration-300" style={{ color: textSecondaryColor }}>{error}</p>
                <button 
                  onClick={fetchDashboardData}
                  className="mt-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
                  style={{ backgroundColor: primaryColor, color: 'white' }}
                >
                  Retry
                </button>
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <div className="h-16 w-16 mx-auto rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: primaryColor }}>
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="transition-colors duration-300" style={{ color: textSecondaryColor }}>No recent activity</p>
                <p className="text-sm mt-1 transition-colors duration-300" style={{ color: textSecondaryColor }}>Start practicing to see your progress here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div 
                    key={activity.id}
                    className="flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                    style={{ backgroundColor: cardColor }}
                  >
                    <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                      {activity.type === 'test' ? (
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium transition-colors duration-300 truncate" style={{ color: textColor }}>
                        {activity.title}
                      </p>
                      <p className="text-sm transition-colors duration-300 truncate" style={{ color: textSecondaryColor }}>
                        {activity.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs transition-colors duration-300" style={{ color: textSecondaryColor }}>
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                      {activity.score && (
                        <p className="text-sm font-medium transition-colors duration-300" style={{ color: primaryColor }}>
                          {activity.score.toFixed(1)}%
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

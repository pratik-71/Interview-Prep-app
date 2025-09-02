import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useThemeStore } from '../zustand_store/theme_store';
import { useAuthStore } from '../zustand_store/auth_store';
import VersionService from '../services/versionService';
import UpdateNotification from '../components/UpdateNotification';
import { gsap } from 'gsap';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    primaryColor, 
    backgroundColor, 
    surfaceColor, 
    textColor, 
    borderColor, 
    hoverColor,
    isDarkMode,
    toggleDarkMode 
  } = useThemeStore();
  
  const { logout } = useAuthStore();
  
  // Refs for DOM elements
  const sidebarRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const navbarRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLHeadingElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Initialize VersionService
  useEffect(() => {
    const versionService = VersionService.getInstance();
    versionService.startUpdateChecking(5); // Check every 5 minutes

    return () => {
      versionService.stopUpdateChecking();
    };
  }, []);

  // Sync theme with document attribute for CSS variables
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Entrance animations
  useEffect(() => {
    if (!navbarRef.current || !logoRef.current || !profileRef.current) return;
    
    const tl = gsap.timeline({ defaults: { ease: "power1.out" } });
    
    tl.fromTo(navbarRef.current, 
      { y: -20, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.4 }
    )
    .fromTo(logoRef.current, 
      { scale: 0.9, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 0.3 }, "-=0.2"
    )
    .fromTo(profileRef.current, 
      { scale: 0.9, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 0.3 }, "-=0.2"
    );
  }, []);

  const toggleSidebar = () => {
    if (!sidebarOpen) {
      setSidebarOpen(true);
      // Animate sidebar in
      gsap.fromTo(sidebarRef.current, 
        { x: -300, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      gsap.fromTo(backdropRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.2, ease: "power2.out" }
      );
    } else {
      // Animate sidebar out
      gsap.to(sidebarRef.current, 
        { x: -300, opacity: 0, duration: 0.2, ease: "power2.in" }
      );
      gsap.to(backdropRef.current, 
        { opacity: 0, duration: 0.15, ease: "power2.in" }
      );
      setSidebarOpen(false);
    }
  };

  const handleNavigation = (path: string) => {
    // Animate out before navigation
    gsap.to(sidebarRef.current, 
      { x: -300, opacity: 0, duration: 0.15, ease: "power2.in" }
    );
    gsap.to(backdropRef.current, 
      { opacity: 0, duration: 0.1, ease: "power2.in" }
    );
    setSidebarOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    // Animate out before logout
    gsap.to(sidebarRef.current, 
      { x: -300, opacity: 0, duration: 0.15, ease: "power2.in" }
    );
    gsap.to(backdropRef.current, 
      { opacity: 0, duration: 0.1, ease: "power2.in" }
    );
    setSidebarOpen(false);
    logout();
    navigate('/login');
  };

  const closeSidebar = () => {
    // Animate sidebar out
    gsap.to(sidebarRef.current, 
      { x: -300, opacity: 0, duration: 0.2, ease: "power2.in" }
    );
    gsap.to(backdropRef.current, 
      { opacity: 0, duration: 0.15, ease: "power2.in" }
    );
    setSidebarOpen(false);
  };

  const isActiveRoute = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Animate theme toggle
  const handleThemeToggle = () => {
    gsap.to(document.documentElement, 
      { duration: 0.3, ease: "power2.out" }
    );
    toggleDarkMode();
  };

  return (
    <div 
      className="flex flex-col h-screen overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: backgroundColor }}
    >
      {/* Top Navbar */}
      <nav 
        ref={navbarRef}
        className="flex items-center justify-between px-4 sm:px-6 md:px-6 lg:px-8 py-3 md:py-3 lg:py-4 shadow-sm flex-shrink-0 transition-colors duration-300"
        style={{ 
          backgroundColor: surfaceColor, 
          borderBottom: `2px solid ${primaryColor}20`,
          color: textColor
        }}
      >
        {/* Left: Hamburger Menu */}
        <button
          ref={hamburgerRef}
          onClick={toggleSidebar}
          className="p-2 md:p-2 rounded-lg transition-colors duration-200 hover:scale-105 active:scale-95"
          style={{ 
            color: textColor,
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = hoverColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <svg className="w-6 h-6 md:w-6 md:h-6 lg:w-7 lg:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Center: App Logo/Title */}
        <div className="flex items-center">
          <h1 
            ref={logoRef}
            className="text-xl md:text-xl lg:text-2xl font-bold hover:scale-105 transition-transform duration-200" 
            style={{ color: primaryColor }}
          >
            PrepMaster
          </h1>
      </div>

        {/* Right: Profile Photo */}
        <div 
          ref={profileRef}
          className="flex items-center space-x-3 md:space-x-3"
        >
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-1 md:p-1 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
            style={{ 
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = hoverColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <div 
              className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center transition-colors duration-200"
              style={{ 
                backgroundColor: isDarkMode ? '#475569' : '#d1d5db',
                color: isDarkMode ? '#e2e8f0' : '#6b7280'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDarkMode ? '#64748b' : '#9ca3af';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isDarkMode ? '#475569' : '#d1d5db';
              }}
            >
              <svg className="w-5 h-5 md:w-5 md:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </button>
        </div>
      </nav>

      {/* Sidebar Navigation */}
      {sidebarOpen && (
        <>
                     {/* Backdrop */}
           <div
             ref={backdropRef}
            className="fixed inset-0 z-40 transition-opacity duration-300 ease-in-out"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
             onClick={closeSidebar}
           />
          
          {/* Sidebar */}
          <div
            ref={sidebarRef}
            className="fixed left-0 top-0 h-full w-64 shadow-2xl z-50 overflow-y-auto"
            style={{ 
              backgroundColor: surfaceColor,
              borderRight: `1px solid ${borderColor}`
            }}
          >
            <div className="p-6">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold" style={{ color: primaryColor }}>
                  Menu
                </h2>
                                 <button
                   onClick={closeSidebar}
                  className="p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{ 
                    color: textColor,
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = hoverColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Dark Mode Toggle */}
              <div className="mb-6 p-4 rounded-lg transition-all duration-200 hover:scale-105" style={{ backgroundColor: isDarkMode ? '#334155' : '#f8fafc' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5">
                      {isDarkMode ? (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#fbbf24' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      ) : (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#f59e0b' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      )}
                    </div>
                    <span className="font-medium" style={{ color: textColor }}>
                      {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                    </span>
                  </div>
                  <button
                    onClick={handleThemeToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ease-in-out hover:scale-105 ${
                      isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 ease-in-out ${
                        isDarkMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="space-y-2">
                {/* Dashboard */}
          <button
            onClick={() => handleNavigation('/dashboard')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
                    isActiveRoute('/dashboard') ? 'text-white shadow-lg' : 'hover:bg-opacity-80'
            }`}
            style={{
              backgroundColor: isActiveRoute('/dashboard') ? primaryColor : 'transparent',
                    color: isActiveRoute('/dashboard') ? 'white' : textColor
                  }}
                  onMouseEnter={(e) => {
                    if (!isActiveRoute('/dashboard')) {
                      e.currentTarget.style.backgroundColor = hoverColor;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActiveRoute('/dashboard')) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
            }}
          >
                  <div className="w-5 h-5">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
                  <span className="font-medium">Dashboard</span>
          </button>

                {/* Practice Interview */}
          <button
            onClick={() => handleNavigation('/practice')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
                    isActiveRoute('/practice') ? 'text-white shadow-lg' : 'hover:bg-opacity-80'
            }`}
            style={{
              backgroundColor: isActiveRoute('/practice') ? primaryColor : 'transparent',
                    color: isActiveRoute('/practice') ? 'white' : textColor
                  }}
                  onMouseEnter={(e) => {
                    if (!isActiveRoute('/practice')) {
                      e.currentTarget.style.backgroundColor = hoverColor;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActiveRoute('/practice')) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
            }}
          >
                  <div className="w-5 h-5">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
                  <span className="font-medium">Practice Interview</span>
                </button>

                {/* Test Component */}
                                 <button
                   onClick={() => handleNavigation('/test')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
                    isActiveRoute('/test') ? 'text-white shadow-lg' : 'hover:bg-opacity-80'
                   }`}
                  style={{
                    backgroundColor: isActiveRoute('/test') ? primaryColor : 'transparent',
                    color: isActiveRoute('/test') ? 'white' : textColor
                  }}
                  onMouseEnter={(e) => {
                    if (!isActiveRoute('/test')) {
                      e.currentTarget.style.backgroundColor = hoverColor;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActiveRoute('/test')) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <div className="w-5 h-5">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <span className="font-medium">Take Test</span>
                </button>

                {/* Analytics */}
                <button
                  onClick={() => handleNavigation('/analytics')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
                    isActiveRoute('/analytics') ? 'text-white shadow-lg' : 'hover:bg-opacity-80'
                  }`}
                  style={{
                    backgroundColor: isActiveRoute('/analytics') ? primaryColor : 'transparent',
                    color: isActiveRoute('/analytics') ? 'white' : textColor
                  }}
                  onMouseEnter={(e) => {
                    if (!isActiveRoute('/analytics')) {
                      e.currentTarget.style.backgroundColor = hoverColor;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActiveRoute('/analytics')) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <div className="w-5 h-5">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="font-medium">Analytics</span>
                </button>
              </div>

              {/* Divider */}
              <div className="my-6" style={{ borderTop: `1px solid ${borderColor}` }}></div>

              {/* Additional Menu Items */}
              <div className="space-y-2">
                {/* Ask AI */}
                <button
                  onClick={() => handleNavigation('/ask-ai')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
                    isActiveRoute('/ask-ai') ? 'text-white shadow-lg' : 'hover:bg-opacity-80'
                  }`}
                  style={{
                    backgroundColor: isActiveRoute('/ask-ai') ? primaryColor : 'transparent',
                    color: isActiveRoute('/ask-ai') ? 'white' : textColor
                  }}
                  onMouseEnter={(e) => {
                    if (!isActiveRoute('/ask-ai')) {
                      e.currentTarget.style.backgroundColor = hoverColor;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActiveRoute('/ask-ai')) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <div className="w-5 h-5">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2v-5a2 2 0 00-1.106-1.788l-5-2.5a2 2 0 00-1.788 0l-5 2.5A2 2 0 004 14v5a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="font-medium">Ask AI</span>
                </button>
                  </div>

              {/* Spacer to push logout button to bottom */}
              <div className="flex-1"></div>

              {/* Logout Button */}
              <div className="pt-4 border-t" style={{ borderColor: borderColor }}>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-opacity-80 hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: 'transparent',
                    color: textColor
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = hoverColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div className="w-5 h-5">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-h-0 ${location.pathname === '/ask-ai' ? '' : 'overflow-hidden'}`}>
        <div className={`flex-1 ${location.pathname === '/ask-ai' ? '' : 'overflow-y-auto'}`}>
          {children}
        </div>
      </div>

      {/* Update Notification */}
      <UpdateNotification />
    </div>
  );
};

export default Layout;

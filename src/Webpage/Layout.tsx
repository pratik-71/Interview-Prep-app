import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useThemeStore } from '../zustand_store/theme_store';
import VersionService from '../services/versionService';
import UpdateNotification from '../components/UpdateNotification';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { primaryColor,tertiaryColor } = useThemeStore();
  
  // Refs for DOM elements
  const sidebarRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Initialize VersionService
  useEffect(() => {
    const versionService = VersionService.getInstance();
    versionService.startUpdateChecking(5); // Check every 5 minutes

    return () => {
      versionService.stopUpdateChecking();
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const isActiveRoute = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navbar */}
      <nav 
        className="flex items-center justify-between px-4 sm:px-6 py-3 shadow-sm"
        style={{ backgroundColor: 'white', borderBottom: `2px solid ${primaryColor}20` }}
      >
        {/* Left: Hamburger Menu */}
        <button
          ref={hamburgerRef}
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <svg className="w-6 h-6" style={{ color: tertiaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Center: App Logo/Title */}
        <div className="flex items-center">
          <h1 className="text-xl font-bold" style={{ color: primaryColor }}>
            Interview Prep
          </h1>
      </div>

        {/* Right: Profile Photo */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center hover:bg-gray-400 transition-colors duration-200">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
             className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out"
             onClick={closeSidebar}
           />
          
          {/* Sidebar */}
          <div
            ref={sidebarRef}
            className={`fixed left-0 top-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="p-6">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold" style={{ color: primaryColor }}>
                  Menu
                </h2>
                                 <button
                   onClick={closeSidebar}
                   className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                 >
                  <svg className="w-5 h-5" style={{ color: tertiaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-2">
                {/* Dashboard */}
          <button
            onClick={() => handleNavigation('/')}
                   className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                     isActiveRoute('/') ? 'text-white shadow-lg' : 'hover:bg-gray-100'
            }`}
            style={{
              backgroundColor: isActiveRoute('/') ? primaryColor : 'transparent',
              color: isActiveRoute('/') ? 'white' : tertiaryColor
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
                   className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                     isActiveRoute('/practice') ? 'text-white shadow-lg' : 'hover:bg-gray-100'
            }`}
            style={{
              backgroundColor: isActiveRoute('/practice') ? primaryColor : 'transparent',
              color: isActiveRoute('/practice') ? 'white' : tertiaryColor
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
                   className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                     isActiveRoute('/test') ? 'text-white shadow-lg' : 'hover:bg-gray-100'
                   }`}
                  style={{
                    backgroundColor: isActiveRoute('/test') ? primaryColor : 'transparent',
                    color: isActiveRoute('/test') ? 'white' : tertiaryColor
                  }}
                >
                  <div className="w-5 h-5">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <span className="font-medium">Take Test</span>
                </button>
              </div>

              {/* Divider */}
              <div className="my-6 border-t border-gray-200"></div>

              {/* Additional Menu Items */}
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="w-5 h-5">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="font-medium" style={{ color: tertiaryColor }}>Settings</span>
                </button>

                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="w-5 h-5">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="font-medium" style={{ color: tertiaryColor }}>Help</span>
          </button>
        </div>
      </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>

      {/* Update Notification */}
      <UpdateNotification />
    </div>
  );
};

export default Layout;

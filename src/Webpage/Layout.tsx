import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useThemeStore } from '../zustand_store/theme_store';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { primaryColor, secondaryColor, tertiaryColor } = useThemeStore();

  const isActiveRoute = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>

      {/* Bottom Navigation */}
      <div 
        className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4"
        style={{ backgroundColor: secondaryColor, borderTop: `2px solid ${primaryColor}20` }}
      >
        <div className="flex justify-around">
          {/* Dashboard Tab */}
          <button
            onClick={() => handleNavigation('/')}
            className={`flex flex-col items-center py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6 rounded-lg sm:rounded-xl transition-all duration-300 ${
              isActiveRoute('/') ? 'text-white shadow-lg' : 'hover:scale-105'
            }`}
            style={{
              backgroundColor: isActiveRoute('/') ? primaryColor : 'transparent',
              color: isActiveRoute('/') ? 'white' : tertiaryColor
            }}
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mb-1 sm:mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-xs sm:text-sm md:text-base font-medium sm:font-semibold">
              Dashboard
            </span>
          </button>

          {/* Practice Interview Tab */}
          <button
            onClick={() => handleNavigation('/practice')}
            className={`flex flex-col items-center py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6 rounded-lg sm:rounded-xl transition-all duration-300 ${
              isActiveRoute('/practice') ? 'text-white shadow-lg' : 'hover:scale-105'
            }`}
            style={{
              backgroundColor: isActiveRoute('/practice') ? primaryColor : 'transparent',
              color: isActiveRoute('/practice') ? 'white' : tertiaryColor
            }}
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mb-1 sm:mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs sm:text-sm md:text-base font-medium sm:font-semibold">
              Practice Interview
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Layout;

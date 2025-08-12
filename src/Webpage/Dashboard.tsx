import React from 'react';
import { useThemeStore } from '../zustand_store/theme_store';

const Dashboard: React.FC = () => {
  const { primaryColor, secondaryColor, tertiaryColor } = useThemeStore();

  return (
    <div className="flex-1 flex flex-col p-2 sm:p-4 md:p-6 overflow-hidden" style={{ backgroundColor: secondaryColor }}>
      <div className="text-center flex flex-col items-center justify-center flex-1 px-4">
        {/* Dashboard icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-4 sm:mb-6"
          style={{ backgroundColor: `${primaryColor}15` }}>
          <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
            style={{ color: primaryColor }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        
        {/* Dashboard title and description */}
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4"
          style={{ color: tertiaryColor }}>Dashboard</h2>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl"
          style={{ color: `${tertiaryColor}80` }}>
          View your progress and analytics
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 w-full max-w-md">
          <div className="p-4 rounded-lg" style={{ backgroundColor: `${primaryColor}10` }}>
            <div className="text-2xl font-bold" style={{ color: primaryColor }}>0</div>
            <div className="text-sm" style={{ color: tertiaryColor }}>Questions Answered</div>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: `${primaryColor}10` }}>
            <div className="text-2xl font-bold" style={{ color: primaryColor }}>0</div>
            <div className="text-sm" style={{ color: tertiaryColor }}>Tests Completed</div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="mt-8 p-4 rounded-lg border-2" style={{ 
          backgroundColor: `${primaryColor}05`, 
          borderColor: `${primaryColor}20` 
        }}>
          <p className="text-sm" style={{ color: primaryColor }}>
            More dashboard features coming soon! 📊
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

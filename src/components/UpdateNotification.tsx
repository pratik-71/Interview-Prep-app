import React, { useState, useEffect } from 'react';
import { useThemeStore } from '../zustand_store/theme_store';
import VersionService, { VersionInfo } from '../services/versionService';

const UpdateNotification: React.FC = () => {
  const [updateAvailable, setUpdateAvailable] = useState<VersionInfo | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { 
    primaryColor, 
    surfaceColor, 
    textColor, 
    textSecondaryColor,
    warningColor
  } = useThemeStore();

  useEffect(() => {
    // Listen for update events
    const handleUpdateAvailable = (event: CustomEvent) => {
      setUpdateAvailable(event.detail);
    };

    window.addEventListener('appUpdateAvailable', handleUpdateAvailable as EventListener);

    // Check for updates on mount
    const checkUpdates = async () => {
      const versionService = VersionService.getInstance();
      const update = await versionService.checkForUpdates();
      if (update) {
        setUpdateAvailable(update);
      }
    };

    checkUpdates();

    return () => {
      window.removeEventListener('appUpdateAvailable', handleUpdateAvailable as EventListener);
    };
  }, []);

  const handleUpdate = async () => {
    if (!updateAvailable) return;

    setIsUpdating(true);
    
    try {
      const versionService = VersionService.getInstance();
      
      if (updateAvailable.forceUpdate) {
        // Force update
        versionService.forceUpdate();
      } else {
        // Manual update
        window.location.reload();
      }
    } catch (error) {
      console.error('Update failed:', error);
      setIsUpdating(false);
    }
  };

  const handleDismiss = () => {
    setUpdateAvailable(null);
  };

  if (!updateAvailable) return null;

  return (
    <div 
      className="fixed top-20 left-4 right-4 z-50 rounded-lg shadow-xl border-2 transition-colors duration-300"
      style={{ 
        backgroundColor: surfaceColor, 
        borderColor: warningColor 
      }}
    >
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* Update Icon */}
          <div className="flex-shrink-0">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300"
              style={{ backgroundColor: `${warningColor}20` }}
            >
              <svg className="w-5 h-5 transition-colors duration-300" style={{ color: warningColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium transition-colors duration-300" style={{ color: textColor }}>
              Update Available
            </h3>
            <p className="text-sm mt-1 transition-colors duration-300" style={{ color: textSecondaryColor }}>
              Version {updateAvailable.version} is now available
            </p>
            
            {updateAvailable.changelog && (
              <div className="mt-2">
                <p className="text-xs font-medium transition-colors duration-300" style={{ color: primaryColor }}>
                  What's new:
                </p>
                <ul className="text-xs mt-1 space-y-1">
                  {updateAvailable.changelog.slice(0, 3).map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span 
                        className="w-1 h-1 rounded-full transition-colors duration-300" 
                        style={{ backgroundColor: primaryColor }}
                      ></span>
                      <span className="transition-colors duration-300" style={{ color: textSecondaryColor }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 flex space-x-2">
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="px-3 py-1.5 text-xs font-medium rounded-md text-white transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: primaryColor }}
            >
              {isUpdating ? 'Updating...' : 'Update Now'}
            </button>
            
            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-md transition-colors duration-200 hover:bg-opacity-80"
              style={{ 
                color: textSecondaryColor,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${textSecondaryColor}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateNotification;

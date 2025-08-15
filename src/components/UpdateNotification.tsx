import React, { useState, useEffect } from 'react';
import { useThemeStore } from '../zustand_store/theme_store';
import VersionService, { VersionInfo } from '../services/versionService';

const UpdateNotification: React.FC = () => {
  const [updateAvailable, setUpdateAvailable] = useState<VersionInfo | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { primaryColor, tertiaryColor } = useThemeStore();

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
    <div className="fixed top-20 left-4 right-4 z-50 bg-white rounded-lg shadow-xl border-2 border-yellow-400">
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* Update Icon */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium" style={{ color: tertiaryColor }}>
              Update Available
            </h3>
            <p className="text-sm mt-1" style={{ color: `${tertiaryColor}80` }}>
              Version {updateAvailable.version} is now available
            </p>
            
            {updateAvailable.changelog && (
              <div className="mt-2">
                <p className="text-xs font-medium" style={{ color: primaryColor }}>
                  What's new:
                </p>
                <ul className="text-xs mt-1 space-y-1" style={{ color: `${tertiaryColor}70` }}>
                  {updateAvailable.changelog.slice(0, 3).map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span className="w-1 h-1 rounded-full" style={{ backgroundColor: primaryColor }}></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 flex space-x-2">
            {!updateAvailable.forceUpdate && (
              <button
                onClick={handleDismiss}
                className="px-3 py-1 text-xs rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors duration-200"
              >
                Later
              </button>
            )}
            
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="px-3 py-1 text-xs rounded-md text-white font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50"
              style={{ backgroundColor: primaryColor }}
            >
              {isUpdating ? 'Updating...' : updateAvailable.forceUpdate ? 'Update Now' : 'Update'}
            </button>
          </div>
        </div>

        {/* Force Update Warning */}
        {updateAvailable.forceUpdate && (
          <div className="mt-3 p-2 rounded-md bg-red-50 border border-red-200">
            <p className="text-xs text-red-700">
              ⚠️ This update is required to continue using the app.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateNotification;

import React, { useState, useEffect } from 'react';
import { networkConfig } from '../../utils/networkConfig';

const NetworkDebug: React.FC = () => {
  const [networkInfo, setNetworkInfo] = useState<any>(null);
  const [connectionTest, setConnectionTest] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setNetworkInfo(networkConfig.getNetworkInfo());
  }, []);

  const testConnection = async () => {
    setIsLoading(true);
    try {
      const result = await networkConfig.testConnection();
      setConnectionTest(result);
    } catch (error) {
      console.error('Connection test failed:', error);
      setConnectionTest(false);
    } finally {
      setIsLoading(false);
    }
  };

  const autoDetectIP = async () => {
    setIsLoading(true);
    try {
      const detectedIP = await networkConfig.autoDetectIP();
      if (detectedIP) {
        setNetworkInfo(networkConfig.getNetworkInfo());
        setConnectionTest(true);
      } else {
        setConnectionTest(false);
      }
    } catch (error) {
      console.error('Auto-detect failed:', error);
      setConnectionTest(false);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBaseUrl = () => {
    const newUrl = prompt('Enter new base URL:', networkConfig.getBaseUrl());
    if (newUrl) {
      networkConfig.setBaseUrl(newUrl);
      setNetworkInfo(networkConfig.getNetworkInfo());
    }
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">🌐 Network Debug Info</h3>
      
      {networkInfo && (
        <div className="space-y-2 text-sm">
          <div><strong>Platform:</strong> {networkInfo.platform}</div>
          <div><strong>Is Capacitor:</strong> {networkInfo.isCapacitor ? 'Yes' : 'No'}</div>
          <div><strong>Base URL:</strong> <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">{networkInfo.baseUrl}</code></div>
          <div><strong>User Agent:</strong> <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-xs">{networkInfo.userAgent}</code></div>
          <div><strong>Timestamp:</strong> {networkInfo.timestamp}</div>
        </div>
      )}

      <div className="mt-4 space-y-2">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={testConnection}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Connection'}
          </button>
          
          <button
            onClick={autoDetectIP}
            disabled={isLoading}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            {isLoading ? 'Detecting...' : 'Auto-Detect IP'}
          </button>
          
          <button
            onClick={updateBaseUrl}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Update URL
          </button>
        </div>
      </div>

      {connectionTest !== null && (
        <div className={`mt-2 p-2 rounded ${connectionTest ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {connectionTest ? '✅ Connection successful!' : '❌ Connection failed'}
        </div>
      )}

      <div className="mt-4 text-xs text-gray-600 dark:text-gray-400">
        <p><strong>Production Backend:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li>Using production backend: https://interview-prep-backend-viok.onrender.com</li>
          <li>No local server setup required</li>
          <li>Works on all devices and platforms</li>
          <li>Make sure you have internet connection</li>
        </ul>
      </div>
    </div>
  );
};

export default NetworkDebug;

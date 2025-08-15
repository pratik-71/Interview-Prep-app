import { Device } from '@capacitor/device';
import { APP_VERSION } from '../config/version';

export interface VersionInfo {
  version: string;
  buildNumber: string;
  lastUpdated: string;
  forceUpdate: boolean;
  changelog?: string[];
}

export class VersionService {
  private static instance: VersionService;
  private currentVersion: string;
  private updateCheckInterval: NodeJS.Timeout | null = null;

  private constructor() {
    // Get version from centralized config
    this.currentVersion = APP_VERSION;
  }

  public static getInstance(): VersionService {
    if (!VersionService.instance) {
      VersionService.instance = new VersionService();
    }
    return VersionService.instance;
  }

  // Get current app version
  public getCurrentVersion(): string {
    return this.currentVersion;
  }

  // Check for updates from server
  public async checkForUpdates(): Promise<VersionInfo | null> {
    try {
      // Create a cache-busting URL
      const timestamp = Date.now();
      const response = await fetch(`/version.json?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch version info');
      }

      const serverVersion: VersionInfo = await response.json();
      
      // Compare versions
      if (this.isNewerVersion(serverVersion.version, this.currentVersion)) {
        console.log(`Update available: ${this.currentVersion} → ${serverVersion.version}`);
        return serverVersion;
      }

      return null;
    } catch (error) {
      console.error('Error checking for updates:', error);
      return null;
    }
  }

  // Compare version strings
  private isNewerVersion(newVersion: string, currentVersion: string): boolean {
    const newParts = newVersion.split('.').map(Number);
    const currentParts = currentVersion.split('.').map(Number);

    for (let i = 0; i < Math.max(newParts.length, currentParts.length); i++) {
      const newPart = newParts[i] || 0;
      const currentPart = currentParts[i] || 0;
      
      if (newPart > currentPart) return true;
      if (newPart < currentPart) return false;
    }
    
    return false;
  }

  // Start automatic update checking
  public startUpdateChecking(intervalMinutes: number = 5): void {
    if (this.updateCheckInterval) {
      clearInterval(this.updateCheckInterval);
    }

    this.updateCheckInterval = setInterval(async () => {
      const update = await this.checkForUpdates();
      if (update) {
        this.handleUpdateAvailable(update);
      }
    }, intervalMinutes * 60 * 1000);

    // Check immediately
    this.checkForUpdates().then(update => {
      if (update) {
        this.handleUpdateAvailable(update);
      }
    });
  }

  // Stop automatic update checking
  public stopUpdateChecking(): void {
    if (this.updateCheckInterval) {
      clearInterval(this.updateCheckInterval);
      this.updateCheckInterval = null;
    }
  }

  // Handle when update is available
  private handleUpdateAvailable(update: VersionInfo): void {
    console.log('Update available:', update);
    
    // Dispatch custom event for components to listen to
    const event = new CustomEvent('appUpdateAvailable', { 
      detail: update 
    });
    window.dispatchEvent(event);

    // Force update if required
    if (update.forceUpdate) {
      this.forceUpdate();
    }
  }

  // Force app update/reload
  public forceUpdate(): void {
    console.log('Forcing app update...');
    
    // Clear all caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }

    // Clear service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.unregister();
        });
      });
    }

    // Force reload after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  // Get device info for debugging
  public async getDeviceInfo(): Promise<any> {
    try {
      const info = await Device.getInfo();
      return {
        ...info,
        appVersion: this.currentVersion,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting device info:', error);
      return null;
    }
  }

  // Manual update check
  public async manualUpdateCheck(): Promise<boolean> {
    const update = await this.checkForUpdates();
    if (update) {
      this.handleUpdateAvailable(update);
      return true;
    }
    return false;
  }
}

export default VersionService;

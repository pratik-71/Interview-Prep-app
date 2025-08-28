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
  private isMobile: boolean = false;

  private constructor() {
    // Get version from centralized config
    this.currentVersion = APP_VERSION;
    // Check if running on mobile
    this.checkMobilePlatform();
  }

  public static getInstance(): VersionService {
    if (!VersionService.instance) {
      VersionService.instance = new VersionService();
    }
    return VersionService.instance;
  }

  // Check if running on mobile platform
  private async checkMobilePlatform(): Promise<void> {
    try {
      const deviceInfo = await Device.getInfo();
      this.isMobile = deviceInfo.platform === 'android' || deviceInfo.platform === 'ios';
    } catch (error) {
      // Fallback to user agent detection
      this.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
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
        // Update available
        return serverVersion;
      }

      return null;
          } catch (error) {
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
            // Update available
    
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

  // Force app update/reload - Mobile-friendly version
  public forceUpdate(): void {
    if (this.isMobile) {
      // On mobile, just reload the app
      this.reloadApp();
    } else {
      // On web, clear caches and reload
      this.clearWebCaches();
    }
  }

  // Clear web caches (web only)
  private clearWebCaches(): void {
    // Only run on web platform
    if (typeof window !== 'undefined' && !this.isMobile) {
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
    }

    // Force reload after a short delay
    setTimeout(() => {
      this.reloadApp();
    }, 1000);
  }

  // Reload app (platform-agnostic)
  private reloadApp(): void {
    try {
      // Simple reload that works on both web and mobile
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch (error) {
      // Final fallback
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }
  }

  // Get device info for debugging
  public async getDeviceInfo(): Promise<any> {
    try {
      const info = await Device.getInfo();
      return {
        ...info,
        appVersion: this.currentVersion,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        isMobile: this.isMobile
      };
    } catch (error) {
      return {
        appVersion: this.currentVersion,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        isMobile: this.isMobile
      };
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

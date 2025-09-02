import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.prepmaster.app',
  appName: 'PrepMaster',
  webDir: 'build',
  server: {
    allowNavigation: ['*']
  }
};

export default config;

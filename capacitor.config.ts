import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.prepmaster.app',
  appName: 'PrepMaster',
  webDir: 'build',
  version: '1.0.0',
  build: {
    autoUpdate: true
  },
  server: {
    allowNavigation: ['*']
  }
};

export default config;

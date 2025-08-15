import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.interviewprep.app',
  appName: 'Interview Prep',
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

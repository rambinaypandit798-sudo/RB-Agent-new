import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rbagent.app',
  appName: 'RB Agent',
  webDir: '.output/public',
  server: {
    url: 'https://rb-agent-new.vercel.app',
    cleartext: false,
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;

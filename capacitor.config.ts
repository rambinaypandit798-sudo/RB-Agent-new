import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rbagent.app',
  appName: 'RB Agent',
  webDir: '.output/public',
  server: {
    url: 'https://YOUR-VERCEL-URL.vercel.app',  // ⚠️ apna URL daalo
    cleartext: false,
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;

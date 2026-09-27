import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rbagent.app',
  appName: 'RB Agent',
  webDir: '.output/public',
  server: {
    url: 'https://rb-agent-new.vercel.app',  // आपका लाइव Vercel यूआरएल[span_1](start_span)[span_1](end_span)
    cleartext: false,
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;

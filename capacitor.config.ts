import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.cvafrik.app',
  appName: 'CVAfrik',
  webDir: 'public',
  server: {
    url: 'https://cv-afrik.vercel.app/dashboard',
    cleartext: false,
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: false,
  },
}

export default config

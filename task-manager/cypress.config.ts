import synpressPlugins from '@synthetixio/synpress/plugins';
import { defineConfig } from 'cypress';

export default defineConfig({
  userAgent: 'synpress',
  chromeWebSecurity: true,
  defaultCommandTimeout: 30000,
  pageLoadTimeout: 30000,
  requestTimeout: 30000,
  e2e: {
    testIsolation: false,
    setupNodeEvents(on, config) {
      synpressPlugins(on, config);
    },
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts' /* 'cypress/support/support.ts' */,
  },

  viewportHeight: 1080,
  viewportWidth: 1920,
  video: false,
  screenshotsFolder: false,
});

const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 600000,
  workers: 1,
  fullyParallel: false,
  expect: {
    timeout: 600000,
  },
  use: {
    browserName: 'chromium',
    headless: false,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: {
      width: 1920,
      height: 1080,
      
    },
    url: 'https://qa1-ipc.deloitte.com/ipc/2026/v2/client-selection',
    downloadsPath: 'C:/Downloads',
  },
  reporter: [['html', { outputFolder: 'test-results', open: 'never' }]],
  
});
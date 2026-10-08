
import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';
import { CONFIG } from './src/utils/constants';

export default defineConfig({
  testDir: './tests',

  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,

  reporter: [
    ['list'],
    [
      'html',
      {
        open: 'never',
        outputFolder: 'playwright-report',
      },
    ],
  ],

  timeout: 30000,

  expect: {
    timeout: 10000,
  },

  use: {
    baseURL: CONFIG.BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});

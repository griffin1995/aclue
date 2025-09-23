// @ts-nocheck
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    fixturesFolder: 'cypress/fixtures',
    videosFolder: '../tests-22-sept/cypress-videos',
    screenshotsFolder: '../tests-22-sept/cypress-screenshots',
    downloadsFolder: '../tests-22-sept/cypress-downloads',
    video: true,
    screenshotOnRunFailure: true,
    trashAssetsBeforeRuns: true,
    viewportWidth: 1920,
    viewportHeight: 1080,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    env: {
      API_URL: 'https://aclue-backend-production.up.railway.app',
      TEST_USER_EMAIL: 'john.doe@example.com',
      TEST_USER_PASSWORD: 'password123',
    },
    experimentalStudio: true,
    experimentalWebKitSupport: true,
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      // Performance testing
      on('task', {
        log(message) {
          console.log(message)
          return null
        },
        table(message) {
          console.table(message)
          return null
        },
      })

      // Code coverage
      require('@cypress/code-coverage/task')(on, config)

      return config
    },
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.ts',
    indexHtmlFile: 'cypress/support/component-index.html',
    video: false,
    screenshotOnRunFailure: true,
    screenshotsFolder: '../tests-22-sept/cypress-component-screenshots',
  },
})
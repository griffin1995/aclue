import type { Options } from '@wdio/types'

export const config: Options.Testrunner = {
  runner: 'local',
  specs: ['./tests/wdio/**/*.spec.ts'],
  exclude: [],
  maxInstances: 10,
  capabilities: [
    {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: ['--headless', '--disable-gpu'],
      },
    },
    {
      browserName: 'firefox',
      'moz:firefoxOptions': {
        args: ['-headless'],
      },
    },
    {
      browserName: 'safari',
    },
  ],
  logLevel: 'info',
  bail: 0,
  baseUrl: 'http://localhost:3000',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: [
    'chromedriver',
    'geckodriver',
    'safaridriver',
    ['visual', {
      baselineFolder: '../tests-22-sept/wdio-baseline/',
      formatImageName: '{tag}-{logName}-{width}x{height}',
      screenshotPath: '../tests-22-sept/wdio-screenshots/',
      savePerInstance: true,
      autoSaveBaseline: true,
      blockOutStatusBar: true,
      blockOutToolBar: true,
    }],
    ['timeline', {
      outputDir: '../tests-22-sept/wdio-timeline',
      screenshotStrategy: 'before:click',
    }],
  ],
  framework: 'mocha',
  reporters: [
    'spec',
    ['allure', {
      outputDir: '../tests-22-sept/wdio-allure-results',
      disableWebdriverStepsReporting: false,
      disableWebdriverScreenshotsReporting: false,
    }],
    ['json', {
      outputDir: '../tests-22-sept/wdio-json-results',
    }],
    ['junit', {
      outputDir: '../tests-22-sept/wdio-junit-results',
      outputFileFormat: function(options) {
        return `results-${options.cid}.${options.capabilities}.xml`
      },
    }],
  ],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
  before: function (capabilities, specs) {
    console.log('Starting WebdriverIO test suite')
  },
  afterTest: async function(test, context, { error, result, duration, passed, retries }) {
    if (!passed) {
      await browser.takeScreenshot()
    }
  },
  after: function (result, capabilities, specs) {
    console.log('WebdriverIO test suite completed')
  },
}
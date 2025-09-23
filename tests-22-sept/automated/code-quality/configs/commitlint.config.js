// Commitlint Configuration - Conventional Commit Message Validation
// Enforces conventional commit format for automated changelog generation

module.exports = {
  // Extend conventional config
  extends: ['@commitlint/config-conventional'],

  // Parser preset
  parserPreset: 'conventional-changelog-conventionalcommits',

  // Custom rules
  rules: {
    // Type case (lowercase)
    'type-case': [2, 'always', 'lower-case'],

    // Type empty (must have type)
    'type-empty': [2, 'never'],

    // Type enum (allowed types)
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation only changes
        'style',    // Changes that do not affect meaning (formatting, etc)
        'refactor', // Code change that neither fixes bug nor adds feature
        'perf',     // Performance improvement
        'test',     // Adding missing tests or correcting existing tests
        'build',    // Changes that affect build system or external dependencies
        'ci',       // Changes to CI configuration files and scripts
        'chore',    // Other changes that don't modify src or test files
        'revert',   // Reverts a previous commit
        'security', // Security improvements
        'deps',     // Dependency updates
        'config',   // Configuration changes
        'wip',      // Work in progress (temporary commits)
      ],
    ],

    // Scope case (lowercase)
    'scope-case': [2, 'always', 'lower-case'],

    // Scope empty (optional)
    'scope-empty': [0, 'never'],

    // Subject case (sentence-case, lowercase first letter)
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],

    // Subject empty (must have subject)
    'subject-empty': [2, 'never'],

    // Subject full stop (no trailing period)
    'subject-full-stop': [2, 'never', '.'],

    // Subject max length
    'subject-max-length': [2, 'always', 72],

    // Subject min length
    'subject-min-length': [2, 'always', 3],

    // Header max length
    'header-max-length': [2, 'always', 100],

    // Header min length
    'header-min-length': [2, 'always', 10],

    // Body leading blank (must have blank line before body)
    'body-leading-blank': [2, 'always'],

    // Body max line length
    'body-max-line-length': [2, 'always', 100],

    // Footer leading blank (must have blank line before footer)
    'footer-leading-blank': [2, 'always'],

    // Footer max line length
    'footer-max-line-length': [2, 'always', 100],

    // References empty (allow empty references)
    'references-empty': [0, 'never'],

    // Signed off by (require sign-off for security)
    'signed-off-by': [0, 'never'],
  },

  // Custom prompt configuration
  prompt: {
    questions: {
      type: {
        description: "Select the type of change that you're committing:",
        enum: {
          feat: {
            description: 'A new feature',
            title: 'Features',
            emoji: '✨',
          },
          fix: {
            description: 'A bug fix',
            title: 'Bug Fixes',
            emoji: '🐛',
          },
          docs: {
            description: 'Documentation only changes',
            title: 'Documentation',
            emoji: '📚',
          },
          style: {
            description:
              'Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
            title: 'Styles',
            emoji: '💎',
          },
          refactor: {
            description: 'A code change that neither fixes a bug nor adds a feature',
            title: 'Code Refactoring',
            emoji: '📦',
          },
          perf: {
            description: 'A code change that improves performance',
            title: 'Performance Improvements',
            emoji: '🚀',
          },
          test: {
            description: 'Adding missing tests or correcting existing tests',
            title: 'Tests',
            emoji: '🚨',
          },
          build: {
            description:
              'Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)',
            title: 'Builds',
            emoji: '🛠',
          },
          ci: {
            description:
              'Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)',
            title: 'Continuous Integrations',
            emoji: '⚙️',
          },
          chore: {
            description: "Other changes that don't modify src or test files",
            title: 'Chores',
            emoji: '♻️',
          },
          revert: {
            description: 'Reverts a previous commit',
            title: 'Reverts',
            emoji: '🗑',
          },
          security: {
            description: 'Security improvements',
            title: 'Security',
            emoji: '🔒',
          },
          deps: {
            description: 'Dependency updates',
            title: 'Dependencies',
            emoji: '📦',
          },
          config: {
            description: 'Configuration changes',
            title: 'Configuration',
            emoji: '⚙️',
          },
          wip: {
            description: 'Work in progress',
            title: 'Work in Progress',
            emoji: '🚧',
          },
        },
      },
      scope: {
        description: 'What is the scope of this change (e.g. component or file name)',
      },
      subject: {
        description: 'Write a short, imperative tense description of the change',
      },
      body: {
        description: 'Provide a longer description of the change',
      },
      isBreaking: {
        description: 'Are there any breaking changes?',
      },
      breakingBody: {
        description: 'A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself',
      },
      breaking: {
        description: 'Describe the breaking changes',
      },
      isIssueAffected: {
        description: 'Does this change affect any open issues?',
      },
      issuesBody: {
        description: 'If issues are closed, the commit requires a body. Please enter a longer description of the commit itself',
      },
      issues: {
        description: 'Add issue references (e.g. "fix #123", "re #123".)',
      },
    },
  },

  // Default ignore patterns
  ignores: [
    // Merge commits
    (commit) => commit.includes('Merge'),
    // Release commits
    (commit) => commit.includes('release'),
    // Auto-generated commits
    (commit) => commit.includes('auto-generated'),
    // Dependency updates (if using automated tools)
    (commit) => commit.includes('deps: bump'),
  ],

  // Custom help message
  helpUrl: 'https://github.com/conventional-changelog/commitlint/#what-is-commitlint',

  // Default severity level (2 = error, 1 = warning, 0 = disabled)
  defaultIgnores: true,

  // Custom format function
  formatter: '@commitlint/format',
};
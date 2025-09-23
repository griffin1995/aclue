// ESLint Configuration - Comprehensive TypeScript/JavaScript Analysis
// Maximum rules enabled for Next.js, React, and TypeScript

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  env: {
    browser: true,
    es2022: true,
    node: true,
    jest: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'jsx-a11y',
    'import',
    'security',
    'sonarjs',
    'unicorn',
    'promise',
    'node',
  ],
  extends: [
    'eslint:all',                           // Enable ALL ESLint rules
    '@typescript-eslint/all',               // Enable ALL TypeScript rules
    'plugin:react/all',                     // Enable ALL React rules
    'plugin:react-hooks/recommended',       // React Hooks rules
    'plugin:jsx-a11y/recommended',          // Accessibility rules
    'plugin:import/recommended',            // Import/export rules
    'plugin:import/typescript',             // TypeScript import rules
    'plugin:security/recommended',          // Security rules
    'plugin:sonarjs/recommended',           // Code quality rules
    'plugin:unicorn/recommended',           // Additional quality rules
    'plugin:promise/recommended',           // Promise best practices
    'plugin:node/recommended',              // Node.js rules
    'next/core-web-vitals',                 // Next.js specific rules
    'prettier',                             // Prettier compatibility
  ],
  rules: {
    // Disable overly strict rules for practical development
    'no-console': 'warn',
    'no-debugger': 'error',

    // TypeScript specific adjustments
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
    }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/no-unnecessary-condition': 'error',
    '@typescript-eslint/strict-boolean-expressions': 'error',
    '@typescript-eslint/prefer-readonly': 'error',
    '@typescript-eslint/prefer-readonly-parameter-types': 'off',
    '@typescript-eslint/no-magic-numbers': ['warn', {
      ignore: [0, 1, -1],
      ignoreArrayIndexes: true,
      ignoreDefaultValues: true,
    }],

    // React specific rules
    'react/react-in-jsx-scope': 'off', // Not needed in Next.js
    'react/prop-types': 'off', // Using TypeScript instead
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-filename-extension': ['error', {
      extensions: ['.jsx', '.tsx']
    }],
    'react/function-component-definition': ['error', {
      namedComponents: 'arrow-function',
      unnamedComponents: 'arrow-function',
    }],
    'react/jsx-no-leaked-render': 'error',
    'react/jsx-no-useless-fragment': 'error',
    'react/no-array-index-key': 'warn',
    'react/no-unstable-nested-components': 'error',
    'react/jsx-max-depth': ['warn', { max: 5 }],

    // Accessibility rules
    'jsx-a11y/anchor-is-valid': ['error', {
      components: ['Link'],
      specialLink: ['hrefLeft', 'hrefRight'],
      aspects: ['invalidHref', 'preferButton'],
    }],

    // Import/export rules
    'import/order': ['error', {
      groups: [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index',
      ],
      'newlines-between': 'always',
      alphabetize: {
        order: 'asc',
        caseInsensitive: true,
      },
    }],
    'import/no-unresolved': 'error',
    'import/no-cycle': 'error',
    'import/no-unused-modules': 'error',
    'import/no-deprecated': 'warn',

    // Security rules
    'security/detect-object-injection': 'warn',
    'security/detect-non-literal-regexp': 'warn',
    'security/detect-unsafe-regex': 'error',

    // Code quality rules (SonarJS)
    'sonarjs/cognitive-complexity': ['error', 15],
    'sonarjs/no-duplicate-string': ['error', 3],
    'sonarjs/no-identical-functions': 'error',
    'sonarjs/no-small-switch': 'error',
    'sonarjs/prefer-immediate-return': 'error',

    // Unicorn rules adjustments
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/filename-case': ['error', {
      cases: {
        camelCase: true,
        pascalCase: true,
        kebabCase: true,
      },
    }],
    'unicorn/no-null': 'off',
    'unicorn/prefer-module': 'off',

    // General code quality
    'complexity': ['error', 10],
    'max-depth': ['error', 4],
    'max-lines': ['error', 300],
    'max-lines-per-function': ['error', 50],
    'max-params': ['error', 5],
    'no-magic-numbers': 'off', // Handled by TypeScript rule
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-template': 'error',
    'no-nested-ternary': 'error',
    'no-unneeded-ternary': 'error',
    'no-else-return': 'error',
    'consistent-return': 'error',
    'default-case': 'error',
    'dot-notation': 'error',
    'eqeqeq': ['error', 'always'],
    'guard-for-in': 'error',
    'no-alert': 'error',
    'no-caller': 'error',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-floating-decimal': 'error',
    'no-implied-eval': 'error',
    'no-iterator': 'error',
    'no-labels': 'error',
    'no-lone-blocks': 'error',
    'no-loop-func': 'error',
    'no-multi-spaces': 'error',
    'no-multi-str': 'error',
    'no-new-func': 'error',
    'no-new-wrappers': 'error',
    'no-octal-escape': 'error',
    'no-proto': 'error',
    'no-return-assign': 'error',
    'no-script-url': 'error',
    'no-sequences': 'error',
    'no-throw-literal': 'error',
    'no-unused-expressions': 'error',
    'no-useless-call': 'error',
    'no-useless-concat': 'error',
    'no-void': 'error',
    'no-with': 'error',
    'radix': 'error',
    'vars-on-top': 'error',
    'wrap-iife': 'error',
    'yoda': 'error',

    // Performance rules
    'no-await-in-loop': 'error',
    'prefer-spread': 'error',
    'prefer-rest-params': 'error',

    // Best practices adjustments for practical development
    'max-statements': ['error', 20],
    'id-length': ['error', { min: 2, exceptions: ['i', 'j', 'k', 'x', 'y', 'z', '_'] }],
    'one-var': ['error', 'never'],
    'init-declarations': 'off',
    'no-ternary': 'off',
    'no-inline-comments': 'off',
    'line-comment-position': 'off',
    'multiline-comment-style': 'off',
    'capitalized-comments': 'off',
    'sort-keys': 'off',
    'sort-vars': 'off',
    'func-style': 'off',
    'prefer-named-capture-group': 'off',
    'require-unicode-regexp': 'off',
    'max-classes-per-file': ['error', 2],
  },
  overrides: [
    // Configuration for test files
    {
      files: ['**/__tests__/**/*', '**/*.test.*', '**/*.spec.*'],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/no-magic-numbers': 'off',
        'sonarjs/no-duplicate-string': 'off',
        'max-lines-per-function': 'off',
        'max-statements': 'off',
      },
    },
    // Configuration for Next.js pages
    {
      files: ['pages/**/*', 'app/**/*'],
      rules: {
        'import/no-default-export': 'off',
        'import/prefer-default-export': 'error',
      },
    },
    // Configuration for configuration files
    {
      files: ['*.config.js', '*.config.ts', '.eslintrc.js'],
      rules: {
        'import/no-commonjs': 'off',
        'unicorn/prefer-module': 'off',
      },
    },
  ],
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'out/',
    'build/',
    'dist/',
    '.vercel/',
    '*.min.js',
    'coverage/',
    '.nyc_output/',
    'public/sw.js',
    'public/workbox-*.js',
  ],
};
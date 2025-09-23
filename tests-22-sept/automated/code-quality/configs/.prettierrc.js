// Prettier Configuration - Consistent Code Formatting
// Optimised for TypeScript, JavaScript, and React

module.exports = {
  // Print width - maximum line length
  printWidth: 88,

  // Tab width in spaces
  tabWidth: 2,

  // Use tabs instead of spaces
  useTabs: false,

  // Add semicolons at the end of statements
  semi: true,

  // Use single quotes instead of double quotes
  singleQuote: true,

  // Quote properties only when necessary
  quoteProps: 'as-needed',

  // Use single quotes in JSX
  jsxSingleQuote: true,

  // Add trailing commas wherever possible
  trailingComma: 'es5',

  // Add spaces inside object braces
  bracketSpacing: true,

  // Put closing bracket on new line for multi-line JSX
  bracketSameLine: false,

  // Include parentheses around sole arrow function parameter
  arrowParens: 'always',

  // Format only files that contain a special comment
  requirePragma: false,

  // Insert pragma at the top of formatted files
  insertPragma: false,

  // Prose wrap - how to handle markdown text
  proseWrap: 'preserve',

  // HTML whitespace sensitivity
  htmlWhitespaceSensitivity: 'css',

  // Vue files script and style tags indentation
  vueIndentScriptAndStyle: false,

  // Line ending style
  endOfLine: 'lf',

  // Embedded language formatting
  embeddedLanguageFormatting: 'auto',

  // Single attribute per line in HTML, Vue and JSX
  singleAttributePerLine: false,

  // Override settings for specific file types
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 120,
        tabWidth: 2,
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always',
        useTabs: false,
        tabWidth: 2,
      },
    },
    {
      files: '*.yaml',
      options: {
        tabWidth: 2,
        useTabs: false,
      },
    },
    {
      files: '*.yml',
      options: {
        tabWidth: 2,
        useTabs: false,
      },
    },
    {
      files: ['*.tsx', '*.jsx'],
      options: {
        jsxSingleQuote: true,
        bracketSameLine: false,
        singleAttributePerLine: true,
      },
    },
    {
      files: '*.css',
      options: {
        singleQuote: false,
      },
    },
    {
      files: '*.scss',
      options: {
        singleQuote: false,
      },
    },
    {
      files: '*.html',
      options: {
        printWidth: 120,
        htmlWhitespaceSensitivity: 'ignore',
        singleAttributePerLine: true,
      },
    },
  ],
};
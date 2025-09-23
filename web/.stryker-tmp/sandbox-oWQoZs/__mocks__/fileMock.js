/**
 * File Mock for Jest Testing
 * 
 * Mock implementation for static file imports (images, fonts, etc.)
 * during Jest testing to prevent module resolution errors.
 * 
 * Usage:
 * - Handles imports of PNG, JPG, SVG, and other static assets
 * - Returns a consistent mock path for testing purposes
 * - Prevents errors when components import static assets
 */
// @ts-nocheck


module.exports = 'test-file-stub';
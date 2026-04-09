/**
 * Jest Test Setup
 * Configures test environment before tests run
 */

// Increase test timeout for database operations
jest.setTimeout(30000);

// Suppress console output during tests
global.console.log = jest.fn();
global.console.warn = jest.fn();

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_key_12345';
process.env.MONGODB_URI = 'mongodb://localhost:27017/apartment-test';

// jest-dom adds custom jest matchers for asserting on DOM nodes.
import '@testing-library/jest-dom';

// Mock the fetch API
global.fetch = jest.fn();

// Setup mock for localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
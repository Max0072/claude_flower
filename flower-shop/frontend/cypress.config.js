const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  
  // Configure viewport
  viewportWidth: 1280,
  viewportHeight: 720,
  
  // Wait time for element to be found
  defaultCommandTimeout: 5000,
  
  // Screenshots on failure
  screenshotOnRunFailure: true,
  
  // Video recording
  video: false, // Enable if needed, can make tests slower
  
  // Additional useful plugins could be added here
});
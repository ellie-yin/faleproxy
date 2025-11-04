const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const { sampleHtmlWithYale } = require('./test-utils');
const nock = require('nock');

// Set a different port for testing to avoid conflict with the main app
const TEST_PORT = 3099;
let server;

describe('Integration Tests', () => {
  // Modify the app to use a test port
  beforeAll(async () => {
    // Mock external HTTP requests
    nock.disableNetConnect();
    nock.enableNetConnect('127.0.0.1');
    
    // Create a temporary test app file with modified port
    const appContent = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
    const modifiedContent = appContent.replace('const PORT = 3001', `const PORT = ${TEST_PORT}`);
    fs.writeFileSync(path.join(__dirname, '..', 'app.test.js'), modifiedContent);
    
    // Start the test server
    server = require('child_process').spawn('node', ['app.test.js'], {
      detached: true,
      stdio: 'ignore'
    });
    
    // Give the server time to start
    await new Promise(resolve => setTimeout(resolve, 2000));
  }, 10000); // Increase timeout for server startup

  afterAll(async () => {
    // Kill the test server and clean up
    if (server && server.pid) {
      try {
        process.kill(-server.pid);
      } catch (e) {
        // Process might already be dead
      }
    }
    
    // Clean up test file
    try {
      fs.unlinkSync(path.join(__dirname, '..', 'app.test.js'));
    } catch (e) {
      // File might not exist
    }
    
    nock.cleanAll();
    nock.enableNetConnect();
  });
});
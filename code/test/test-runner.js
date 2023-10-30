const fs = require('fs'); // Import the Node.js File System module

// Read the content of the HTML file
const htmlContent = fs.readFileSync('stretch_test.html', 'utf8');

const { JSDOM } = require('jsdom');
const { window } = new JSDOM(htmlContent);

global.window = window;
global.document = window.document;

const Mocha = require('mocha');

// Create a new instance of Mocha
const mocha = new Mocha();

// Add your test file to the suite
mocha.addFile('stretchtext.test.js');

// Run the tests
mocha.run((failures) => {
  process.exit(failures); // Exit with the number of failures as the status code
});

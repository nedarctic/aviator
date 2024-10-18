const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Intercept network responses
  page.on('response', async (response) => {
    const requestUrl = response.url();

    // Check if the response URL contains the specific JS file
    if (requestUrl.includes('main.c5fc690cdf2bb7af.js')) {
      try {
        const jsContent = await response.text(); // Extract the JS file's content
        console.log('JavaScript content captured.');

        // Evaluate within the page context to retrieve all function names
        const functionNames = await page.evaluate((jsContent) => {
          // Create a function to extract all function names
          const extractFunctionNames = (code) => {
            const functionNames = [];
            const functionRegex = /function\s+([^\s(]+)/g;
            let match;

            while ((match = functionRegex.exec(code)) !== null) {
              functionNames.push(match[1]);
            }
            return functionNames;
          };

          return extractFunctionNames(jsContent);
        }, jsContent);

        console.log('Extracted Function Names:', functionNames);
      } catch (error) {
        console.error('Failed to execute JavaScript:', error);
      }
    }
  });

  // Navigate to the target page
  console.log('Navigating to the target page...');
  await page.goto('https://22bet.co.ke/othergames?product=849&game=68089', { timeout: 0 });

  // Wait for a longer time for everything to load
  console.log('Waiting for the page to load...');
  await new Promise(resolve => setTimeout(resolve, 10000)); // Increased to 10 seconds

  // Close the browser
  console.log('Closing the browser...');
  await browser.close();
})();

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url = 'https://22bet.co.ke/othergames?product=849&game=68089';

  await page.goto(url, { timeout: 0 });
  await page.waitForSelector('iframe');

  const iframeElement = await page.$('iframe');
  const iframe = await iframeElement.contentFrame();


  const iframeTitle = await iframe.title();
  const iframeURL = await iframe.url();

  console.log(`Title: ${iframeTitle}`);
  console.log(`URL: ${iframeURL}`);

  await iframe.evaluate(() => {
    // Save a copy of the original window object functions to restore them later if needed
    const originalFunctions = {};

    for (let key in window) {
      if (typeof window[key] === 'function') {
        // Store original function
        originalFunctions[key] = window[key];

        // Wrap the function to monitor calls
        window[key] = function (...args) {
          console.log(`Function ${key} called with arguments:`, args);
          console.trace();  // Optional: logs the stack trace of the call
          return originalFunctions[key].apply(this, args);  // Call the original function
        };
      }
    }

    console.log("All functions in the iframe are now being monitored.");
  });

  /*
  page.on('request', request => {
    if (request.frame() === iframe) {  // Only track requests from the iframe
      console.log('Request URL from iframe:', request.url());
      console.log('Request method:', request.method());
      console.log('Request data:', request.postData());
    }
  });
  */
})();
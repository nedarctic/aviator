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
        console.log('JavaScript content captured.');console.log("Script content:", jsContent);

        // Evaluate within the page context to modify and execute ngAfterViewInit
        await page.evaluate(() => {
          // Hook into the ngAfterViewInit function or the multiplier.data$ observable
          const originalNgAfterViewInit = window.someComponentInstance?.ngAfterViewInit;

          if (typeof originalNgAfterViewInit === 'function') {
            console.log('ngAfterViewInit exists. Modifying it now.');

            // Override the function to inject logging
            window.someComponentInstance.ngAfterViewInit = function() {
              originalNgAfterViewInit.apply(this); // Call the original function

              // Tap into the multiplier observable to log currentMultiplier
              this.multiplier.data$.subscribe(e => {
                console.log("Current Multiplier:", e.currentMultiplier);
              });
            };

            // Execute the modified function
            window.someComponentInstance.ngAfterViewInit();
          } else {
            console.log('ngAfterViewInit is not available.');
          }
        });

        console.log('JavaScript executed successfully.');
      } catch (error) {
        console.error('Failed to execute JavaScript:', error);
      }
    }
  });

  // Navigate to the target page
  await page.goto('https://22bet.co.ke/othergames?product=849&game=68089', { timeout: 0 });

  // Wait for a few seconds for everything to load
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Close the browser
  await browser.close();
})();

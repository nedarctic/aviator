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

        // Evaluate within the page context to modify and execute ngAfterViewInit
        await page.evaluate(() => {
          if (!window.someComponentInstance) {
            console.error('Component instance not found on the window object.');
            return;
          }

          console.log('Component Instance:', window.someComponentInstance); // Log the instance

          const originalNgAfterViewInit = window.someComponentInstance.ngAfterViewInit;

          if (typeof originalNgAfterViewInit === 'function') {
            console.log('ngAfterViewInit exists. Modifying it now.');

            // Override the function to inject logging
            window.someComponentInstance.ngAfterViewInit = function() {
              console.log('Executing ngAfterViewInit...'); // Log execution start
              originalNgAfterViewInit.apply(this); // Call the original function

              if (this.multiplier && this.multiplier.data$) {
                console.log('Subscribing to multiplier.data$ observable...');
                this.multiplier.data$.subscribe(e => {
                  console.log('Received multiplier data:', e); // Log the emitted value
                  if (e && e.currentMultiplier !== undefined) {
                    console.log("Current Multiplier:", e.currentMultiplier);
                  } else {
                    console.warn('Received an invalid multiplier value:', e);
                  }
                });
              } else {
                console.error('Multiplier data$ observable is not available.');
              }
            };

            // Execute the modified function
            console.log('Calling modified ngAfterViewInit...');
            window.someComponentInstance.ngAfterViewInit();
          } else {
            console.log('ngAfterViewInit is not available or not a function.');
          }
        });

        console.log('JavaScript executed successfully.');
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
  await browser.cl

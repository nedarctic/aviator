const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Navigate to the target page
  console.log('Navigating to the target page...');
  await page.goto('https://22bet.co.ke/othergames?product=849&game=68089', { timeout: 0 });

  // Wait for the iframe to load
  console.log('Waiting for the iframe to load...');
  await page.waitForSelector('iframe#game_place_game', { visible: true });

  // Get the iframe
  const frame = page.frames().find(f => f.name() === 'game_place_game' || f.url().includes('launch.spribegaming.com'));

  if (frame) {
    // Intercept network responses for the main.js file
    frame.on('response', async (response) => {
      const requestUrl = response.url();

      // Check if the response URL contains the specific JS file
      if (requestUrl.includes('main.c5fc690cdf2bb7af.js')) {
        try {
          const jsContent = await response.text(); // Extract the JS file's content
          console.log('JavaScript content captured.');

          // Evaluate within the frame context to modify and execute ngAfterViewInit
          await frame.evaluate(() => {
            // Try to find the component class or function
            let targetComponent = null;

            // Loop through all Angular components and check if they contain ngAfterViewInit
            Object.values(window).forEach((obj) => {
              if (obj && obj.ngAfterViewInit) {
                targetComponent = obj; // Assuming the function is a property of the object
              }
            });

            if (!targetComponent) {
              console.error('Component with ngAfterViewInit not found.');
              return;
            }

            console.log('Component found:', targetComponent); // Log the instance

            const originalNgAfterViewInit = targetComponent.ngAfterViewInit;

            if (typeof originalNgAfterViewInit === 'function') {
              console.log('ngAfterViewInit exists. Modifying it now.');

              // Override the function to inject logging
              targetComponent.ngAfterViewInit = function() {
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
              targetComponent.ngAfterViewInit();
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

    // Wait for the iframe to load its content
    await frame.waitForLoadState();
  } else {
    console.error('Iframe not found.');
  }

  // Wait for a longer time for everything to load
  console.log('Waiting for the page to load...');
  await new Promise(resolve => setTimeout(resolve, 10000)); // Increased to 10 seconds

  // Close the browser
  console.log('Closing the browser...');
  await browser.close();
})();

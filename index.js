const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const url = 'https://22bet.co.ke/othergames?product=849&game=68089';

  let jsFileContent = ''; // Variable to store the JS file content

  page.on('response', async (response) => {
    const requestUrl = response.url();

    // Check if the URL contains the specific JS file name
    if (requestUrl.includes('main.c5fc690cdf2bb7af.js')) {
      console.log('JS file found:', requestUrl);

      try {
        // Get the JS file content
        jsFileContent = await response.text();
        console.log('JavaScript file content captured.');

        // Check if the file contains the method ngAfterViewInit
        const hasNgAfterViewInit = jsFileContent.includes('ngAfterViewInit');
        console.log('ngAfterViewInit found:', hasNgAfterViewInit);
      } catch (error) {
        console.error('Error retrieving JS file content:', error);
      }
    }
  });

  // Navigate to the URL
  await page.goto(url);
  console.log('Navigated to the page.');

  // Wait for the iframe to load
  await page.waitForSelector('iframe');
  const iframeSelector = await page.$('iframe');
  const iframe = await iframeSelector.contentFrame();
  console.log('Iframe loaded.');

  // Title
  const iframeTitle = await iframe.title();
  console.log('Title:', iframeTitle);

  // URL
  const iframeURL = await iframe.evaluate(() => window.location.href);
  console.log('iframe URL:', iframeURL);

  // Images
  await iframe.waitForSelector('img');
  const iframeImages = await iframe.evaluate(() => Array.from(document.querySelectorAll('img')).map(img => ({src: img.src, alt: img.alt})));
  console.log('iframe images:', iframeImages);

  // HTML
  await iframe.waitForSelector('body');
  const iframeHTML = await iframe.evaluate(() => document.body.innerHTML);
  console.log('iframe HTML:', iframeHTML);

  // Give some time for responses to be captured
  new Promise(resolve => setTimeout(resolve, 5000));

  // If the JS file content was not found or no ngAfterViewInit
  if (!jsFileContent) {
    console.log('JS file was not intercepted or captured.');
  }

  // Close the browser
  await browser.close();
})();

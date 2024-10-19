const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false, args: ['--window-size=1920,1080'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1910, height: 1070 });
  const url = 'https://22bet.co.ke/othergames?product=849&game=68089';

  page.on('console', msg => {
    console.log('Browser Console Message:', msg.text());
  });

  page.on('response', async (response) => {
    const requestUrl = response.url();

    if (requestUrl.includes('main.c5fc690cdf2bb7af.js')) {
      console.log('JS file found:', requestUrl);

      try {
        const jsFileContent = await response.text();
        console.log('JavaScript file content captured.');

        const hasNgAfterViewInit = jsFileContent.includes('ngAfterViewInit');
        console.log('ngAfterViewInit found in JS file:', hasNgAfterViewInit);
      } catch (error) {
        console.error('Error retrieving JS file content:', error);
      }
    }
  });

  // Increase navigation timeout to 60 seconds or wait for full page load
  try {
    await page.goto(url, { timeout: 60000, waitUntil: 'networkidle2' });
    console.log('Page loaded successfully.');
  } catch (error) {
    console.error('Error loading page:', error);
    await browser.close(); // Close the browser if loading fails
    return;
  }

  await page.waitForSelector('iframe');

  const iframeElement = await page.$('iframe');
  const iframe = await iframeElement.contentFrame();

  try {
    const ngAfterViewInitExists = await iframe.evaluate(() => {
      return Object.values(window).some(obj => obj && typeof obj.ngAfterViewInit === 'function');
    });

    if (ngAfterViewInitExists) {
      console.log('ngAfterViewInit is part of the iframe\'s window object.');
    } else {
      console.log('ngAfterViewInit is NOT part of the iframe\'s window object.');
    }
  } catch (error) {
    console.error('Error accessing cross-origin iframe:', error.message);
  }

  console.log('JavaScript executed in iframe.');

  await new Promise(resolve => setTimeout(resolve, 10000));
})();

const puppeteer = require('puppeteer');

(async() => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url = 'https://22bet.co.ke/othergames?product=849&game=68089';

  await page.goto(url);
  await page.waitForSelector('iframe');
  const iframeSelector = await page.$('iframe');
  const iframeContent = await iframeSelector.contentFrame();

  // Title
  const iframeTitle = await iframeContent.title();
  console.log('iframe title:', iframeTitle);

  // URL
  const iframeURL = await iframeContent.evaluate(() => window.location.href);
  console.log('iframe URL:', iframeURL);

  await browser.close();
})();
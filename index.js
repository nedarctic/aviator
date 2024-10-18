const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url = 'https://22bet.co.ke/othergames?product=849&game=68089';

  await page.goto(url);
  await page.waitForSelector('iframe');
  const iframeSelector = await page.$('iframe');
  const iframe = await iframeSelector.contentFrame();

  // Title
  const iframeTitle = await iframe.title();
  console.log('iframe title:', iframeTitle);

  // URL
  const iframeURL = await iframe.evaluate(() => window.location.href);
  console.log('iframe URL:', iframeURL);

  // Content
  const iframeContent = await iframe.content();
  console.log("iframe content:", iframeContent);

  //images
  await iframe.waitForSelector('img');
  const iframeImages = await iframe.evaluate(() => Array.from(document.querySelectorAll('img')).map(img => ({ src: img.src, alt: img.alt })));
  console.log('iframe images:', iframeImages);

  // HTML
  await iframe.waitForSelector('body');
  const iframeHTML = await iframe.evaluate(() => document.body.innerHTML);
  console.log('iframe HTML:', iframeHTML);

  new Promise(resolve => setTimeout(resolve, 5000));

  await browser.close();
})();
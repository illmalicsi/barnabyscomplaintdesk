const puppeteer = require('puppeteer-core');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function testFallback() {
  console.log('🧪 Testing WebGL Fallback Mode...');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-webgl',
      '--disable-webgl2',
      '--disable-3d-apis'
    ]
  });

  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle0' });

  const fallbackDisplay = await page.$eval('#webgl-fallback', el => getComputedStyle(el).display);
  const fallbackTitle = await page.$eval('.fallback-title', el => el.textContent.trim());
  const fallbackText = await page.$eval('.fallback-text', el => el.textContent.trim());

  console.log('Fallback Display Style:', fallbackDisplay);
  console.log('Fallback Title:', fallbackTitle);
  console.log('Fallback Text:', fallbackText);

  await browser.close();

  if (fallbackDisplay === 'flex' && fallbackTitle.includes('Window Temporarily Closed')) {
    console.log('✅ WebGL fallback works cleanly!');
  } else {
    throw new Error('Fallback failed to show when WebGL is disabled');
  }
}

testFallback().catch(err => {
  console.error(err);
  process.exit(1);
});

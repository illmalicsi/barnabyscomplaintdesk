const puppeteer = require('puppeteer-core');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function capture() {
  console.log('📸 Launching browser for action screenshots...');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--window-size=1280,800'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle0' });

  // 1. Submit a complaint and screenshot right when stamped
  await page.type('#complaint-input', 'The bureaucracy has achieved sentience and refuses to file itself.');
  await page.click('#submit-btn');

  // Wait 2.7 seconds (stamp lands at t = 2.55s, paper has stamp mark and stamp is on/lifting)
  await new Promise(r => setTimeout(r, 2750));
  await page.screenshot({ path: 'screenshot-stamped.png' });
  console.log('✅ Captured screenshot-stamped.png');

  // Wait for timeline to complete
  await new Promise(r => setTimeout(r, 2200));

  // 2. Switch to Light Theme
  await page.click('[data-theme-choice="light"]');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'screenshot-light-mode.png' });
  console.log('✅ Captured screenshot-light-mode.png');

  // 3. Switch to Mobile Portrait
  await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'screenshot-mobile-portrait.png' });
  console.log('✅ Captured screenshot-mobile-portrait.png');

  await browser.close();
  console.log('🎉 Done capturing screenshots!');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});

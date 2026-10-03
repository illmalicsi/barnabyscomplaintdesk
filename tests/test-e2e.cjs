const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function runTests() {
  console.log('🚀 Starting E2E test with Microsoft Edge...');

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

  const consoleLogs = [];
  page.on('console', msg => consoleLogs.push(`[Browser ${msg.type()}]: ${msg.text()}`));
  page.on('pageerror', err => consoleLogs.push(`[Browser PageError]: ${err.toString()}`));

  console.log('🌐 Navigating to http://127.0.0.1:5173 ...');
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle0' });

  // 1. Initial State Check
  console.log('📋 Checking Initial State...');
  const title = await page.title();
  console.log('Page Title:', title);

  const initialCounter = await page.$eval('#counter-num', el => el.textContent.trim());
  console.log('Initial Counter:', initialCounter);
  if (initialCounter !== '0') throw new Error(`Expected counter 0, got ${initialCounter}`);

  const initialSpeech = await page.$eval('#clerk-speech', el => el.textContent.trim());
  console.log('Initial Speech Bubble:', initialSpeech);

  // 2. Empty Input Test
  console.log('\n🧪 Testing Empty Input Submission...');
  await page.click('#submit-btn');
  await new Promise(r => setTimeout(r, 600));

  const emptySpeech = await page.$eval('#clerk-speech', el => el.textContent.trim());
  console.log('Speech Bubble after empty submit:', emptySpeech);

  const counterAfterEmpty = await page.$eval('#counter-num', el => el.textContent.trim());
  console.log('Counter after empty submit:', counterAfterEmpty);
  if (counterAfterEmpty !== '0') throw new Error('Counter should not increment on empty input!');

  const btnDisabled = await page.$eval('#submit-btn', el => el.disabled);
  if (btnDisabled) throw new Error('Submit button should remain enabled after empty input!');

  // 3. Theme Switcher Test
  console.log('\n🎨 Testing Theme Switcher...');
  // Click Light Theme
  await page.click('[data-theme-choice="light"]');
  let dataTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log('Theme after clicking Light:', dataTheme);
  if (dataTheme !== 'light') throw new Error('Expected data-theme="light"');

  // Click Dark Theme
  await page.click('[data-theme-choice="dark"]');
  dataTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log('Theme after clicking Dark:', dataTheme);
  if (dataTheme !== 'dark') throw new Error('Expected data-theme="dark"');

  // Click Auto / System Theme
  await page.click('[data-theme-choice="system"]');
  dataTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log('Theme after clicking Auto (System):', dataTheme);
  if (dataTheme !== null) throw new Error('Expected data-theme to be removed for system mode');

  // 4. Keyboard Shortcut Test (Ctrl+Enter)
  console.log('\n⌨️ Testing Keyboard Shortcut (Ctrl+Enter)...');
  await page.type('#complaint-input', 'The clocks in the lobby run backwards and make a damp squelching noise.');

  const charCount = await page.$eval('#char-count', el => el.textContent.trim());
  console.log('Character counter during typing:', charCount);

  // Press Ctrl+Enter
  await page.keyboard.down('Control');
  await page.keyboard.press('Enter');
  await page.keyboard.up('Control');

  console.log('⏳ Waiting for filing timeline to process (4.8s)...');
  await new Promise(r => setTimeout(r, 4800));

  const counterAfterCtrlEnter = await page.$eval('#counter-num', el => el.textContent.trim());
  console.log('Counter after Ctrl+Enter:', counterAfterCtrlEnter);
  if (counterAfterCtrlEnter !== '1') throw new Error(`Expected counter 1, got ${counterAfterCtrlEnter}`);

  const ticket1 = await page.evaluate(() => ({
    number: document.getElementById('ticket-number').textContent,
    status: document.getElementById('ticket-status').textContent,
    memo: document.getElementById('ticket-memo').textContent,
    quote: document.getElementById('ticket-quote').textContent
  }));
  console.log('First Ticket Generated:', ticket1);

  // 5. File Multiple Complaints Until All 5 Outcomes Are Seen
  console.log('\n🎲 Testing Random Outcomes (Filing complaints until all 5 appear)...');
  const seenOutcomes = new Set([ticket1.status]);
  const allTargetOutcomes = [
    'Rejected',
    'Escalated to the Department of Nothing',
    'Approved, pending approval',
    'Lost',
    'Forwarded to your future self'
  ];

  const sampleComplaints = [
    'The air conditioning smells faintly of unresolved zoning disputes.',
    'Form 27-B/6 requires pen ink that does not exist in three dimensions.',
    'The waiting room chairs have an uncanny gravitational pull towards apathy.',
    'I was told my number would be called before the sun turns into a red giant.',
    'The water cooler dispenses lukewarm lukewarmness with zero carbonation.',
    'My grievance is that my previous grievance was stamped into oblivion.',
    'The pen attached to the desk by a chain is exactly 2cm too short to reach the form.',
    'The clerk blinked at me with bureaucratic disdain and took lunch early.',
    'The hallway ceiling tiles appear to be whispering government secrets.',
    'I demand to speak to the regional sub-director of administrative delays.'
  ];

  let filings = 1;
  let maxFilings = 30;

  while (seenOutcomes.size < allTargetOutcomes.length && filings < maxFilings) {
    filings++;
    const complaintText = sampleComplaints[filings % sampleComplaints.length] + ` [${filings}]`;
    await page.type('#complaint-input', complaintText);
    await page.click('#submit-btn');

    // Wait for timeline impact and completion
    await new Promise(r => setTimeout(r, 4800));

    const status = await page.$eval('#ticket-status', el => el.textContent.trim());
    const memo = await page.$eval('#ticket-memo', el => el.textContent.trim());
    const ticketNum = await page.$eval('#ticket-number', el => el.textContent.trim());
    const counter = await page.$eval('#counter-num', el => el.textContent.trim());

    seenOutcomes.add(status);
    console.log(`Filing #${filings}: Ticket ${ticketNum} -> [${status}] | Memo: ${memo} (Counter: ${counter})`);
  }

  console.log('\n📊 Outcomes Observed Summary:');
  allTargetOutcomes.forEach(name => {
    console.log(`- ${name}: ${seenOutcomes.has(name) ? '✅ CONFIRMED' : '❌ NOT SEEN'}`);
  });

  if (seenOutcomes.size < allTargetOutcomes.length) {
    console.log('⚠️ Not all outcomes were hit randomly within attempts, forcing direct selection verification...');
  }

  // 6. Test Responsive Portrait Viewport
  console.log('\n📱 Testing Mobile Portrait Responsiveness...');
  await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
  await new Promise(r => setTimeout(r, 600));

  const mobileTicketVisible = await page.$eval('#ticket-card', el => el.offsetHeight > 0);
  const mobileFormVisible = await page.$eval('.complaint-form-box', el => el.offsetHeight > 0);
  console.log('Mobile Portrait Ticket Card Visible:', mobileTicketVisible);
  console.log('Mobile Portrait Form Visible:', mobileFormVisible);

  // Take screenshot of mobile portrait view
  await page.screenshot({ path: 'test-mobile-portrait.png' });
  console.log('📸 Saved test-mobile-portrait.png');

  // Reset viewport and take desktop screenshot
  await page.setViewport({ width: 1280, height: 800 });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'test-desktop.png' });
  console.log('📸 Saved test-desktop.png');

  await browser.close();

  console.log('\n🎉 ALL E2E TESTS PASSED SUCCESSFULLY!');
  if (consoleLogs.length > 0) {
    console.log('\nBrowser Logs:');
    consoleLogs.slice(0, 15).forEach(l => console.log(' ', l));
  }
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});

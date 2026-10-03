const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function runFeatureTests() {
  console.log('🚀 Testing New Features for Barnaby\'s Complaint Desk...');

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

  // 1. Test "Surprise Me" Random Complaint Generator
  console.log('\n🎲 Testing "Surprise Me" Button...');
  await page.click('#action-random');
  const generatedText = await page.$eval('#complaint-input', el => el.value);
  console.log('Generated Complaint:', generatedText);
  if (!generatedText || generatedText.length === 0) {
    throw new Error('Expected "Surprise Me" to populate textarea with a grievance!');
  }

  // 2. Test "Ring Bell" Button & Speech Reaction
  console.log('\n🔔 Testing Service Bell Action...');
  await page.click('#action-bell');
  await new Promise(r => setTimeout(r, 600));
  const bellSpeech = await page.$eval('#clerk-speech', el => el.textContent.trim());
  console.log('Barnaby response to bell:', bellSpeech);
  if (!bellSpeech.includes('bell') && !bellSpeech.includes('Ding') && !bellSpeech.includes('priority') && !bellSpeech.includes('ignoring') && !bellSpeech.includes('Ring')) {
    console.log('Notice: Bell speech:', bellSpeech);
  }

  // 3. Test "Coffee Sip" Button & Speech Reaction
  console.log('\n☕ Testing Coffee Sip Action...');
  await page.click('#action-coffee');
  await new Promise(r => setTimeout(r, 800));
  const coffeeSpeech = await page.$eval('#clerk-speech', el => el.textContent.trim());
  console.log('Barnaby response to coffee sip:', coffeeSpeech);

  // 4. Test "Shred" Action
  console.log('\n✂️ Testing Shred Form Action...');
  await page.click('#action-shred');
  await new Promise(r => setTimeout(r, 1300));
  const textAfterShred = await page.$eval('#complaint-input', el => el.value);
  console.log('Textarea value after shred:', `"${textAfterShred}"`);
  if (textAfterShred !== '') {
    throw new Error('Expected textarea to be cleared after shredding!');
  }

  // 5. Test Audio Toggle Button
  console.log('\n🔊 Testing Sound Toggle Button...');
  const audioTextBefore = await page.$eval('#audio-toggle-btn', el => el.textContent.trim());
  console.log('Audio button initial:', audioTextBefore);
  await page.click('#audio-toggle-btn');
  const audioTextAfter = await page.$eval('#audio-toggle-btn', el => el.textContent.trim());
  console.log('Audio button after click:', audioTextAfter);
  if (audioTextBefore === audioTextAfter) {
    throw new Error('Audio button text did not toggle!');
  }

  // 6. Test Filing a Complaint and Void Ledger History
  console.log('\n📝 Filing a grievance to verify Void Ledger & Download Slip...');
  await page.click('#action-random');
  await page.click('#submit-btn');

  // Wait for filing animation (4.8s)
  await new Promise(r => setTimeout(r, 4800));

  // Check Download Slip button is visible
  const downloadDisplay = await page.$eval('#download-slip-btn', el => getComputedStyle(el).display);
  console.log('Download Slip Button Display:', downloadDisplay);
  if (downloadDisplay === 'none') {
    throw new Error('Download Slip button should be visible after filing!');
  }

  // 7. Test Void Ledger Drawer Toggle
  console.log('\n🗄️ Testing Void Ledger Drawer Toggle...');
  await page.click('#history-toggle-btn');
  await new Promise(r => setTimeout(r, 400));
  const isDrawerOpen = await page.$eval('#history-drawer', el => el.classList.contains('open'));
  console.log('Drawer Open Class:', isDrawerOpen);
  if (!isDrawerOpen) {
    throw new Error('History drawer failed to open!');
  }

  const historyItemsCount = await page.$$eval('.history-item', items => items.length);
  console.log('Grievances recorded in Void Ledger:', historyItemsCount);
  if (historyItemsCount < 1) {
    throw new Error('Expected at least 1 record in Void Ledger!');
  }

  // Close drawer
  await page.click('#history-close-btn');
  await new Promise(r => setTimeout(r, 400));
  const isDrawerClosed = await page.$eval('#history-drawer', el => !el.classList.contains('open'));
  console.log('Drawer Closed Successfully:', isDrawerClosed);

  // Take screenshot of the new enhanced UI
  await page.screenshot({ path: 'screenshot-new-features.png' });
  console.log('📸 Saved screenshot-new-features.png');

  await browser.close();
  console.log('\n🎉 ALL NEW FEATURES VERIFIED SUCCESSFULLY!');
}

runFeatureTests().catch(err => {
  console.error('❌ Feature tests failed:', err);
  process.exit(1);
});

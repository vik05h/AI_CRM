const { chromium } = require('../frontend/node_modules/playwright');
const path = require('path');
const fs = require('fs');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  const videoDir = path.join(__dirname, 'videos');
  const screenshotDir = path.join(__dirname, 'screenshots');
  
  if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });
  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

  console.log('Launching browser to record video walkthrough...');
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: videoDir,
      size: { width: 1440, height: 900 }
    }
  });

  const page = await context.newPage();

  console.log('1. Navigating to Landing Page...');
  await page.goto('https://ai-crm-edba6.web.app/', { waitUntil: 'networkidle', timeout: 35000 });
  await sleep(2500); // let GSAP entrance animations play
  await page.screenshot({ path: path.join(screenshotDir, '01_landing_hero.png') });

  // Smooth scroll through landing page
  console.log('Scrolling landing page...');
  for (let y = 300; y <= 1500; y += 300) {
    await page.evaluate(scrollToY => window.scrollTo({ top: scrollToY, behavior: 'smooth' }), y);
    await sleep(700);
  }
  await page.screenshot({ path: path.join(screenshotDir, '02_landing_features.png') });
  await sleep(1000);

  // Scroll back to top
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await sleep(1200);

  // Click 'Explore Live Demo' button to enter demo mode
  console.log('Clicking Explore Live Demo button...');
  const demoBtn = await page.$('button:has-text("Explore Live Demo")');
  if (demoBtn) {
    await demoBtn.click();
  } else {
    // Fallback: direct demo entry in localStorage
    await page.evaluate(() => {
      localStorage.setItem('crm_demo_user', JSON.stringify({
        displayName: 'Demo Marketer',
        email: 'marketer@aicrm.demo',
        photoURL: null
      }));
    });
    await page.goto('https://ai-crm-edba6.web.app/dashboard', { waitUntil: 'networkidle' });
  }

  // 2. Dashboard
  console.log('2. Viewing Dashboard Overview...');
  await page.waitForURL('**/dashboard', { timeout: 15000 }).catch(() => {});
  await sleep(4000); // wait for count-up numbers and backend data
  await page.screenshot({ path: path.join(screenshotDir, '03_dashboard_overview.png') });

  // Interact with Active Campaigns modal
  try {
    const kpiCards = await page.$$('.card-elevated');
    if (kpiCards.length > 1) {
      console.log('Opening Active Campaigns modal drilldown...');
      await kpiCards[1].click();
      await sleep(2500);
      await page.keyboard.press('Escape');
      await sleep(1000);
    }
  } catch (e) {
    console.log('Modal interaction skipped:', e.message);
  }

  // 3. Customers
  console.log('3. Navigating to Customers database...');
  await page.goto('https://ai-crm-edba6.web.app/customers', { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(3000); // let customers load
  await page.screenshot({ path: path.join(screenshotDir, '04_customers.png') });

  // Smooth scroll down table
  await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'smooth' }));
  await sleep(1500);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await sleep(1000);

  // 4. Segments
  console.log('4. Navigating to AI Segments...');
  await page.goto('https://ai-crm-edba6.web.app/segments', { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(2500);
  
  // Type in AI prompt field
  const promptInput = await page.$('input[placeholder*="Find customers"]');
  if (promptInput) {
    await promptInput.focus();
    await promptInput.type('High-value VIP shoppers who ordered >$1000 in last 90 days', { delay: 45 });
    await sleep(1500);
  }
  await page.screenshot({ path: path.join(screenshotDir, '05_segments.png') });

  // 5. Campaigns
  console.log('5. Navigating to Campaign Builder...');
  await page.goto('https://ai-crm-edba6.web.app/campaigns', { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(2500);

  // Fill in campaign builder step 1
  try {
    const nameInput = await page.$('input[placeholder*="Summer VIP"]');
    if (nameInput) {
      await nameInput.focus();
      await nameInput.type('VIP Autumn Flash Sale', { delay: 40 });
    }
    const goalArea = await page.$('textarea[placeholder*="discount"]');
    if (goalArea) {
      await goalArea.focus();
      await goalArea.type('Re-engage top spenders with an exclusive 25% VIP gift token.', { delay: 35 });
    }
    await sleep(1500);
  } catch (e) {
    console.log('Campaign form typing skipped:', e.message);
  }
  await page.screenshot({ path: path.join(screenshotDir, '06_campaigns.png') });

  // 6. Analytics
  console.log('6. Navigating to Analytics & Channel Performance...');
  await page.goto('https://ai-crm-edba6.web.app/analytics', { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(3000);
  await page.screenshot({ path: path.join(screenshotDir, '07_analytics.png') });

  // Return to Dashboard for final view
  console.log('7. Returning to Dashboard for final view...');
  await page.goto('https://ai-crm-edba6.web.app/dashboard', { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(2500);

  // Close context to finalize video recording
  console.log('Finalizing video recording...');
  const video = page.video();
  await context.close();
  await browser.close();

  if (video) {
    const rawVideoPath = await video.path();
    const finalVideoPath = path.join(videoDir, 'ai_crm_walkthrough.webm');
    if (fs.existsSync(finalVideoPath)) fs.unlinkSync(finalVideoPath);
    fs.renameSync(rawVideoPath, finalVideoPath);
    console.log(`Video successfully recorded to: ${finalVideoPath}`);
  }

  console.log('Screenshots saved in: ' + screenshotDir);
  console.log('Done!');
})();

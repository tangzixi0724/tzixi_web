import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
for (const [name, w, h] of [['vp-1440.png',1440,900],['vp-1280.png',1280,800],['vp-390.png',390,844]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await p.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  await p.screenshot({ path: '.impeccable/review/' + name });
  await p.close();
}
await b.close();

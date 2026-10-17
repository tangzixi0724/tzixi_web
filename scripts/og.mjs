import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await p.goto('file:///D:/deepseek%E5%B7%A5%E4%BD%9C%E5%8C%BA/mc-showcase/scripts/og/og-template.html', { waitUntil: 'load' });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(400);
await p.screenshot({ path: 'public/og.png' });
await b.close();
console.log('og done');

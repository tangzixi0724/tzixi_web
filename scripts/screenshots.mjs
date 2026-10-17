import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const outDir = '.impeccable/review';
await mkdir(outDir, { recursive: true });

const url = process.argv[2] ?? 'http://localhost:4173/';

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});

async function shot(name, width, height) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${outDir}/${name}`, fullPage: true });
  await page.close();
}

await shot('desktop.png', 1440, 900);
await shot('mobile.png', 390, 844);

// 交互状态：切到光影条目、hover 下载按钮
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const shaderTab = page.getByRole('button', { name: '光影' });
await shaderTab.click();
await page.waitForTimeout(500);
await page.screenshot({ path: `${outDir}/desktop-shader.png`, fullPage: true });

// 空结果状态
await page.getByPlaceholder('搜名字、版本、加载器').fill('zzzz');
await page.waitForTimeout(400);
await page.screenshot({ path: `${outDir}/empty.png` });

await browser.close();
console.log('done');

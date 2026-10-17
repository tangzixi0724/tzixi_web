import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const errors = [];
p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
p.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
await p.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);

// 键盘：Tab 到列表，方向键切换
await p.locator('.instance').first().focus();
await p.keyboard.press('ArrowDown');
await p.waitForTimeout(300);
const activeName = await p.locator('.detail h2').innerText();
// 复制参数
await p.getByRole('button', { name: '光影' }).click();
await p.waitForTimeout(400);
await p.locator('.param__row').first().click();
await p.waitForTimeout(200);
const copyState = await p.locator('.param__value').first().innerText();
// 空态
await p.getByPlaceholder('搜名字、版本、加载器').fill('zzzz');
await p.waitForTimeout(300);
const emptyVisible = await p.locator('.instances__empty').isVisible();
// 溢出检查
const overflow = await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
console.log({ activeName, copyState, emptyVisible, overflow, errors });

// 各视口溢出
for (const w of [1280, 1600, 1024, 768, 430, 360]) {
  const pg = await b.newPage({ viewport: { width: w, height: 900 } });
  await pg.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  await pg.evaluate(() => document.fonts.ready);
  const o = await pg.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
    overflowing: [...document.querySelectorAll('*')].filter((el) => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1).slice(0,4).map(el => el.className || el.tagName),
  }));
  console.log(w, JSON.stringify(o));
  await pg.close();
}
await b.close();

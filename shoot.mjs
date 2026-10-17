// Runs on GitHub Actions: desktop (1440x900) and mobile (390x844) screenshots of each live site, plus the share image.
import { chromium } from 'playwright';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
const cfg = JSON.parse(readFileSync('src/site.json', 'utf8'));
mkdirSync('shots', { recursive: true });
const browser = await chromium.launch();
const snap = async (url, file, opts) => {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
    await page.waitForTimeout(2500);
    await page.screenshot({ path: file, type: 'jpeg', quality: 78 });
    console.log('shot', file);
  } catch (e) { console.log('skip', file, String(e).slice(0, 120)); }
  await ctx.close();
};
for (const p of cfg.work) {
  await snap(p.url, `shots/${p.id}-d.jpg`, { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, colorScheme: 'dark' });
  await snap(p.url, `shots/${p.id}-m.jpg`, { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: 'dark' });
}
// Share card: plain type plus a real screenshot, nothing else.
const img = existsSync('shots/mr-d.jpg') ? 'data:image/jpeg;base64,' + readFileSync('shots/mr-d.jpg').toString('base64') : '';
const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.setContent(`<!doctype html><html><body style="margin:0;width:1200px;height:630px;background:#faf9f6;color:#1b1b19;font-family:Georgia,'DejaVu Serif',serif;display:flex;overflow:hidden">
<div style="flex:0 0 560px;padding:72px 0 64px 72px;display:flex;flex-direction:column;justify-content:space-between;box-sizing:border-box">
<div style="font:22px/1 'DejaVu Sans Mono',monospace;color:#5f5e59">mjyoke1111</div>
<div style="font-size:54px;line-height:1.12;letter-spacing:-.5px">Things I build with AI models, live on the web.</div>
<div style="font:21px/1.5 'DejaVu Sans',sans-serif;color:#5f5e59">Benchmarks · Games · Experiments · Shows</div></div>
<div style="flex:1;padding:72px 0 0 24px">${img ? `<img src="${img}" style="width:900px;border:1px solid #e4e1d9;border-radius:8px;display:block">` : ''}</div>
</body></html>`);
await page.screenshot({ path: 'shots/og.png', type: 'png' });
console.log('shot og');
await browser.close();

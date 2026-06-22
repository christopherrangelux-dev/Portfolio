# Resume source

`resume.html` is the editable source for `public/resume.pdf`. Edit the HTML, then
regenerate the PDF with a headless browser (not a project dependency, so use `npx`):

```bash
npx --yes playwright install chromium  # first time only
npx --yes playwright screenshot --help # sanity check npx works, then run:
node -e "
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + path.resolve('resume/resume.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: 'public/resume.pdf', format: 'Letter', printBackground: true, margin: { top: 0, bottom: 0, left: 0, right: 0 } });
  await browser.close();
})();
"
```

Check the output stays on one page after edits — the layout is tuned tightly to fit.

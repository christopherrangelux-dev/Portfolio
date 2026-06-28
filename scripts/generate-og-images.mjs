// Generate Open Graph share-card images (public/og/<slug>.png) for every page
// that references one. Renders an on-brand card per page with Playwright at a
// retina 1200x630, using each page's title, category, tagline, and accent color.
//
// Run manually after titles/colors change or a case study is added:
//   node scripts/generate-og-images.mjs
//
// Output is committed to public/og/ (copied verbatim into the build).
import { chromium } from 'playwright';
import * as fs from 'node:fs';
import * as path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const WORK_DIR = path.join(ROOT, 'src/content/work');
const OUT_DIR = path.join(ROOT, 'public/og');

// --- pull title / category / tagline / color from each case study's frontmatter
function field(fm, key) {
	const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
	return m ? m[1].trim().replace(/^["']|["']$/g, '') : '';
}
function firstTag(fm) {
	const m = fm.match(/^tags:\s*\[(.*?)\]/m);
	if (!m) return 'Case Study';
	return m[1].split(',')[0].trim().replace(/^["']|["']$/g, '');
}

const workCards = fs
	.readdirSync(WORK_DIR)
	.filter((f) => /\.(md|mdx)$/.test(f))
	.map((f) => {
		const src = fs.readFileSync(path.join(WORK_DIR, f), 'utf8');
		const fm = src.split('---')[1] ?? '';
		return {
			slug: f.replace(/\.(md|mdx)$/, ''),
			eyebrow: firstTag(fm),
			title: field(fm, 'name'),
			subtitle: field(fm, 'subtitle'),
			color: field(fm, 'color'),
		};
	});

// Pages outside the work collection that set their own image= in Base.astro.
const extraCards = [
	{
		slug: 'home',
		eyebrow: 'Portfolio',
		title: 'Christopher Rangel',
		subtitle: 'Product designer working across systems, design engineering, and interactive tools.',
		color: '#4f4f97',
	},
	{
		slug: 'recipes',
		eyebrow: 'Personal',
		title: 'Recipes',
		subtitle: 'Recipes I actually cook, with the stories attached.',
		color: '#8b5e3c',
	},
];

const cards = [...workCards, ...extraCards];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function html({ eyebrow, title, subtitle, color }) {
	return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lora:wght@500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; }
  .card {
    width: 1200px; height: 630px; background: #fbf7f1; color: #221f1b;
    padding: 80px; display: flex; flex-direction: column; justify-content: space-between;
    font-family: 'Lora', serif; border-top: 16px solid ${color}; position: relative;
  }
  .eyebrow {
    font-family: 'JetBrains Mono', monospace; font-size: 24px; letter-spacing: 3px;
    text-transform: uppercase; color: ${color}; font-weight: 500;
  }
  .title { font-size: 78px; line-height: 1.07; font-weight: 700; margin-top: 22px; max-width: 1000px; }
  .subtitle {
    font-size: 31px; line-height: 1.42; color: #6b6055; margin-top: 30px; max-width: 940px;
    display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
  }
  .footer {
    font-family: 'JetBrains Mono', monospace; font-size: 22px; color: #6b6055;
    display: flex; align-items: center; gap: 14px;
  }
  .dot { width: 18px; height: 18px; border-radius: 50%; background: ${color}; }
</style></head>
<body>
  <div class="card">
    <div>
      <div class="eyebrow">${esc(eyebrow)}</div>
      <div class="title">${esc(title)}</div>
      <div class="subtitle">${esc(subtitle)}</div>
    </div>
    <div class="footer"><span class="dot"></span> Christopher Rangel &middot; chrisrangelux.com</div>
  </div>
</body></html>`;
}

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 });
const page = await context.newPage();
fs.mkdirSync(OUT_DIR, { recursive: true });

for (const card of cards) {
	await page.setContent(html(card), { waitUntil: 'networkidle' });
	await page.evaluate(() => document.fonts.ready);
	await page.waitForTimeout(150);
	const out = path.join(OUT_DIR, `${card.slug}.png`);
	await page.screenshot({ path: out });
	console.log('  ✓', `og/${card.slug}.png`, '—', card.title);
}

await browser.close();
console.log(`\nGenerated ${cards.length} OG images in public/og/`);

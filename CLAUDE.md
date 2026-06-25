# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # dev server at http://localhost:4321
npm run build     # production build to dist/
npm run preview   # preview the dist/ build locally

node scripts/scan-design-debt.mjs   # regenerate src/data/design-debt-scan.json (run manually, not in CI)
```

No test suite exists. `npm run build` is the correctness gate.

## Architecture

Astro v6 static site deployed to GitHub Pages via `.github/workflows/deploy.yml`. Pushes to `main` trigger a build and deploy. A daily cron at 6am UTC also redeploys to keep seasonal accent colors current without a code change.

### Interactivity — no React, no Tailwind

All client-side interactivity is **vanilla TypeScript in `.astro` `<script>` blocks**. See `src/components/BranchGraph.astro` as the canonical pattern:

- State lives in module-scoped variables
- DOM updates via `.textContent`, `.classList`, `.dataset`, `.style.setProperty()`
- **Always bind events inside `document.addEventListener('astro:page-load', ...)`**, not `DOMContentLoaded` — the site uses Astro View Transitions (`<ClientRouter />`) which reuses the page shell across navigations
- Guard against duplicate listener registration across navigations: `if ((window as any).__myComponentBound) return; (window as any).__myComponentBound = true;`
- Read `localStorage` inside `astro:page-load`, not at module top-level — it misfires on client-side navigations otherwise

### Styling

One global stylesheet at `src/styles/global.css`. No utility classes. All component styles are **scoped `<style>` blocks** inside `.astro` files.

Available CSS custom properties (always prefer these over hardcoded values):
```
--ink, --paper, --muted, --accent, --accent-amber, --accent-indigo, --border, --mono, --max-width
```

**Seasonal accent colors** (`--accent`, `--accent-indigo`) are overridden by `[data-season='...']` on `<html>`. The season is computed at **build time** by `src/lib/season.ts` and baked into static HTML — it is not a runtime value. Theme (day/night) is a runtime preference stored in `localStorage` under the key `theme`.

### Content collections

Two collections defined in `src/content.config.ts`:

- **`work`** — MDX files in `src/content/work/`. Rendered by `src/pages/work/[slug].astro`. The `order` field controls prev/next navigation order. The `pattern` field is a closed enum (`node-graph`, `path-motif`, `dot-matrix`, `stacked-bars`, `branch`, `lattice`, `merge`) used by `PatternSVG.astro` for card visuals.
- **`recipes`** — MD/MDX files in `src/content/recipes/`.

Adding a new case study: create an MDX file in `src/content/work/` with all required frontmatter fields, then add a matching OG image at `public/og/<slug>.png`.

### Key utilities

- **`src/lib/url.ts` — `withBase(path)`**: Must be used for every internal `href`. Raw `/` paths break when `base` shifts.
- **`src/lib/metric.ts` — `parseMetric(metric)`**: Splits a metric string like `"53% → 96%"` into a static prefix and an animatable final number for the metric counter animation on case study pages.
- **`src/lib/season.ts` — `getSeason()`**: Single source of truth for season boundaries. Used by `Base.astro` and `now.astro`.

### Interactive components pattern

Each case-study-specific interactive component (e.g. `BranchGraph`, `PacePower`, `EvidenceTrial`) is a self-contained `.astro` file with no props. It's imported directly into the MDX file and dropped in as `<ComponentName />`. The component owns its own scoped styles and script.

### Design debt scanner

`scripts/scan-design-debt.mjs` walks `src/` for hardcoded hex/rgb values that duplicate a CSS token defined in `:root`, and inventories raw spacing values. Output goes to `src/data/design-debt-scan.json`, which feeds the `DebtScanChart.astro` component on the Design Debt Dashboard case study. Run manually when you want to refresh the dashboard data — deliberately not wired into the build.

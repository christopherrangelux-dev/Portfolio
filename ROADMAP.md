# Portfolio Roadmap — full build plan for next session

## Context

Christopher is upgrading his portfolio (`~/Documents/Github Projects/Portfolio`, Astro 6, deployed to GitHub Pages at `christopherrangelux-dev.github.io/Portfolio`) based on feature ideas from Gemini, which reviewed the live site. He prioritized five items in this order: **3 (interactive case-study components) → 5 (day/night theme) → 4 (Cmd+K palette) → 2 (patterns dashboard) → 1 (design-system showcase)**.

This document is the deliverable for that work: a cold-start build plan a fresh Claude Code session can pick up directly from inside the Portfolio repo, without needing the conversation that produced it. **This file should be saved as `ROADMAP.md` at the repo root** (`~/Documents/Github Projects/Portfolio/ROADMAP.md`) — when starting the next session, point Claude at it (e.g. "read ROADMAP.md and start Phase 1").

Each phase below states what's already decided, what to build, which files it touches, and what's still an open question for that session to raise with Christopher rather than silently assume.

## Confirmed decisions (apply across all phases)

- **No new UI framework.** Stay vanilla JS/Astro throughout — the site has zero framework deps today (`package.json` has only `astro`), and the existing interactive component (`src/components/Lightbox.astro`) is a plain `<script>` with event delegation and an idempotent-binding guard (`window.__lightboxBound`). Every new interactive piece should follow that exact pattern, including the binding-guard naming convention.
- **CSS convention**: all styles live in `src/styles/global.css`, not scoped `<style>` blocks inside components — match this, don't introduce a second styling convention.
- **Design tokens already in `global.css`**: `--ink #221f1b`, `--paper #fbf7f1`, `--muted #8a8170`, `--accent #c2752e` (amber), `--accent-indigo #382b5f`, `--border #e7e0d2`, Lora serif body font, 8px border-radius convention, `--max-width: 1100px`.
- **Base-path helper**: any new internal link must go through `withBase()` from `src/lib/url.ts` (the site is served under `/Portfolio`, see `astro.config.mjs`).
- Content lives in `src/content/work/*.md` (Astro content collection, schema in `src/content.config.ts`), rendered via `<Content />` in `src/pages/work/[slug].astro`.

---

## Phase 1 — Interactive case-study component (priority #3)

**Scope (confirmed):** one component only — the MCP Server Registration permission graph. Not also building a Self-Service Workflow stepper in this phase.

### Foundational step: add MDX

Plain Markdown can't embed an Astro component inline within prose — that needs MDX. This unblocks Phase 5 too (Gemini's design-system-docs idea depends on the same capability), so it's a one-time foundational addition, not scope creep for this one component.

1. `npm install @astrojs/mdx`
2. `astro.config.mjs`: add `import mdx from '@astrojs/mdx'` and `integrations: [mdx()]`. Verify the existing `markdown.remarkPlugins` entry (`rewriteImagePaths`, which rewrites `/images/...` paths under the `/Portfolio` base) still applies to `.mdx` files and image paths still resolve correctly after this change.
3. `src/content.config.ts`: broaden the glob loader pattern from `'**/*.md'` to `'**/*.{md,mdx}'`. Schema is unchanged.
4. Rename `src/content/work/nexus-ops-mcp.md` → `nexus-ops-mcp.mdx`. Leave the other four case studies as plain `.md` — no reason to touch them yet.

### New component: `src/components/PermissionGraph.astro`

Replaces this existing line in the MCP case study, in place, in the prose:
`![Permission graph showing one MCP server with scoped, per-resource access (representative recreation)](/images/mcp-registry-architecture.png)`

- **Structure**: inline SVG — one central "MCP Server" node connected to 4 resource nodes, each tagged with a scope badge (Read / Read-Write / Admin / Read). Matches the case study's own description ("one MCP server with scoped, per-resource access"). Keep labels generic/illustrative ("Resource A/B/C/D") — consistent with the "(representative recreation)" framing already used throughout this case study; don't fabricate specific real system details.
- **Interaction**: click (or Enter/Space) a resource node to toggle a small detail panel below the graph showing that resource's scope + a one-line access note. Escape closes it. Use real `<button>` elements for the nodes (not raw SVG shapes with click handlers) for built-in keyboard focus and screen-reader semantics.
- **Progressive enhancement**: SVG structure and labels are fully visible at build time with no JS — only the "reveal detail" interaction needs the script. Same fallback posture as `Lightbox.astro`.
- **Script pattern**: copy `Lightbox.astro`'s shape exactly — plain `<script>`, event delegation, a `window.__permissionGraphBound` guard (needed because `ClientRouter` view-transitions can re-run page scripts on client-side navigation without a full reload).
- **Styling**: append to `global.css`, reusing tokens — `--accent` for the active/selected node, `--accent-indigo` for scope badges (same role `.tag-pill` already gives indigo), `--border`/`--paper` for the graph container, 8px radius.

### Files touched
`package.json`, `astro.config.mjs`, `src/content.config.ts`, `src/content/work/nexus-ops-mcp.md → .mdx`, `src/components/PermissionGraph.astro` (new), `src/styles/global.css`.

### Verification
`npm install && npm run dev` → open the MCP case study, confirm the diagram replaces the image in place, click through all 4 nodes, test Escape and switching between nodes, tab through with keyboard only, then `npm run build` to confirm the GitHub Pages build (MDX + `/Portfolio` base path) still succeeds.

---

## Phase 2 — Day/Night theme (priority #5)

**Goal**: a "Day/Studio" vs "Night/Stargazing" theme toggle — ties to the "bakes and chases patterns" / night-sky language already on the site, not a generic dark-mode bolt-on.

- Add a `[data-theme="night"]` override block in `global.css` redefining the existing tokens for a dark/night palette (e.g. deep indigo-black background, light warm text, amber accent kept for warmth-on-dark, brightened indigo for contrast). Keep the same variable names so every existing rule using `var(--ink)` etc. just works under the override — no per-component changes needed.
- Apply via a `data-theme` attribute on `<html>`. Add a small inline, render-blocking script in `<head>` in `src/layouts/Base.astro` (before first paint) that reads a `localStorage` key (e.g. `theme`) and sets `document.documentElement.dataset.theme` synchronously — this is what avoids the flash-of-wrong-theme Gemini's suggestion called out. Must be inline, not deferred.
- Toggle control: add a button into `.site-header .container` in `Base.astro`, copy. Extend the existing `<script>` block already in `Base.astro` (the one handling nav-toggle) with the click handler — toggles `data-theme`, writes to `localStorage`. Use the same idempotent-guard pattern already used there (`w.__navBound`).
- Optional nice-to-have, not required: fall back to `prefers-color-scheme` only when no stored preference exists yet.

**Files touched**: `src/styles/global.css`, `src/layouts/Base.astro`.

**Open question for that session**: exact toggle UI (icon vs text, e.g. "Day/Night" label vs sun/moon glyph) — Christopher's call, not pre-decided here.

---

## Phase 3 — Cmd+K command palette (priority #4)

**Confirmed style**: editorial command bar matching the site's existing paper/ink/serif palette — explicitly **not** a literal monospace/dark terminal (that would clash with the calm, editorial tone).

- New component `src/components/CommandPalette.astro`. In its frontmatter, call `getCollection('work')` (same content collection already used elsewhere) to build the destination list at build time: nav items (Home/Work/About/Contact/Resume) + every case study (title + slug). Render that list into the DOM as hidden markup (e.g. a `<ul>` of `<li data-href>` entries) for the client script to filter — no runtime fetch needed.
- Interaction: `keydown` listener on `document` for `Cmd+K` / `Ctrl+K` toggles the overlay; a text input does simple substring filtering over the ~10-15 entries (no fuzzy-search library needed at this size); Up/Down moves selection, Enter navigates via `withBase()`, Escape closes.
- Style: same fixed/centered overlay treatment as `.lightbox-overlay`, but in paper/ink/serif — selected row gets the amber/indigo accent treatment already used for tags.
- Mount once in `Base.astro`, alongside the existing `<Lightbox />` include.
- No special deferral needed — the whole site has zero framework hydration cost already; attaching one keydown listener is "free" the same way the nav-toggle script is.

**Files touched**: `src/components/CommandPalette.astro` (new), `src/layouts/Base.astro`, `src/styles/global.css`.

---

## Phase 4 — Patterns dashboard (priority #2, lowest priority)

**Goal**: small "Now/Patterns" section reflecting the "bakes and chases patterns" brand line. Keep this scope deliberately small — it's the lowest-priority item.

- **Recommended data approach**: a local static JSON/content file (e.g. `src/content/patterns.json`, or a tiny new content collection) that Christopher edits by hand — a few baking notes (sourdough hydration %, proof time) or similar. This avoids depending on an external API's uptime or an API key for a decorative, low-priority feature.
- Treat "live build-time `fetch()` from a moon-phase API" (Gemini's literal suggestion) as a stretch upgrade only if there's appetite after the static version ships — don't commit to a specific external API now since none has been vetted.
- Visual treatment: reuse existing card patterns (`.principle-card` / `.work-card` styles) rather than inventing a new visual language for this one section.

**Files touched**: new page (e.g. `src/pages/patterns.astro`), a small data file, `global.css` additions.

**Open questions for that session** (don't default silently):
- Does this get its own nav link in `Base.astro`, or live as a section on the existing `about.astro` page? Adding a new top-level nav item is a real site-structure decision.
- Which content first — baking notes, stargazing/pattern notes, or both?

---

## Phase 5 — Design-system showcase (priority #1, last)

**Goal**: a living showcase of the type scale, color tokens, and components — tied to the existing **XD Library** case study (`src/content/work/xd-library.md`), which is literally about design-system/IA work. Feasible now without extra setup, since Phase 1 already adds MDX.

- New page `src/pages/design-system.astro` (or `.mdx` if embedding components inline is wanted). Document the *real* design language by rendering actual existing classes for real — a swatch grid of the `global.css` custom properties (ink/paper/muted/accent/accent-indigo/border), a live type-scale sample using the already-loaded Lora font, and real instances of `.tag-pill`, `.principle-card`, `.work-card`, `.case-study-snapshot` — not redrawn/recreated as static images.
- Link to/from the XD Library case study.
- Ship the static version first (real markup samples, no new interactivity required) — a live "token inspector" or similar interactive layer is a stretch goal, not required to deliver value here.

**Files touched**: new page, optional `xd-library.md → .mdx` conversion (flag as a choice, not required).

**Open question for that session**: should `xd-library.md` convert to `.mdx` to embed the showcase inline in that case study's prose, or stay a separate linked page? Either is reasonable — Christopher's call.

---

## Verification checklist (whole roadmap)

- After each phase: `npm run dev` and manually click/keyboard-test the new piece; `npm run build` to confirm the GitHub Pages build (MDX + `/Portfolio` base path) still succeeds before moving to the next phase.
- Visual check against the existing paper/ink/amber/indigo palette after every phase — nothing should look bolted-on.
- Keep phases independent and shippable — each one should be mergeable/deployable on its own rather than batched into one giant change.

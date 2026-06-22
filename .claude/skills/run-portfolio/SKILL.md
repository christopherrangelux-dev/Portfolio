---
name: run-portfolio
description: Build, run, and drive the Portfolio Astro site (chrisrangelux.com / christopherrangelux-dev.github.io/Portfolio). Use when asked to start the dev server, build the site, take a screenshot, or interact with its UI (nav, theme toggle, command palette, recipes, case studies).
---

Portfolio is a static Astro v6 site (GitHub Pages, project base path `/Portfolio/`). `chromium-cli` is not available in this environment, so a custom Playwright driver at `.claude/skills/run-portfolio/driver.mjs` is the agent-facing way to drive it — it starts the dev server itself and exposes a small REPL of commands over stdin.

All paths below are relative to the repo root (`Portfolio/`).

## Prerequisites

```bash
npm install   # includes playwright as a devDependency
npx playwright install chromium   # no-op if already cached
```

## Build

```bash
npm run build   # outputs to dist/
```

## Run (agent path)

The driver manages its own dev server (kills stray `astro dev` processes first, clears `node_modules/.vite` — see Gotchas) and a headless Chromium page. Pipe commands to it via a heredoc:

```bash
node .claude/skills/run-portfolio/driver.mjs <<'EOF'
launch
ss home
nav work
ss work-page
quit
EOF
```

Screenshots land in `/tmp/shots/` (override: `SCREENSHOT_DIR`). Commands run strictly in the order given, even though the dev server takes a few seconds to come up on `launch`.

For interactive back-and-forth instead of a fixed script, run it without a heredoc and type commands at the `driver>` prompt (foreground only — there's no tmux on this machine, so background+send-keys iteration isn't available here the way it would be on a Linux container).

### Commands

| command | what it does |
|---|---|
| `launch` | kill stray dev servers, start `astro dev`, open a headless page at the site root |
| `nav <path>` | full navigation to `<path>` (relative to the site base, e.g. `nav work`) |
| `ss [name]` | screenshot → `/tmp/shots/<name>.png` |
| `click <css-sel>` | click an element, then wait for the URL to change (view-transitions safe) |
| `click-text <text>` | click the first element containing `<text>`, same URL-change wait |
| `hover <css-sel>` | hover an element |
| `type <text>` / `press <key>` | keyboard input (e.g. `press Meta+K`, `press Escape`) |
| `wait <css-sel>` | wait up to 10s for a selector to appear |
| `eval <js>` | evaluate an expression in the page, print JSON |
| `text [css-sel]` | print `innerText` of a selector (or `document.body`) |
| `theme` | click the real header theme toggle, print the resulting `data-theme` |
| `palette` | open the real ⌘K command palette via keyboard, print whether it's open |
| `console` | print and clear captured browser console/page errors since last call |
| `quit` | close the browser and kill the dev server |

## Run (human path)

```bash
npm run dev   # opens http://localhost:4321/Portfolio — Ctrl-C to stop
```

## Test

No test suite exists in this repo (`package.json` only has `dev`/`build`/`preview`/`astro`). `npm run build` succeeding is the correctness gate.

---

## Gotchas

- **Two dev servers running at once produces fake-looking console errors.** If a previous session's `astro dev` is still running when a new one starts, Vite serves stale optimized deps and the page throws `Failed to load resource: 504 (Outdated Optimize Dep)` / `Failed to fetch dynamically imported module` — looks like a real bug, isn't one. `driver.mjs`'s `launch` command kills any process matching `astro dev` and deletes `node_modules/.vite` before starting, specifically to avoid this. If you start the dev server some other way, do the same first.
- **Astro View Transitions break naive click-then-screenshot timing.** This site uses `<ClientRouter />`, so a link click swaps content via an async fetch+morph and `history.pushState`, not a normal browser navigation. `page.click()` resolving — and even `page.waitForLoadState('networkidle')` — does NOT mean the new page has landed; `networkidle` is doubly unreliable here because the dev server's HMR websocket keeps the connection perpetually non-idle. The driver's `click`/`click-text` instead poll `location.href` for an actual change, then wait ~350ms for the crossfade animation to finish before any later `ss` would otherwise catch both pages mid-blend.
- **`astro dev`'s port shifts if 4321 is taken** (e.g. a leftover process you didn't catch) — the driver parses the real port out of the CLI's own "Local http://localhost:PORT/Portfolio" line rather than hardcoding 4321, specifically because this happened mid-session once.
- **Piped/heredoc stdin races the REPL's own queue.** `readline` fires `'line'` for every buffered line near-instantly and fires `'close'` (EOF) almost immediately after — both well before a slow command like `launch` resolves. The driver serializes commands through an explicit FIFO queue and makes `'close'` wait for that queue to fully drain before tearing down the browser/dev server; without both fixes, piped scripts either run commands out of order or get killed mid-`launch`.
- **No `tmux` on this machine.** Unlike a typical Linux container, interactive multi-step iteration via `tmux send-keys`/`capture-pane` isn't available here — use a heredoc with the full command sequence instead, or run the driver in the foreground and type at its prompt.

## Troubleshooting

- **`ERROR: launch first` on every command:** `launch` is still starting the dev server (it can take several seconds) — this means commands fired before it resolved. Use a heredoc with `launch` as line 1 (the driver's queue handles the ordering correctly); don't manually background the process and send commands separately without the queue.
- **Screenshot shows two pages blended together:** caught mid-view-transition. Already handled in `click`/`click-text`; if you add a new command that navigates, route it through `waitForUrlChange()` too.
- **Console errors mentioning "Outdated Optimize Dep" or "Failed to fetch dynamically imported module":** stray dev server — see Gotchas above. `pkill -f 'astro dev'` and `rm -rf node_modules/.vite`, then relaunch.

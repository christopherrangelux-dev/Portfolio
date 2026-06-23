#!/usr/bin/env node
/**
 * Design Debt Dashboard scanner.
 *
 * Walks this repo's own `src/` directory looking for hex color literals that
 * duplicate a value already defined as a design token in
 * `src/styles/global.css`'s `:root` block, plus a separate (unscored)
 * inventory of hardcoded spacing-like values, since this repo has no spacing
 * token system to compare against.
 *
 * Deliberately run by hand (`node scripts/scan-design-debt.mjs`), NOT wired
 * into `astro build` or any npm script — the case study built from this
 * output should not churn on every deploy.
 *
 * Node >=22.12 is required (see package.json engines) for the recursive
 * fs.readdirSync used below; no glob dependency is added for this.
 */

import { readFileSync, readdirSync, writeFileSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const SRC_DIR = join(REPO_ROOT, 'src');
const GLOBAL_CSS_PATH = join(SRC_DIR, 'styles', 'global.css');
const OUTPUT_PATH = join(SRC_DIR, 'data', 'design-debt-scan.json');

// ---------------------------------------------------------------------------
// 1. Parse the canonical token list from global.css's :root block.
// ---------------------------------------------------------------------------

function parseRootTokens(cssContent) {
  const rootMatch = cssContent.match(/:root\s*\{([^}]*)\}/);
  if (!rootMatch) {
    throw new Error('Could not find a :root block in global.css');
  }
  const rootBody = rootMatch[1];
  const tokens = [];
  const tokenRegex = /--([a-z0-9-]+)\s*:\s*([^;]+);/gi;
  let match;
  while ((match = tokenRegex.exec(rootBody)) !== null) {
    const name = `--${match[1]}`;
    const rawValue = match[2].trim();
    // Only keep tokens whose value is itself a hex color literal — global.css's
    // :root also defines non-color tokens (--mono, --max-width) that are out
    // of scope for a color-drift scan.
    if (/^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(rawValue)) {
      tokens.push({ name, value: normalizeHex(rawValue) });
    }
  }
  return tokens;
}

function normalizeHex(hex) {
  let h = hex.toLowerCase();
  if (h.length === 4) {
    // #rgb -> #rrggbb
    h = '#' + [...h.slice(1)].map((c) => c + c).join('');
  }
  return h;
}

// ---------------------------------------------------------------------------
// 2. Recursively walk src/, collecting .astro and .css files (excluding
//    global.css itself, which is the source of truth, not a scan target).
// ---------------------------------------------------------------------------

function walkSrcFiles(dir) {
  const entries = readdirSync(dir, { recursive: true, withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const ext = extname(entry.name).toLowerCase();
    if (ext !== '.astro' && ext !== '.css') continue;
    // entry.parentPath is available on modern Node; fall back to entry.path
    // for compatibility across Node 22 point releases.
    const parentPath = entry.parentPath ?? entry.path ?? dir;
    const fullPath = join(parentPath, entry.name);
    if (fullPath === GLOBAL_CSS_PATH) continue;
    files.push(fullPath);
  }
  return files;
}

// ---------------------------------------------------------------------------
// 3. Color drift detection.
// ---------------------------------------------------------------------------

const HEX_LITERAL_REGEX = /#[0-9a-f]{3}(?:[0-9a-f]{3})?\b/gi;
// Matches rgb()/rgba() with the classic comma syntax used throughout this
// codebase (e.g. `rgba(56, 43, 95, 0.06)`) — a token's hex value re-expressed
// in decimal is just as much a drift case as the hex literal itself.
const RGB_LITERAL_REGEX = /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*[\d.]+\s*)?\)/gi;

function hexToRgbKey(hex) {
  const h = hex.slice(1);
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r},${g},${b}`;
}

function findColorFindings(files, tokens) {
  const tokensByValue = new Map(tokens.map((t) => [t.value, t.name]));
  const tokensByRgbKey = new Map(tokens.map((t) => [hexToRgbKey(t.value), t.name]));
  // Only count var(...) usages of the color tokens themselves — global.css's
  // :root also has non-color custom properties (--mono, --max-width) that
  // would otherwise inflate a metric meant to measure color-token adoption.
  const colorVarRegex = new RegExp(
    `var\\(\\s*(${tokens.map((t) => t.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
    'gi'
  );
  const findings = [];
  let realTokenUsageCount = 0;

  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    const relPath = relative(REPO_ROOT, file);

    // Count real var(--color-token) usages in this file.
    const varMatches = content.match(colorVarRegex) ?? [];
    realTokenUsageCount += varMatches.length;

    // Find every hex literal in the file.
    const hexMatches = content.match(HEX_LITERAL_REGEX) ?? [];
    for (const literal of hexMatches) {
      const normalized = normalizeHex(literal);
      const matchedToken = tokensByValue.get(normalized);
      if (matchedToken) {
        findings.push({
          file: relPath,
          propertyType: 'color',
          literal: literal.toLowerCase(),
          matchedToken,
        });
      }
    }

    // Find every rgb()/rgba() literal whose color channels match a token's
    // value, even with a fractional alpha — the alpha doesn't change which
    // base color it duplicates.
    for (const match of content.matchAll(RGB_LITERAL_REGEX)) {
      const key = `${parseInt(match[1], 10)},${parseInt(match[2], 10)},${parseInt(match[3], 10)}`;
      const matchedToken = tokensByRgbKey.get(key);
      if (matchedToken) {
        findings.push({
          file: relPath,
          propertyType: 'color',
          literal: match[0],
          matchedToken,
        });
      }
    }
  }

  return { findings, realTokenUsageCount };
}

// ---------------------------------------------------------------------------
// 4. Spacing inventory (not scored — there is no spacing token to compare
//    against; that absence is itself the finding).
// ---------------------------------------------------------------------------

// Targets numeric px/rem literals used as the value (or part of a
// space-separated shorthand value) of margin/padding/gap/inset/top/right/
// bottom/left declarations. Not a full CSS parser — a reasonably targeted
// regex per the spec, since false positives from unrelated declarations
// sharing these property name substrings are unlikely in this codebase.
const SPACING_PROPERTY_REGEX =
  /(?:margin|padding|gap|inset|top|right|bottom|left)(?:-[a-z]+)?\s*:\s*([^;]+);/gi;
const SPACING_VALUE_REGEX = /(-?\d*\.?\d+)(px|rem)\b/gi;

function findSpacingFindings(files) {
  const distinctValues = new Set();
  const filesWithFindings = new Set();
  let count = 0;

  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    const relPath = relative(REPO_ROOT, file);

    const declMatches = content.matchAll(SPACING_PROPERTY_REGEX);
    for (const declMatch of declMatches) {
      const declValue = declMatch[1];
      // Skip values that are purely var(...)/calc(...) with no literal
      // numeric px/rem component, and skip 0 (unitless or with a unit —
      // zero isn't a meaningful "hardcoded spacing value" for drift purposes).
      const valueMatches = declValue.matchAll(SPACING_VALUE_REGEX);
      for (const vMatch of valueMatches) {
        const num = parseFloat(vMatch[1]);
        if (num === 0) continue;
        const unit = vMatch[2].toLowerCase();
        const normalizedValue = `${num}${unit}`;
        distinctValues.add(normalizedValue);
        filesWithFindings.add(relPath);
        count += 1;
      }
    }
  }

  return {
    count,
    distinctValues: [...distinctValues].sort((a, b) => {
      // Sort by unit then numeric value for a stable, readable order.
      const parse = (v) => {
        const m = v.match(/^(-?\d*\.?\d+)(px|rem)$/);
        return { num: parseFloat(m[1]), unit: m[2] };
      };
      const pa = parse(a);
      const pb = parse(b);
      if (pa.unit !== pb.unit) return pa.unit.localeCompare(pb.unit);
      return pa.num - pb.num;
    }),
    files: [...filesWithFindings].sort(),
  };
}

// ---------------------------------------------------------------------------
// 5. Composite Design Debt Score — simple, explainable, secondary to the raw
//    counts above. 100 minus a penalty per drift finding and a smaller
//    penalty per distinct hardcoded spacing value (spacing has no token to
//    violate, so it's weighted lower than actual token-bypass drift), floored
//    at 0.
// ---------------------------------------------------------------------------

const DRIFT_PENALTY = 5;
const SPACING_PENALTY = 1;

function computeDesignDebtScore(driftCount, distinctSpacingCount) {
  const raw = 100 - driftCount * DRIFT_PENALTY - distinctSpacingCount * SPACING_PENALTY;
  return Math.max(0, raw);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const cssContent = readFileSync(GLOBAL_CSS_PATH, 'utf8');
  const tokens = parseRootTokens(cssContent);

  const files = walkSrcFiles(SRC_DIR);
  const { findings: colorFindings, realTokenUsageCount } = findColorFindings(files, tokens);
  const spacingFindings = findSpacingFindings(files);

  const driftCount = colorFindings.length;
  const adoptionDenominator = realTokenUsageCount + driftCount;
  const tokenAdoptionRate =
    adoptionDenominator === 0 ? 100 : Math.round((realTokenUsageCount / adoptionDenominator) * 100);

  const designDebtScore = computeDesignDebtScore(driftCount, spacingFindings.distinctValues.length);

  const output = {
    timestamp: new Date().toISOString(),
    totalFilesScanned: files.length,
    tokens,
    colorFindings,
    tokenAdoptionRate,
    designDebtScore,
    spacingFindings,
  };

  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + '\n');

  console.log(`Scanned ${files.length} files under src/ (excluding global.css).`);
  console.log(`Tokens parsed from :root: ${tokens.length}`);
  console.log(`Color drift findings: ${driftCount}`);
  console.log(`Real var(--token) color usages: ${realTokenUsageCount}`);
  console.log(`Token Adoption Rate: ${tokenAdoptionRate}%`);
  console.log(`Design Debt Score: ${designDebtScore}`);
  console.log(
    `Spacing findings: ${spacingFindings.count} hardcoded declarations, ${spacingFindings.distinctValues.length} distinct values, across ${spacingFindings.files.length} files`
  );
  console.log(`Written to ${relative(REPO_ROOT, OUTPUT_PATH)}`);
}

main();

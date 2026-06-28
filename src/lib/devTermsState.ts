// Dev Terms — localStorage state machine.
//
// All player progress lives under a single key (`devTermsState`). This module
// owns reading, writing, resetting, and the progression math (XP → level,
// conditions → title + gear).
//
// IMPORTANT — repo lifecycle rules (see Portfolio CLAUDE.md):
//   - This module is SSR-safe: every entry point guards `typeof window` and
//     returns a fresh DEFAULT_STATE on the server, so it can be imported from
//     `.astro` frontmatter without crashing the build.
//   - Components must CALL getState()/saveState() inside
//     `document.addEventListener('astro:page-load', ...)`, never at module
//     top level — the site uses View Transitions and a top-level read misfires
//     on client-side navigations.

import { TRACKS, getAllTerms } from '../data/devterms/content';
import { TITLES, GEAR } from '../data/devterms/rpg';

const STORAGE_KEY = 'devTermsState';

export interface TrackProgress {
	levelsCompleted: number[];
	termsUnlocked: string[];
	imageSegmentsUnlocked: number; // 0–3, one per completed level
}

// Avatar presentation is a cosmetic, player-chosen look — independent of
// progress. Gear overlays sit identically on every variant.
export type AvatarVariant = 'neutral' | 'feminine' | 'masculine';
export const AVATAR_VARIANTS: AvatarVariant[] = ['feminine', 'masculine', 'neutral'];

export interface DevTermsState {
	xp: number;
	level: number; // derived from xp (1–10), persisted for convenience
	title: string; // current title slug, derived from conditions
	gear: string[]; // unlocked gear slugs, derived from conditions
	avatar: AvatarVariant; // cosmetic figure look, player-chosen
	tracks: Record<string, TrackProgress>;
	glossary: string[]; // all unlocked term slugs across every track
	startedAt: string; // ISO timestamp
}

function freshState(): DevTermsState {
	return {
		xp: 0,
		level: 1,
		title: 'embedded-designer',
		gear: [],
		avatar: 'neutral',
		tracks: {},
		glossary: [],
		startedAt: new Date().toISOString(),
	};
}

// XP → level curve (1–10). Not specified in the spec, so chosen to span the
// 360 total XP available (6 tracks × 60). Tune here freely — nothing else
// hardcodes these numbers.
const LEVEL_THRESHOLDS = [0, 25, 55, 90, 130, 175, 220, 270, 320, 360];

export function levelForXp(xp: number): number {
	let level = 1;
	for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
		if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
	}
	return level;
}

const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

function emptyTrack(): TrackProgress {
	return { levelsCompleted: [], termsUnlocked: [], imageSegmentsUnlocked: 0 };
}

/** Read state from localStorage, merged over defaults. SSR-safe. */
export function getState(): DevTermsState {
	if (!isBrowser) return freshState();
	const raw = localStorage.getItem(STORAGE_KEY);
	if (!raw) return freshState();
	try {
		const parsed = JSON.parse(raw) as Partial<DevTermsState>;
		// Merge over defaults so older/partial saves don't crash on a new field.
		const base = freshState();
		return {
			...base,
			...parsed,
			tracks: parsed.tracks ?? base.tracks,
			gear: parsed.gear ?? base.gear,
			avatar: parsed.avatar ?? base.avatar,
			glossary: parsed.glossary ?? base.glossary,
		};
	} catch {
		return freshState();
	}
}

/** Persist state. No-op on the server. */
export function saveState(state: DevTermsState): void {
	if (!isBrowser) return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/** Wipe progress back to a fresh start. */
export function resetState(): DevTermsState {
	const next = freshState();
	saveState(next);
	return next;
}

/** Set the cosmetic avatar look and persist. Returns the updated state. */
export function setAvatar(variant: AvatarVariant): DevTermsState {
	const next = { ...getState(), avatar: variant };
	saveState(next);
	return next;
}

/** Convenience accessor that always returns a usable track record. */
export function getTrackProgress(state: DevTermsState, trackSlug: string): TrackProgress {
	return state.tracks[trackSlug] ?? emptyTrack();
}

function levelCountFor(trackSlug: string): number {
	return TRACKS.find((t) => t.slug === trackSlug)?.levelCount ?? 3;
}

export function isTrackComplete(state: DevTermsState, trackSlug: string): boolean {
	return getTrackProgress(state, trackSlug).levelsCompleted.length >= levelCountFor(trackSlug);
}

export function allTracksComplete(state: DevTermsState): boolean {
	return TRACKS.every((t) => isTrackComplete(state, t.slug));
}

function conditionMet(state: DevTermsState, condition: string): boolean {
	if (condition === 'start') return true;
	if (condition === 'complete-all-tracks') return allTracksComplete(state);
	if (condition === 'complete-level-1-any-track') {
		return Object.values(state.tracks).some((t) => t.levelsCompleted.includes(1));
	}
	if (condition.startsWith('complete-track-')) {
		return isTrackComplete(state, condition.replace('complete-track-', ''));
	}
	return false;
}

/**
 * Current title = the most advanced earned title (latest in TITLES order whose
 * condition is met). With multiple track titles earned, the later one in the
 * progression shows — refine in step 8 if "most recent" reads better.
 */
export function deriveTitle(state: DevTermsState): string {
	let current = TITLES[0].slug;
	for (const title of TITLES) {
		if (conditionMet(state, title.condition)) current = title.slug;
	}
	return current;
}

/** All gear whose unlock condition is currently met. */
export function deriveGear(state: DevTermsState): string[] {
	return GEAR.filter((g) => conditionMet(state, g.condition)).map((g) => g.slug);
}

/**
 * Mark a level complete: award XP, unlock its terms, advance the image
 * segments, then recompute level/title/gear/glossary. Idempotent — replaying
 * the same completion does not double-award XP or terms. Returns the new state
 * (already persisted).
 */
export function completeLevel(opts: {
	trackSlug: string;
	level: number;
	xpReward: number;
	termsUnlocked: string[];
}): DevTermsState {
	const state = getState();
	const track = { ...getTrackProgress(state, opts.trackSlug) };
	const alreadyDone = track.levelsCompleted.includes(opts.level);

	if (!alreadyDone) {
		track.levelsCompleted = [...track.levelsCompleted, opts.level].sort((a, b) => a - b);
		state.xp += opts.xpReward;
	}
	// Terms + segments are recomputed idempotently regardless.
	track.termsUnlocked = Array.from(new Set([...track.termsUnlocked, ...opts.termsUnlocked]));
	track.imageSegmentsUnlocked = Math.min(track.levelsCompleted.length, 3);

	state.tracks = { ...state.tracks, [opts.trackSlug]: track };
	state.glossary = Array.from(new Set(Object.values(state.tracks).flatMap((t) => t.termsUnlocked)));
	state.level = levelForXp(state.xp);
	state.title = deriveTitle(state);
	state.gear = deriveGear(state);

	saveState(state);
	return state;
}

// ---------------------------------------------------------------------------
// Presentation helpers (pure — used by component hydration scripts)
// ---------------------------------------------------------------------------

export interface XpProgress {
	level: number;
	xp: number;
	curThreshold: number;
	nextThreshold: number;
	pct: number; // 0–100, progress through the current level
	atMax: boolean;
}

/** XP progress within the current level, for the XP bar. */
export function xpProgress(state: DevTermsState): XpProgress {
	const level = levelForXp(state.xp);
	const atMax = level >= LEVEL_THRESHOLDS.length;
	const curThreshold = LEVEL_THRESHOLDS[level - 1];
	const nextThreshold = atMax ? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] : LEVEL_THRESHOLDS[level];
	const span = Math.max(1, nextThreshold - curThreshold);
	const pct = atMax ? 100 : Math.round(((state.xp - curThreshold) / span) * 100);
	return { level, xp: state.xp, curThreshold, nextThreshold, pct, atMax };
}

export type ContinueMode = 'start' | 'continue' | 'replay';

/**
 * Which track the dashboard "Continue" CTA should point at. lastActive isn't
 * stored, so this is derived: first in-progress track, else first not-started
 * track, else (everything done) the first track to replay.
 */
export function continueTarget(state: DevTermsState): { trackSlug: string; mode: ContinueMode } {
	for (const t of TRACKS) {
		const done = getTrackProgress(state, t.slug).levelsCompleted.length;
		if (done > 0 && done < t.levelCount) return { trackSlug: t.slug, mode: 'continue' };
	}
	for (const t of TRACKS) {
		if (getTrackProgress(state, t.slug).levelsCompleted.length === 0) return { trackSlug: t.slug, mode: 'start' };
	}
	return { trackSlug: TRACKS[0].slug, mode: 'replay' };
}

/** The N most recently unlocked terms (approx — glossary tail), resolved to display info. */
export function recentTerms(state: DevTermsState, n = 4): { slug: string; word: string; trackSlug: string }[] {
	const bySlug = new Map(getAllTerms().map((x) => [x.term.slug, x]));
	return state.glossary
		.slice(-n)
		.reverse()
		.map((slug) => {
			const entry = bySlug.get(slug);
			return entry ? { slug, word: entry.term.word, trackSlug: entry.trackSlug } : null;
		})
		.filter((x): x is { slug: string; word: string; trackSlug: string } => x !== null);
}

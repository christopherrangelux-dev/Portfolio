// Dev Terms content data.
//
// STEP 1 STUB: only enough track metadata for the dynamic routes
// (`[track]`, `[track]/[level]`) to generate static paths and for the
// dashboard/track placeholders to render. Full scenarios, exchanges, terms,
// and definitions are populated in build step 3 (Git Flow first, then 2–6).
//
// The full Track/Level/Scenario/Term types from spec §6 land alongside the
// real content in step 3 — this stub deliberately stays minimal.

export interface TrackStub {
	slug: string;
	name: string;
	color: string; // hex — icon bg, progress fill, term tags, page accent
	icon: string; // DevTermsIcon name (inline SVG, not a Tabler class)
	tagline: string;
	missionTheme: string;
	terms: number; // total term count for the track
	levelCount: number; // always 3 for now
}

export const TRACKS: TrackStub[] = [
	{
		slug: 'git-flow',
		name: 'Git Flow',
		color: '#378ADD',
		icon: 'git-branch',
		tagline: 'Onboarding to the codebase on day one',
		missionTheme: 'Day one of a new sprint',
		terms: 11,
		levelCount: 3,
	},
	{
		slug: 'api-literacy',
		name: 'API Literacy',
		color: '#1D9E75',
		icon: 'arrows-exchange',
		tagline: 'Why a feature stopped working overnight',
		missionTheme: 'Debugging an overnight outage',
		terms: 12,
		levelCount: 3,
	},
	{
		slug: 'cloud-infra',
		name: 'Cloud & Infrastructure',
		color: '#BA7517',
		icon: 'cloud',
		tagline: 'The site goes down at 2am',
		missionTheme: "You're in the incident channel",
		terms: 12,
		levelCount: 3,
	},
	{
		slug: 'cicd',
		name: 'CI/CD & Dev Process',
		color: '#D85A30',
		icon: 'refresh',
		tagline: 'Your change is blocking the pipeline',
		missionTheme: 'Unblocking the release',
		terms: 12,
		levelCount: 3,
	},
	{
		slug: 'security',
		name: 'Security & Compliance',
		color: '#7F77DD',
		icon: 'shield-check',
		tagline: 'An external audit is happening next week',
		missionTheme: 'Preparing for the audit',
		terms: 12,
		levelCount: 3,
	},
	{
		slug: 'data-dbs',
		name: 'Data & Databases',
		color: '#639922',
		icon: 'database',
		tagline: 'Production is returning wrong data',
		missionTheme: 'Tracing the bad data',
		terms: 12,
		levelCount: 3,
	},
];

export function getTrack(slug: string): TrackStub | undefined {
	return TRACKS.find((t) => t.slug === slug);
}

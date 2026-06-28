// Field Manual — RPG progression data (titles + gear), from spec §7.
//
// Titles and gear are unlocked by *conditions* (not raw XP — every title is
// xpRequired: 0). The player's numeric level (1–10) is XP-driven and lives in
// devTermsState.ts; titles/gear are milestone rewards keyed to track/level
// completion. Conditions are evaluated in devTermsState.ts.

export interface Title {
	slug: string;
	label: string;
	condition: TitleCondition;
}

export interface Gear {
	slug: string;
	label: string;
	description: string;
	icon: string; // DevTermsIcon name (inline SVG), not a Tabler class
	slot: 'accessory' | 'badge' | 'item';
	condition: GearCondition;
}

// `complete-track-<slug>` uses the track slugs from content.ts.
export type TitleCondition = 'start' | `complete-track-${string}` | 'complete-all-tracks';
export type GearCondition = 'complete-level-1-any-track' | `complete-track-${string}` | 'complete-all-tracks';

export const TITLES: Title[] = [
	{ slug: 'embedded-designer', label: 'Embedded Designer', condition: 'start' },
	{ slug: 'git-literate', label: 'Git-Literate', condition: 'complete-track-git-flow' },
	{ slug: 'api-aware', label: 'API-Aware', condition: 'complete-track-api-literacy' },
	{ slug: 'always-on', label: 'Always-On', condition: 'complete-track-cloud-infra' },
	{ slug: 'ships-clean', label: 'Ships Clean', condition: 'complete-track-cicd' },
	{ slug: 'audit-ready', label: 'Audit-Ready', condition: 'complete-track-security' },
	{ slug: 'schema-whisperer', label: 'Schema Whisperer', condition: 'complete-track-data-dbs' },
	{ slug: 'staff-translator', label: 'Staff-Level Translator', condition: 'complete-all-tracks' },
];

export const GEAR: Gear[] = [
	{
		slug: 'field-notebook',
		label: 'Field Notebook',
		description: 'A worn notebook. Your glossary lives here.',
		icon: 'notebook',
		slot: 'accessory',
		condition: 'complete-level-1-any-track',
	},
	{
		slug: 'terminal-sticker',
		label: 'Terminal Sticker',
		description: "A `>_` sticker on your laptop. You've earned it.",
		icon: 'terminal',
		slot: 'badge',
		condition: 'complete-track-git-flow',
	},
	{
		slug: 'api-key-lanyard',
		label: 'API Key Lanyard',
		description: "It doesn't open anything real. But it looks the part.",
		icon: 'key',
		slot: 'badge',
		condition: 'complete-track-api-literacy',
	},
	{
		slug: 'on-call-pager',
		label: 'On-Call Pager',
		description: 'Hopefully it never goes off.',
		icon: 'device-mobile',
		slot: 'accessory',
		condition: 'complete-track-cloud-infra',
	},
	{
		slug: 'green-build-badge',
		label: 'Green Build Badge',
		description: 'All checks passed. Frame it.',
		icon: 'circle-check',
		slot: 'badge',
		condition: 'complete-track-cicd',
	},
	{
		slug: 'vault-key',
		label: 'Vault Key',
		description: "You know what's in the vault. And what shouldn't be.",
		icon: 'lock-open',
		slot: 'accessory',
		condition: 'complete-track-security',
	},
	{
		slug: 'architecture-map',
		label: 'Architecture Map',
		description: 'A full system diagram. You can read all of it now.',
		icon: 'map',
		slot: 'item',
		condition: 'complete-all-tracks',
	},
];

// Field Manual — 8-bit game configs (spec §8 / §6 GameConfig).
//
// One game per track. Slugs match the component filenames under
// components/devterms/games/. scoreLabel + instructions are surfaced in the
// game UI; the actual Canvas implementations land in later build steps
// (Git Runner first, step 10).

export interface GameConfig {
	slug: string;
	name: string;
	scoreLabel: string; // e.g. "commits landed"
	instructions: string; // one simple sentence
}

export const GAMES: Record<string, GameConfig> = {
	'git-flow': {
		slug: 'git-runner',
		name: 'Git Runner',
		scoreLabel: 'commits landed',
		instructions: 'Tap or press space to jump the merge-conflict blocks.',
	},
	'api-literacy': {
		slug: 'api-switchboard',
		name: 'API Switchboard',
		scoreLabel: 'successful responses',
		instructions: 'Route each dropping request left or right to the correct endpoint.',
	},
	'cloud-infra': {
		slug: 'infra-defense',
		name: 'Infra Defense',
		scoreLabel: 'uptime maintained',
		instructions: 'Place CDN nodes and load balancers to deflect traffic spikes.',
	},
	cicd: {
		slug: 'cicd-conveyor',
		name: 'CI/CD Conveyor',
		scoreLabel: 'clean deploys',
		instructions: 'Tap a buggy build to flag it before it ships.',
	},
	security: {
		slug: 'security-puzzle',
		name: 'Security Puzzle',
		scoreLabel: 'vulnerabilities patched',
		instructions: 'Tap the open locks to patch them before the timer runs out.',
	},
	'data-dbs': {
		slug: 'data-match',
		name: 'Data Match',
		scoreLabel: 'queries resolved',
		instructions: 'Match three data tiles to join the right tables.',
	},
};

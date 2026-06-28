// Dev Terms content data (spec §6 schema, §9 Git Flow content).
//
// Git Flow (Track 1) is fully authored: 3 levels with briefings, exchanges,
// decisions, and term definitions. Tracks 2–6 carry their metadata, game, and
// unlock-image, but their `levels` are stubbed (empty) until build step 11 —
// the routes still generate via `levelCount`, and the level page renders a
// placeholder when a level's content isn't authored yet.
//
// `highlightedTerms` only ever references slugs that exist in that level's
// `terms` array, so tap-to-define never points at an undefined term. (Spec §9
// L1 lists `main` as tappable, but it isn't one of Git Flow's 11 defined
// terms, so it's intentionally not highlighted.)

import { GAMES, type GameConfig } from './games';

export interface Term {
	slug: string;
	word: string;
	codeExample?: string; // omitted for concept-only terms (HEAD, pull request, …)
	definition: string; // plain English — must pass the dinner-table test
	designerContext: string;
}

export interface Exchange {
	speaker: string; // role archetype, e.g. "The Tech Lead"
	text: string;
	highlightedTerms: string[]; // term slugs appearing in this text, tappable
}

export interface DecisionOption {
	text: string;
	correct: boolean;
	consequence: string;
}

export interface Decision {
	prompt: string;
	options: DecisionOption[];
}

export interface Scenario {
	briefing: string;
	exchanges: Exchange[];
	decision: Decision;
}

export interface Level {
	number: number;
	title: string;
	scenario: Scenario;
	terms: Term[];
	xpReward: number;
}

export interface UnlockImage {
	description: string;
	segments: 3; // always 3 — one per level
	altText: string;
}

export interface Track {
	slug: string;
	name: string;
	color: string; // hex — icon bg, progress fill, term tags, page accent
	icon: string; // DevTermsIcon name (inline SVG), not a Tabler class
	tagline: string;
	missionTheme: string;
	terms: number; // total term count for the track
	levelCount: number; // routes generated per track (always 3)
	levels: Level[]; // authored content; empty until a track is populated
	game: GameConfig;
	unlockImage: UnlockImage;
}

// ---------------------------------------------------------------------------
// Track 1 — Git Flow (fully authored)
// ---------------------------------------------------------------------------

const gitFlowLevels: Level[] = [
	{
		number: 1,
		title: 'Foundations',
		xpReward: 15,
		scenario: {
			briefing:
				"Mission 1-A: Day one. You've been handed a Slack handle, a Figma invite, and a repo URL. The Tech Lead is online. The codebase is not going to clone itself.",
			exchanges: [
				{
					speaker: 'The Tech Lead',
					text: 'Welcome. Before you touch anything in Figma, grab the repo. Run `git clone` with the URL I just sent. That pulls the whole codebase to your machine — every file, every branch, the full history.',
					highlightedTerms: ['clone'],
				},
				{
					speaker: 'You',
					text: 'I open the terminal for the first time and run the command. A wall of text scrolls by. Something worked, I think.',
					highlightedTerms: [],
				},
				{
					speaker: 'The Tech Lead',
					text: "Good. Now — don't work on main. Create a `branch` off it. Think of main as the published version of a document. Your branch is your personal draft. Changes you make there don't touch the original until someone reviews and approves them.",
					highlightedTerms: ['branch'],
				},
				{
					speaker: 'You',
					text: 'I create a branch called redesign-tokens. It feels a little like duplicating a Figma page.',
					highlightedTerms: [],
				},
				{
					speaker: 'The Tech Lead',
					text: "Perfect. Now when you make a change — any change, even one line — you save it with a `commit`. A commit is a named snapshot. Write a short message describing what you changed. Future you will thank current you.",
					highlightedTerms: ['commit'],
				},
				{
					speaker: 'The Tech Lead',
					text: "One more thing. `HEAD` just means 'where you are right now.' It's like a cursor in the codebase. If you ever get disoriented about which branch you're on or what state the code is in — check HEAD.",
					highlightedTerms: ['head'],
				},
			],
			decision: {
				prompt: 'The Tech Lead asks: "You\'ve made your token changes. What do you do next?"',
				options: [
					{
						text: 'Commit directly to main',
						correct: false,
						consequence:
							"Main is shared. Editing it directly overwrites everyone's working state. Back up — create a branch first.",
					},
					{
						text: 'Commit to your branch with a descriptive message',
						correct: true,
						consequence:
							'Exactly. Your changes are saved, isolated, and labeled. The team can review them before anything hits main.',
					},
					{
						text: 'Ask the Tech Lead to commit for you',
						correct: false,
						consequence:
							"That's not how this works — and you're capable of this. The command is three words. Try it.",
					},
				],
			},
		},
		terms: [
			{
				slug: 'clone',
				word: 'clone',
				codeExample: 'git clone https://github.com/acme/design-tokens',
				definition:
					'Downloading the entire project — every file, every saved version, the full history — from the internet to your computer. Like downloading a Figma file, except it brings everything, not just the current state.',
				designerContext:
					"You'll clone a repo when you need to run something locally, test a design token change, or look at how components are actually structured in code — not just in Figma.",
			},
			{
				slug: 'branch',
				word: 'branch',
				codeExample: 'git checkout -b redesign-tokens',
				definition:
					"Your own private copy of the codebase to work in. Changes you make on a branch don't affect anyone else until you decide to merge them in. Think of it like duplicating a Figma page to try something out — the original is untouched.",
				designerContext:
					'Engineers will ask "what branch are you on?" when something looks broken in a local preview. Your branch name tells them which version of the code you\'re seeing.',
			},
			{
				slug: 'commit',
				word: 'commit',
				codeExample: 'git commit -m "update primary blue token"',
				definition:
					'A saved snapshot of your changes, with a short note explaining what you did. Not just a save — more like a labeled checkpoint you can always come back to. Like naming a version in Figma: "v3 — blue updated."',
				designerContext:
					'Good commit messages make design reviews easier. When a developer looks at the history of a file, clear messages tell the story of what changed and why.',
			},
			{
				slug: 'head',
				word: 'HEAD',
				definition:
					'A marker that shows where you currently are in the codebase. It points to your active branch and your most recent commit. If the codebase is a book, HEAD is the page you have open.',
				designerContext:
					'If a developer says "HEAD is detached," it means you\'re in a weird read-only state. It sounds alarming. It\'s fixable. Now you know what they mean.',
			},
		],
	},
	{
		number: 2,
		title: 'Sharing Work',
		xpReward: 20,
		scenario: {
			briefing:
				'Mission 1-B: Your token changes look right locally. Time to get them in front of the team. This is where the work stops being yours and starts being everyone\'s.',
			exchanges: [
				{
					speaker: 'The Tech Lead',
					text: 'Your commits are on your machine. Nobody can see them yet. Run `git push` to send your branch up to the shared repo. Think of it like uploading your Figma draft so the team can see the link.',
					highlightedTerms: ['push'],
				},
				{
					speaker: 'The On-Call Engineer',
					text: 'I pulled your branch to test it locally. Looks good on my end. When you\'re ready, open a pull request.',
					highlightedTerms: ['pull', 'pull-request'],
				},
				{
					speaker: 'The Tech Lead',
					text: 'A pull request — or PR — is a formal ask to merge your branch into main. It\'s not automatic. Someone reviews the changes, leaves comments, approves. Then it merges. That\'s how your token update goes from your draft to the live product.',
					highlightedTerms: ['merge', 'pull-request'],
				},
			],
			decision: {
				prompt: 'Your PR has been sitting open for two days with no reviews. What do you do?',
				options: [
					{
						text: 'Merge it yourself — it looks fine',
						correct: false,
						consequence:
							'PRs exist for a reason. Merging without review skips the safety net. One of those reviewers might have caught a conflict with another branch.',
					},
					{
						text: 'Ping the reviewer in chat and ask for a look',
						correct: true,
						consequence:
							"Perfect. PRs don't review themselves. A friendly nudge is standard practice — not pushy.",
					},
					{
						text: 'Close the PR and email the files instead',
						correct: false,
						consequence:
							'Email attachments for code changes creates a versioning nightmare. Keep it in the repo.',
					},
				],
			},
		},
		terms: [
			{
				slug: 'push',
				word: 'push',
				codeExample: 'git push origin redesign-tokens',
				definition:
					'Sending your local commits up to the shared repository online, so others can see and access your branch. Nothing you\'ve committed is visible to the team until you push.',
				designerContext:
					'"Did you push?" is something you\'ll hear when someone can\'t see your latest changes. Pushing is the act of making your work shareable.',
			},
			{
				slug: 'pull',
				word: 'pull',
				codeExample: 'git pull',
				definition:
					'Downloading the latest changes from the shared repository to your local machine. If someone else updated a file while you were working, pull brings those updates to you.',
				designerContext:
					'Before you start working each day, pulling keeps you from working against an outdated version of the codebase.',
			},
			{
				slug: 'pull-request',
				word: 'pull request (PR)',
				definition:
					"A formal request to merge your branch into main. It's a structured review — your changes are shown, teammates can comment line by line, and someone with authority approves before anything merges. It's the peer review of code.",
				designerContext:
					'Designers are increasingly included in PR reviews for design token changes, copy updates, or anything that affects what users see. Knowing what a PR is means you can participate in that conversation.',
			},
			{
				slug: 'merge',
				word: 'merge',
				codeExample: 'git merge redesign-tokens',
				definition:
					'Combining the changes from one branch into another. When a PR is approved, the merge happens — your draft becomes part of main. If two people changed the same line differently, you get a merge conflict (more on that in Level 3).',
				designerContext:
					'"It\'s merged" means the change is in. "It\'s in main" means the same thing. If something looks different in production than in your design, asking "did that PR merge?" is a completely valid question.',
			},
		],
	},
	{
		number: 3,
		title: 'Untangling',
		xpReward: 25,
		scenario: {
			briefing:
				'Mission 1-C: Two engineers worked on the same token file at the same time. Neither of them knew. Now the repo is flagging a conflict, and someone has to untangle it. That someone is on your team.',
			exchanges: [
				{
					speaker: 'The Tech Lead',
					text: 'We\'ve got a merge conflict on colors.json. Two branches updated the same line — one changed primary-blue to #0057FF, the other to #004EEB. Git doesn\'t know which one to keep. A human has to decide.',
					highlightedTerms: ['merge-conflict'],
				},
				{
					speaker: 'The On-Call Engineer',
					text: 'Also — I noticed your node_modules folder almost got committed. Make sure that\'s in the `.gitignore` file. That folder is massive and auto-generated — it should never live in the repo.',
					highlightedTerms: ['gitignore'],
				},
				{
					speaker: 'The Tech Lead',
					text: 'And if you ever commit something you didn\'t mean to — a wrong file, a broken change — `git revert` is your friend. It doesn\'t delete history. It creates a new commit that undoes the damage. Clean, traceable.',
					highlightedTerms: ['revert'],
				},
			],
			decision: {
				prompt: "You committed a font file (34MB) to the repo by mistake. It's already pushed. What do you do?",
				options: [
					{
						text: "Leave it — it's already there",
						correct: false,
						consequence:
							'Large binary files in repos bloat the history permanently. This needs to be undone.',
					},
					{
						text: 'Run git revert to undo the commit',
						correct: true,
						consequence:
							'Exactly right. Revert creates a clean undo without rewriting history. The file comes out, the record stays intact.',
					},
					{
						text: 'Delete the file manually and push again',
						correct: false,
						consequence:
							"Deleting the file locally and pushing doesn't remove it from the git history. The blob stays in the repo. Use revert.",
					},
				],
			},
		},
		terms: [
			{
				slug: 'merge-conflict',
				word: 'merge conflict',
				definition:
					'What happens when two people change the same part of the same file in different ways, and git can\'t figure out which version to keep. It\'s not an error — it\'s a flag that says "a human needs to decide this." Someone reads both versions and picks the right one.',
				designerContext:
					"Merge conflicts happen most often in shared files — design tokens, constants, config files. If you're updating tokens at the same time as an engineer, conflicts are likely. Knowing the term helps you follow the conversation when it happens.",
			},
			{
				slug: 'gitignore',
				word: '.gitignore',
				definition:
					'A file that tells git which files and folders to pretend don\'t exist. Anything listed in .gitignore will never be committed, no matter what. It keeps the repo clean of auto-generated files, secrets, and large assets that don\'t belong there.',
				designerContext:
					'If you\'re ever working with a local dev environment and someone says "make sure that\'s gitignored," they mean: add it to this file so it doesn\'t accidentally end up in the repo.',
			},
			{
				slug: 'revert',
				word: 'revert',
				codeExample: 'git revert a3f8c12',
				definition:
					'A safe undo. It creates a new commit that cancels out a previous one — without deleting anything from the history. Think of it like a tracked-changes undo in a Google Doc: the original is preserved, and the correction is logged.',
				designerContext:
					"Revert is the professional way to fix a mistake that's already been pushed. It's not embarrassing to use — it's what careful engineers do.",
			},
		],
	},
];

// ---------------------------------------------------------------------------
// Track 2 — API Literacy (fully authored)
// ---------------------------------------------------------------------------

const apiLiteracyLevels: Level[] = [
	{
		number: 1,
		title: "What's an API",
		xpReward: 15,
		scenario: {
			briefing:
				"Mission 2-A: The new pricing page shipped to staging looking perfect — except the prices are blank. Empty white space where numbers should be. The design is fine. Something underneath isn't talking to something else.",
			exchanges: [
				{
					speaker: 'The Backend Engineer',
					text: "The layout's right, the data's just not arriving. That page asks an `API` for the prices — an API is basically a waiter. Your page tells the waiter what it wants, the waiter goes to the kitchen, and brings the data back. Right now the waiter's coming back empty-handed.",
					highlightedTerms: ['api'],
				},
				{
					speaker: 'The Backend Engineer',
					text: "Every API has `endpoint`s — specific addresses you ask for specific things. The prices live at `/api/pricing`. Think of an endpoint like a single item on the waiter's menu. You don't ask for 'everything,' you ask for one thing by name.",
					highlightedTerms: ['endpoint'],
				},
				{
					speaker: 'You',
					text: "I open the network tab and watch the page load. There it is — a line that says `GET /api/pricing`. So it is asking. The asking is the part I didn't know had a name.",
					highlightedTerms: [],
				},
				{
					speaker: 'The Backend Engineer',
					text: "That line is the `request` — your page asking for something. What comes back is the `response`. The request went out fine. The response came back empty. So the problem's on our side, not the page's. Good — that means your design isn't broken.",
					highlightedTerms: ['request', 'response'],
				},
			],
			decision: {
				prompt: 'The Backend Engineer asks: "The prices are blank on staging. Where do you point first?"',
				options: [
					{
						text: 'Assume the design is broken and start redoing the layout',
						correct: false,
						consequence:
							"The layout rendered fine — it just had nothing to render. Tearing up good design work won't fill an empty response. Look at the data first.",
					},
					{
						text: 'Check whether the request got a real response',
						correct: true,
						consequence:
							"Exactly. An empty page with a working layout means the data didn't arrive. Checking the request/response tells you which side of the wall the problem is on.",
					},
					{
						text: "File it as a 'mystery bug' and move on",
						correct: false,
						consequence:
							"You're closer than you think. 'No data on the page' almost always means the request came back empty. That's a lead, not a mystery.",
					},
				],
			},
		},
		terms: [
			{
				slug: 'api',
				word: 'API',
				codeExample: 'GET https://api.acme.com/pricing',
				definition:
					'A messenger that lets two pieces of software talk to each other. One side asks for something, the API carries the request to wherever the answer lives, and brings the answer back. Like a waiter between you and the kitchen — you never go into the kitchen yourself.',
				designerContext:
					"When a screen shows live data — prices, user names, search results — that data almost always comes through an API. If it's blank or wrong, the API is usually where the trail starts, not your layout.",
			},
			{
				slug: 'endpoint',
				word: 'endpoint',
				codeExample: '/api/pricing',
				definition:
					'One specific address on an API for one specific thing. An API can have many endpoints — one for prices, one for users, one for orders. Like individual items on a menu, each with its own name.',
				designerContext:
					'When an engineer says "that data comes from the pricing endpoint," they\'re naming the exact source feeding your screen. Knowing the word lets you ask "which endpoint?" instead of "where does this come from?"',
			},
			{
				slug: 'request',
				word: 'request',
				codeExample: 'fetch("/api/pricing")',
				definition:
					"The act of a screen asking an API for something. Every piece of live data on a page started as a request that went out somewhere. It's the question, before the answer.",
				designerContext:
					"In a browser's network tab you can watch requests fire as a page loads. For a designer, this is how you confirm a screen is even trying to get the data it's missing.",
			},
			{
				slug: 'response',
				word: 'response',
				definition:
					'What an API sends back after a request. It might be the data you asked for, or a message saying something went wrong. The response is the answer to the question the request asked.',
				designerContext:
					'"The response came back empty" means the page asked correctly but got nothing useful. That tells you the problem is in the data, not your design — a distinction that saves hours.',
			},
		],
	},
	{
		number: 2,
		title: 'Reading the response',
		xpReward: 20,
		scenario: {
			briefing:
				'Mission 2-B: A contact form keeps failing. Users fill it out, hit submit, and get a vague red error. No one can reproduce it reliably. The answer is sitting in the response — you just have to learn to read it.',
			exchanges: [
				{
					speaker: 'The Backend Engineer',
					text: "Every response comes with a `status code` — a three-digit number that says how it went. 200 means success. 400-something means you sent something wrong. 500-something means the server broke. The form's coming back 401. That's not random — that's a specific story.",
					highlightedTerms: ['status-code'],
				},
				{
					speaker: 'The Backend Engineer',
					text: 'Open the response body. It\'s `JSON` — that format with the curly braces and key/value pairs. It\'s just structured text, organized so both humans and machines can read it. The JSON here says `{ "error": "missing token" }`. That\'s the actual reason.',
					highlightedTerms: ['json'],
				},
				{
					speaker: 'The On-Call Engineer',
					text: "A 401 with 'missing token' means `authentication` failed. The form tried to submit without proving who it was. Authentication is the login check — the 'are you allowed to do this' step. The form's knock on the door had no ID attached.",
					highlightedTerms: ['authentication'],
				},
				{
					speaker: 'You',
					text: "I look closer. The proof of identity is supposed to ride along in the request `headers` — the little envelope of info attached to every request. This one's envelope is empty. Now I can describe the bug precisely instead of saying 'it's broken.'",
					highlightedTerms: ['headers'],
				},
			],
			decision: {
				prompt: 'You found the form returns a 401 with "missing token." How do you write up the bug?',
				options: [
					{
						text: '"The form is broken, please fix"',
						correct: false,
						consequence:
							'Technically true, but it sends the engineer on the same hunt you just finished. You already know more than this — share it.',
					},
					{
						text: '"Submit returns 401 \'missing token\' — auth header looks empty"',
						correct: true,
						consequence:
							'That\'s a report an engineer can act on in minutes. You named the status code, the message, and the likely cause. This is what fluency buys you.',
					},
					{
						text: 'Keep testing to see if it fails every time',
						correct: false,
						consequence:
							'You already have a 401 and a clear error message in the response. More repro attempts won\'t tell you more than the response already did.',
					},
				],
			},
		},
		terms: [
			{
				slug: 'status-code',
				word: 'status code',
				codeExample: '200 OK · 401 Unauthorized · 500 Internal Server Error',
				definition:
					'A three-digit number every API response includes to say how things went. 200s mean success, 400s mean the request had a problem, 500s mean the server itself failed. A one-glance summary of the outcome.',
				designerContext:
					'When something on a screen fails, the status code tells you whose fault it is. A 404 (not found) versus a 403 (not allowed) versus a 500 (server broke) point to completely different fixes — and different error states you might need to design.',
			},
			{
				slug: 'json',
				word: 'JSON',
				codeExample: '{ "name": "Acme", "price": 49, "inStock": true }',
				definition:
					'A way of writing structured data as plain text, using labels and values inside curly braces. It\'s how most APIs send information back. Readable enough for a person, strict enough for a machine — like a very tidy bulleted list.',
				designerContext:
					"When you peek at the data behind a screen, it'll almost always be JSON. Being able to skim it lets you confirm whether a field you designed for actually exists in the data, or what it's really called.",
			},
			{
				slug: 'headers',
				word: 'headers',
				codeExample: 'Authorization: Bearer abc123',
				definition:
					'Extra information attached to a request or response that isn\'t the main content — things like who\'s asking, what format they want, and proof of identity. Like the envelope around a letter: not the message itself, but everything needed to deliver and verify it.',
				designerContext:
					'You usually won\'t touch headers directly, but when a request fails for "auth" or "permission" reasons, a missing or wrong header is often why. Knowing the word helps you follow the debugging conversation.',
			},
			{
				slug: 'authentication',
				word: 'authentication',
				definition:
					'The process of proving you are who you say you are before a system lets you in. The "are you logged in" check. Distinct from what you\'re allowed to do once inside — this is just the front-door ID check.',
				designerContext:
					'Auth states are design work — logged in, logged out, session expired, "please sign in again." Understanding what authentication is helps you design the moments when it succeeds, fails, or runs out.',
			},
		],
	},
	{
		number: 3,
		title: 'The full picture',
		xpReward: 25,
		scenario: {
			briefing:
				'Mission 2-C: Launch is in three days. The integration with the payments provider — the thing that actually charges customers — just started failing intermittently. Sometimes it works. Sometimes it returns nothing. Intermittent is the worst kind.',
			exchanges: [
				{
					speaker: 'The Backend Engineer',
					text: "Our payments integration follows `REST` — a common set of conventions for how APIs are organized. Predictable addresses, standard verbs like GET and POST. The good news: because it's REST, it behaves the way we expect. So a failure means something specific changed, not chaos.",
					highlightedTerms: ['rest'],
				},
				{
					speaker: 'The Backend Engineer',
					text: "Look at the logs — we're getting `429`s. That's a `rate limit`. The provider only allows so many requests per minute, and we're knocking too fast. They're not rejecting our data; they're telling us to slow down. Intermittent failure makes sense now — we fail only when we burst.",
					highlightedTerms: ['rate-limit'],
				},
				{
					speaker: 'The On-Call Engineer',
					text: "Separate thing to check: the provider sends us a `webhook` when a payment settles — they call us, instead of us asking them. If that webhook's `payload` — the actual data bundle in the message — changed shape, our confirmation screen could break even when the charge succeeded.",
					highlightedTerms: ['webhook', 'payload'],
				},
				{
					speaker: 'You',
					text: "So two different mechanisms, two different failure modes. The rate limit explains the intermittent drops. The webhook payload is worth checking for the confirmation screen. I'm not guessing anymore — I'm narrowing.",
					highlightedTerms: [],
				},
			],
			decision: {
				prompt: 'Payments fail only during high traffic and return a 429. What\'s the right read?',
				options: [
					{
						text: 'The payment provider is down',
						correct: false,
						consequence:
							"A 429 isn't 'down' — it's 'too fast.' The provider is up and answering; it's asking us to throttle. Different problem, different fix.",
					},
					{
						text: "We're hitting a rate limit during bursts",
						correct: true,
						consequence:
							"Right. 429 plus 'only under load' is a textbook rate limit. The fix is pacing our requests, not panicking about an outage.",
					},
					{
						text: 'Redesign the checkout flow',
						correct: false,
						consequence:
							"The flow's fine — it's being throttled by request volume, not a UX problem. Redesigning won't change how fast we hit the provider.",
					},
				],
			},
		},
		terms: [
			{
				slug: 'rest',
				word: 'REST',
				codeExample: 'GET /users/42 · POST /orders',
				definition:
					'A widely used set of conventions for how APIs are organized and named. It makes APIs predictable — addresses follow patterns, and a standard set of verbs (get, create, update, delete) does the work. Less a technology, more an agreed-upon style.',
				designerContext:
					'When an engineer says "it\'s a REST API," they mean it follows familiar rules. For you, that predictability means the data behind your screens is organized in consistent, learnable ways.',
			},
			{
				slug: 'webhook',
				word: 'webhook',
				codeExample: 'POST /webhooks/payment-settled',
				definition:
					'A reversal of the usual direction — instead of your app asking an API for updates, the other service automatically notifies your app the moment something happens. Like the difference between checking your mailbox repeatedly and getting a text when mail arrives.',
				designerContext:
					'Webhooks power "it just happened" moments — a payment clears, a file finishes processing, a status flips. If a confirmation or notification you designed feels delayed or missing, a webhook is often the thing behind it.',
			},
			{
				slug: 'rate-limit',
				word: 'rate limit',
				codeExample: '429 Too Many Requests',
				definition:
					'A cap on how many requests you\'re allowed to make in a given window of time. Go over it and the API politely refuses with a 429 until you slow down. It protects services from being overwhelmed — like a "one scoop per customer" rule.',
				designerContext:
					'Rate limits create real UX situations — "you\'re doing that too fast, try again in a minute." If a feature fails only under heavy use, a rate limit may be why, and you may need to design the slow-down gracefully.',
			},
			{
				slug: 'payload',
				word: 'payload',
				codeExample: '{ "orderId": 991, "status": "paid" }',
				definition:
					'The actual content carried inside a request or response — the meat of the message, as opposed to the addressing and envelope around it. When data is sent or received, the payload is the data part.',
				designerContext:
					'When an engineer says "the payload changed," the shape of the data your screen receives is different — a renamed field, a missing value. That can break a display even when nothing visually obvious failed.',
			},
		],
	},
];

// ---------------------------------------------------------------------------
// Tracks
// ---------------------------------------------------------------------------

export const TRACKS: Track[] = [
	{
		slug: 'git-flow',
		name: 'Git Flow',
		color: '#378ADD',
		icon: 'git-branch',
		tagline: 'Onboarding to the codebase on day one',
		missionTheme: 'Day one of a new sprint',
		terms: 11,
		levelCount: 3,
		levels: gitFlowLevels,
		game: GAMES['git-flow'],
		unlockImage: {
			description:
				'A Git branch diagram: main, a feature branch off it, a row of commits, and a merge back into main.',
			segments: 3,
			altText:
				'Git branch diagram showing a main line, a feature branch with commits, and a merge back into main.',
		},
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
		levels: apiLiteracyLevels,
		game: GAMES['api-literacy'],
		unlockImage: {
			description:
				'A request/response map — client → server → database → response — with status codes labeled.',
			segments: 3,
			altText: 'Diagram of a request flowing from client to server to database and back, with status codes.',
		},
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
		levels: [],
		game: GAMES['cloud-infra'],
		unlockImage: {
			description:
				'A cloud architecture diagram — CDN, load balancer, app servers, and database, layered bottom to top.',
			segments: 3,
			altText: 'Cloud architecture diagram with a CDN, load balancer, app servers, and a database.',
		},
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
		levels: [],
		game: GAMES['cicd'],
		unlockImage: {
			description: 'A pipeline flowchart — commit → build → test → deploy → monitor — in three stages.',
			segments: 3,
			altText: 'Pipeline flowchart from commit through build, test, deploy, and monitor.',
		},
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
		levels: [],
		game: GAMES['security'],
		unlockImage: {
			description:
				'A security audit checklist — authentication, encryption, access control, and logging — checking off as levels complete.',
			segments: 3,
			altText: 'Security audit checklist covering authentication, encryption, access control, and logging.',
		},
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
		levels: [],
		game: GAMES['data-dbs'],
		unlockImage: {
			description:
				'A database schema — tables, columns, primary keys, and foreign-key relationships — in three panels.',
			segments: 3,
			altText: 'Database schema diagram with tables, columns, primary keys, and foreign-key relationships.',
		},
	},
];

export function getTrack(slug: string): Track | undefined {
	return TRACKS.find((t) => t.slug === slug);
}

export function getLevel(trackSlug: string, levelNumber: number): Level | undefined {
	return getTrack(trackSlug)?.levels.find((l) => l.number === levelNumber);
}

/** Every authored term across all tracks (stubbed tracks contribute none yet). */
export function getAllTerms(): { trackSlug: string; term: Term }[] {
	return TRACKS.flatMap((t) => t.levels.flatMap((l) => l.terms.map((term) => ({ trackSlug: t.slug, term }))));
}

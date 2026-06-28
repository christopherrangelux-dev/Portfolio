// Field Manual content data (spec §6 schema, §9 Git Flow content).
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
// Track 3 — Cloud & Infrastructure (fully authored)
// ---------------------------------------------------------------------------

const cloudInfraLevels: Level[] = [
	{
		number: 1,
		title: 'Where does it live',
		xpReward: 15,
		scenario: {
			briefing:
				'Mission 3-A: Your redesign looks flawless on staging. You show it to a stakeholder on the real site — and a component is using last month\'s styling. "It works on my machine" is about to become a sentence you understand from the inside.',
			exchanges: [
				{
					speaker: 'The On-Call Engineer',
					text: "The site doesn't live on your laptop — it lives on a `server`, a computer somewhere that's always on, handing out the site to anyone who visits. Your machine has your local copy. The server has the copy the world sees. They're not automatically the same.",
					highlightedTerms: ['server'],
				},
				{
					speaker: 'The On-Call Engineer',
					text: "Renting space on those always-on computers is called `hosting`. We host the site with a provider so we don't run the machines ourselves. Think of it like renting a storefront instead of building one.",
					highlightedTerms: ['hosting'],
				},
				{
					speaker: 'The Tech Lead',
					text: 'Here\'s the key thing: we run multiple `environment`s — separate copies of the site for different purposes. Staging is the rehearsal space. Production is the live show the public sees. Your redesign is on staging. The stakeholder was looking at production. Same site, different stage.',
					highlightedTerms: ['environment'],
				},
				{
					speaker: 'You',
					text: "So nothing's broken — I was just showing the wrong copy. And the address bar difference I ignored? That's `DNS` doing its job, pointing each name at the right server.",
					highlightedTerms: ['dns'],
				},
			],
			decision: {
				prompt: 'Your work looks right on staging but old on the live site. What\'s happening?',
				options: [
					{
						text: 'Your changes got deleted',
						correct: false,
						consequence:
							"Nothing's lost. Your work is alive and well — on staging. It just hasn't moved to production yet.",
					},
					{
						text: 'Staging and production are different environments',
						correct: true,
						consequence:
							'Exactly. Staging is the rehearsal copy; production is live. Your change is real, it just hasn\'t been promoted to the environment the public sees.',
					},
					{
						text: 'The design itself is wrong',
						correct: false,
						consequence:
							"The design is fine on staging. You're comparing two different copies of the site, not finding a flaw in the work.",
					},
				],
			},
		},
		terms: [
			{
				slug: 'server',
				word: 'server',
				definition:
					"A computer that's always on, whose job is to hold a website or app and hand it out to anyone who asks. When you visit a site, a server somewhere sends it to your browser. Your own laptop is not the server — it's a visitor with a private draft.",
				designerContext:
					'"It works on my machine but not on the server" is one of the most common phrases in software. It means your local copy and the live copy differ — a gap that explains a lot of "but it looked fine when I made it" moments.',
			},
			{
				slug: 'hosting',
				word: 'hosting',
				definition:
					'Renting space on always-on servers so your site is available to the public around the clock. Instead of running your own computers, you pay a provider to keep your site online. Like renting a storefront rather than constructing the building yourself.',
				designerContext:
					'Where a site is hosted affects how fast it loads and how it gets updated. When someone says "I\'ll deploy it to our host," they mean putting the latest version onto those public servers.',
			},
			{
				slug: 'environment',
				word: 'environment',
				codeExample: 'staging.acme.com vs acme.com',
				definition:
					'A separate, complete copy of a site or app kept for a specific purpose. Common ones: development (where it\'s built), staging (where it\'s rehearsed and reviewed), and production (the live version real users see). Same software, different stages.',
				designerContext:
					'Knowing which environment you\'re looking at prevents the classic confusion of reviewing a change on the wrong copy. "Is that on staging or prod?" is a question that resolves a surprising number of "it looks wrong" reports.',
			},
			{
				slug: 'dns',
				word: 'DNS',
				codeExample: 'acme.com → 192.0.2.10',
				definition:
					'The internet\'s address book. It translates a human-friendly name like acme.com into the numeric address of the actual server. You type a name; DNS quietly looks up where that name lives and points you there.',
				designerContext:
					'You rarely touch DNS, but it explains why a brand-new domain "isn\'t working yet" (the address book hasn\'t updated everywhere) or why staging and production sit at different web addresses.',
			},
		],
	},
	{
		number: 2,
		title: 'Making it fast',
		xpReward: 20,
		scenario: {
			briefing:
				'Mission 3-B: The new marketing page takes eight seconds to load. Eight. Someone in analytics noticed the bounce rate, and now there\'s a thread. Your beautiful hero image is, it turns out, part of the problem.',
			exchanges: [
				{
					speaker: 'The On-Call Engineer',
					text: 'Part of the slowness is `latency` — the travel time for data to get from our server to a visitor. A user in Tokyo hitting a server in Virginia waits for every byte to cross the planet. Distance is time.',
					highlightedTerms: ['latency'],
				},
				{
					speaker: 'The On-Call Engineer',
					text: 'The fix is a `CDN` — a network of copies of your files spread across the world. Instead of everyone fetching that hero image from one server, they grab it from the nearest copy. Tokyo gets Tokyo\'s copy. That alone could cut seconds.',
					highlightedTerms: ['cdn'],
				},
				{
					speaker: 'The Tech Lead',
					text: 'The CDN also `cache`s — it keeps a ready-made copy so it doesn\'t rebuild the same thing for every visitor. And on our side, a `load balancer` spreads incoming traffic across several servers so no single one drowns when the page goes viral.',
					highlightedTerms: ['cache', 'load-balancer'],
				},
				{
					speaker: 'You',
					text: "So the page isn't 'badly designed' — it's being served the slow way. The hero image is fine once it's cached close to the user. Now I know the question to ask: is this on a CDN?",
					highlightedTerms: [],
				},
			],
			decision: {
				prompt: 'The marketing page loads slowly for overseas users. What\'s the most likely lever?',
				options: [
					{
						text: 'Make the design simpler',
						correct: false,
						consequence:
							"Simplifying might shave a little, but the core issue is distance and delivery, not visual complexity. Don't sacrifice the design for an infra problem.",
					},
					{
						text: 'Serve assets from a CDN closer to users',
						correct: true,
						consequence:
							'Right instinct. A CDN puts copies near each visitor, cutting the travel time that\'s making overseas loads crawl. This is an infrastructure fix, not a redesign.',
					},
					{
						text: 'Tell users to refresh',
						correct: false,
						consequence:
							"A refresh fetches the same slow assets from the same far server. The delivery path has to change, not the user's patience.",
					},
				],
			},
		},
		terms: [
			{
				slug: 'cdn',
				word: 'CDN',
				definition:
					"A worldwide network of servers that each keep a copy of your site's files, so visitors download from the location nearest them instead of one central place. Like a chain of local warehouses instead of shipping everything from one headquarters.",
				designerContext:
					'CDNs are why heavy assets — big images, fonts, video — can still load fast globally. If you\'re shipping large visuals, "put it on the CDN" is often the difference between snappy and sluggish.',
			},
			{
				slug: 'cache',
				word: 'cache',
				codeExample: 'Cache-Control: max-age=3600',
				definition:
					'A saved, ready-to-serve copy of something so it doesn\'t have to be created or fetched fresh every time. The first visit does the work; later visits get the stored copy instantly. Like keeping a frequently used file on your desk instead of the archive room.',
				designerContext:
					'Caching is why your updated design sometimes doesn\'t appear until a hard refresh — the browser or CDN is still serving a stored older copy. "Try clearing your cache" means you\'re seeing an old saved version, not that the change failed to deploy.',
			},
			{
				slug: 'load-balancer',
				word: 'load balancer',
				definition:
					'A traffic director that spreads incoming visitors across several servers so no single one gets overwhelmed. When a page suddenly gets popular, the load balancer shares the crowd. Like opening more checkout lanes as a store fills up.',
				designerContext:
					'Load balancers are why a site can survive a launch spike or a viral moment without falling over. You won\'t configure one, but it explains how "the site stayed up under huge traffic."',
			},
			{
				slug: 'latency',
				word: 'latency',
				definition:
					'The delay between asking for something and starting to get it — the travel and reaction time, separate from how big the thing is. Even a tiny file has latency if it\'s coming from far away. Distance, congestion, and detours all add to it.',
				designerContext:
					'Latency shapes how "instant" an interaction feels. A button that waits on a far-away server can feel laggy no matter how snappy your animation is — which is why loading and optimistic states matter in your designs.',
			},
		],
	},
	{
		number: 3,
		title: 'When it breaks',
		xpReward: 25,
		scenario: {
			briefing:
				'Mission 3-C: 2:14am. The site is down. The incident channel is a blur of messages. You got pulled in because the error page users are seeing is one you designed — and right now it\'s the only thing standing between the company and a totally blank screen.',
			exchanges: [
				{
					speaker: 'The On-Call Engineer',
					text: "We're in `downtime` — the site is unreachable for users. The clock matters; every minute counts. Right now your error page is doing real work, telling people we know and we're on it instead of showing a scary blank screen.",
					highlightedTerms: ['downtime'],
				},
				{
					speaker: 'The Tech Lead',
					text: "This is a formal `incident` — that's the word for an active outage we're coordinating a response to. There's a process: identify, mitigate, recover, then write up what happened. You're part of the response because the user-facing message is yours.",
					highlightedTerms: ['incident'],
				},
				{
					speaker: 'The On-Call Engineer',
					text: "We're reading the `logs` — the timestamped record of everything the system did right before it fell over. The logs show the primary database stopped responding. We're triggering `failover` — switching to a standby copy that takes over when the main one dies.",
					highlightedTerms: ['logs', 'failover'],
				},
				{
					speaker: 'You',
					text: 'Failover kicks in. The site flickers back. My error page did its job for eleven minutes — and now I\'m thinking about how to make it calmer and clearer for next time, because there\'s always a next time.',
					highlightedTerms: [],
				},
			],
			decision: {
				prompt: 'During the outage, what\'s the most useful thing your error page can do?',
				options: [
					{
						text: 'Show a funny meme to lighten the mood',
						correct: false,
						consequence:
							"Levity can backfire when someone's payment just failed. During downtime, people want acknowledgment and a sense it's being handled — not a joke.",
					},
					{
						text: "Clearly say something's wrong and it's being fixed",
						correct: true,
						consequence:
							'Exactly. A calm, honest message — "we\'re aware and working on it" — preserves trust during downtime far better than a blank screen or false cheer.',
					},
					{
						text: "Auto-refresh every second to 'fix' it",
						correct: false,
						consequence:
							'Hammering a downed server with refreshes doesn\'t help it recover and can make things worse. A clear status beats a frantic reload loop.',
					},
				],
			},
		},
		terms: [
			{
				slug: 'downtime',
				word: 'downtime',
				definition:
					'Any stretch of time when a site or service isn\'t working for users. It might be fully down or badly degraded. The opposite of uptime, and the thing every team works to minimize. Measured in minutes that feel like hours.',
				designerContext:
					'Downtime is when your error states, status pages, and fallback designs earn their keep. The screens you design for "when things break" are invisible until the worst moment — then they\'re everything.',
			},
			{
				slug: 'failover',
				word: 'failover',
				definition:
					'Automatically switching to a backup system when the main one fails, so service continues with minimal interruption. Like a generator kicking in the instant the power cuts. The user ideally never notices the handoff.',
				designerContext:
					'Failover is why a site can wobble for a moment and recover instead of staying dead. It explains the brief "blip" users sometimes see — a momentary error before things snap back to normal.',
			},
			{
				slug: 'logs',
				word: 'logs',
				codeExample: '[02:11:04] ERROR db connection timeout',
				definition:
					'A timestamped, running record of what a system did — every notable action, warning, and error, in order. When something breaks, the logs are the security-camera footage you rewind to see what happened just before.',
				designerContext:
					'"What do the logs say?" is the first question in most outages. You won\'t read raw logs daily, but knowing they exist helps you understand how teams pinpoint when and where something went wrong.',
			},
			{
				slug: 'incident',
				word: 'incident',
				definition:
					'An unplanned disruption serious enough to warrant a coordinated response. Teams declare an incident, assign roles, fix it, then write a "what happened and why" review afterward. The formal, structured version of "something\'s on fire."',
				designerContext:
					'Incidents often produce action items that touch design — better error messaging, a status page, clearer alerts. Understanding the incident process helps you contribute the user-facing pieces of the response.',
			},
		],
	},
];

// ---------------------------------------------------------------------------
// Track 4 — CI/CD & Dev Process (fully authored)
// ---------------------------------------------------------------------------

const cicdLevels: Level[] = [
	{
		number: 1,
		title: 'The pipeline',
		xpReward: 15,
		scenario: {
			briefing:
				'Mission 4-A: You pushed a small token change and opened your PR like a pro. Now there\'s a red X next to it and a message: "Pipeline failed." You didn\'t even know there was a pipeline. Apparently your change is blocking a release.',
			exchanges: [
				{
					speaker: 'The Tech Lead',
					text: "When you push, an automated `pipeline` runs — a series of steps the code goes through before it's allowed to ship. Build it, test it, check it. Think of it like a factory line with quality checkpoints. Your change hit a checkpoint and stopped.",
					highlightedTerms: ['pipeline'],
				},
				{
					speaker: 'The Tech Lead',
					text: "The first step is the `build` — assembling all the code into the final, runnable version of the site. Your token file had a stray comma, so the build couldn't assemble. That's all 'pipeline failed' means here: it choked at the build step.",
					highlightedTerms: ['build'],
				},
				{
					speaker: 'The On-Call Engineer',
					text: "This whole setup is `CI` — Continuous Integration. Every change gets automatically built and checked the moment it's pushed, so problems surface in minutes instead of weeks later. It's not punishing you; it caught a typo before users ever saw it.",
					highlightedTerms: ['ci'],
				},
				{
					speaker: 'You',
					text: 'I fix the comma, push again. The pipeline reruns on its own, turns green, and the path to release reopens. And `CD` — the part that takes a green build and ships it automatically — does the rest.',
					highlightedTerms: ['cd'],
				},
			],
			decision: {
				prompt: 'Your PR shows "pipeline failed" at the build step. What do you do?',
				options: [
					{
						text: 'Merge anyway — it\'s just a warning',
						correct: false,
						consequence:
							"A failed build isn't a warning, it's a stop sign. Merging broken code can take down the whole release for everyone. The red X is protecting the team.",
					},
					{
						text: 'Read the build error and fix what it points to',
						correct: true,
						consequence:
							'Exactly. The pipeline tells you where it failed — usually a specific file and line. Fixing that and re-pushing reruns the checks automatically.',
					},
					{
						text: 'Ask someone else to merge it for you',
						correct: false,
						consequence:
							'Handing off a red pipeline just moves the same broken build to someone else. The error is readable and the fix is yours — start with what it says.',
					},
				],
			},
		},
		terms: [
			{
				slug: 'ci',
				word: 'CI',
				definition:
					'The practice of automatically building and checking code every time someone changes it, so problems are caught immediately instead of piling up. Each change gets vetted on arrival, like a spell-checker that runs the instant you finish a sentence.',
				designerContext:
					'CI is why a tiny mistake in a shared file gets flagged within minutes. When your design token or copy change "fails CI," it means an automatic check caught something before it reached users.',
			},
			{
				slug: 'cd',
				word: 'CD',
				definition:
					'The automated step that takes code which has passed all checks and releases it — to staging, or all the way to production — without someone manually pushing it out. The second half of the assembly line: once it passes inspection, it ships itself.',
				designerContext:
					'CD is why an approved change can go live within minutes of merging, no manual upload required. It explains how "I merged it and it was live almost instantly" actually happens.',
			},
			{
				slug: 'build',
				word: 'build',
				codeExample: 'npm run build',
				definition:
					"Assembling all the separate source files into the final, optimized version that actually runs. The raw ingredients get cooked into the finished dish. If anything's malformed, the build fails before it produces anything.",
				designerContext:
					'"The build is broken" means the site can\'t even be assembled, so nothing can ship — including your changes. A broken build blocks everyone, which is why a stray typo in a shared file gets urgent attention fast.',
			},
			{
				slug: 'pipeline',
				word: 'pipeline',
				definition:
					'The ordered series of automated steps code passes through from "just changed" to "live," each one a checkpoint that can pass or fail. Like a factory line with inspection stations — clear one to reach the next.',
				designerContext:
					'When your PR runs a pipeline, you can see exactly which stage passed or failed. That visibility lets you tell the difference between "my code is wrong" and "an unrelated test is flaky" without guessing.',
			},
		],
	},
	{
		number: 2,
		title: 'Shipping safely',
		xpReward: 20,
		scenario: {
			briefing:
				'Mission 4-B: A half-finished feature — one you\'re still designing — just appeared on the live site. Real users can see it. It\'s not ready. The question in the channel is calm but pointed: "how is this live?"',
			exchanges: [
				{
					speaker: 'The Tech Lead',
					text: 'Unfinished work should sit behind a `feature flag` — a switch that hides a feature from users until you flip it on. The code can ship to production while the feature stays invisible. Someone flipped this one early, or it never got wrapped in a flag at all.',
					highlightedTerms: ['feature-flag'],
				},
				{
					speaker: 'The On-Call Engineer',
					text: "When code goes to production, that's a `deploy` — the act of releasing a version to a live environment. The feature got deployed with the flag accidentally on. The deploy itself worked fine; the visibility switch was the problem.",
					highlightedTerms: ['deploy'],
				},
				{
					speaker: 'The Tech Lead',
					text: "Quickest fix: flip the flag off. If that weren't possible, we'd `rollback` — return to the previous known-good version, like an undo for the whole site. And the flag's default state is set by an `environment variable`, a setting that lives outside the code and differs per environment.",
					highlightedTerms: ['rollback', 'environment-variable'],
				},
				{
					speaker: 'You',
					text: "Flag off. The feature vanishes from production, still safe and intact in our work. No rollback needed. I'm realizing feature flags are a design tool too — they're how you'd run a gradual rollout.",
					highlightedTerms: [],
				},
			],
			decision: {
				prompt: 'A not-yet-ready feature is visible in production. Fastest safe fix?',
				options: [
					{
						text: "Delete the feature's code immediately",
						correct: false,
						consequence:
							'Ripping out code under pressure risks breaking things around it. If a flag exists, switching it off is faster and far safer than deleting work.',
					},
					{
						text: 'Turn off its feature flag',
						correct: true,
						consequence:
							'Exactly. A flag flip hides the feature instantly without touching code or losing progress. This is precisely what flags are for.',
					},
					{
						text: "Leave it up and add a 'beta' label",
						correct: false,
						consequence:
							"Slapping 'beta' on unfinished work doesn't make it ready — it just ships a rough experience to everyone. Hide it first, polish it next.",
					},
				],
			},
		},
		terms: [
			{
				slug: 'feature-flag',
				word: 'feature flag',
				codeExample: 'if (flags.newCheckout) { ... }',
				definition:
					"A switch that turns a feature on or off without changing the code that's already shipped. The feature can be live in the codebase but hidden from users until you flip it on — for everyone, or just a chosen few. A dimmer switch for functionality.",
				designerContext:
					'Feature flags are a design superpower: they enable gradual rollouts, A/B tests, and "show this to 5% of users first." If you\'re planning a phased launch, flags are the mechanism that makes it possible.',
			},
			{
				slug: 'deploy',
				word: 'deploy',
				definition:
					'The act of pushing a version of the code out to a running environment so it actually takes effect — most importantly to production, where users meet it. Building is cooking the dish; deploying is serving it to the table.',
				designerContext:
					'"When\'s the next deploy?" tells you when your merged change will actually reach users. Merged and deployed aren\'t the same — work can be approved and waiting for the next release window.',
			},
			{
				slug: 'rollback',
				word: 'rollback',
				definition:
					'Returning a live site to its previous working version after a bad release — a fast, whole-system undo. Instead of fixing the new problem under pressure, you restore the last version everyone knows was fine.',
				designerContext:
					'Rollback is the safety net behind shipping fast. It\'s why teams can take risks on a release — if something\'s badly wrong, they can revert in moments. It also means a fix you saw live might briefly disappear if a deploy gets rolled back.',
			},
			{
				slug: 'environment-variable',
				word: 'environment variable',
				codeExample: 'STRIPE_KEY=sk_live_...',
				definition:
					'A setting that lives outside the code and can differ per environment — staging versus production, for example. The same code reads these values to behave correctly in each place. Like the same appliance plugged into different outlets with different voltages.',
				designerContext:
					'Environment variables explain why staging can point at test data while production points at the real thing, using identical code. When something behaves differently across environments with no visible code change, a differing variable is often why.',
			},
		],
	},
	{
		number: 3,
		title: 'The culture',
		xpReward: 25,
		scenario: {
			briefing:
				'Mission 4-C: Your one-line color token change came back with a wall of red: "47 tests failing." Forty-seven. From one line. Before you panic, the Tech Lead drops a calming message: this is exactly what the system is supposed to do.',
			exchanges: [
				{
					speaker: 'The Tech Lead',
					text: "Don't panic. Those 47 `test`s are automated checks that confirm parts of the app still behave correctly. Your color change touched a token that 47 components rely on, so 47 checks re-ran. Most are probably just expecting the old value. The system is working, not screaming.",
					highlightedTerms: ['test'],
				},
				{
					speaker: 'The On-Call Engineer',
					text: "The fact that 47 tests even cover that token is good `coverage` — a measure of how much of the code has tests watching it. High coverage means changes can't quietly break things. You're getting loud feedback precisely because this area is well protected.",
					highlightedTerms: ['coverage'],
				},
				{
					speaker: 'The Tech Lead',
					text: 'Also — `linting` flagged a formatting nit in your file. Linting is an automatic style-and-consistency checker. Harmless, just tidy it. And once green, your change goes through `code review`: a teammate reads it, comments, approves. That\'s the human checkpoint on top of the automated ones.',
					highlightedTerms: ['linting', 'code-review'],
				},
			],
			decision: {
				prompt: 'Your token change fails 47 tests that expected the old color value. What\'s the right next step?',
				options: [
					{
						text: 'Force the change through and ignore the tests',
						correct: false,
						consequence:
							"Bypassing 47 failing tests ships 47 unverified behaviors. The tests aren't obstacles — they're telling you exactly what your change affects.",
					},
					{
						text: 'Update the tests to expect the new value, with review',
						correct: true,
						consequence:
							'Right. If the new color is correct, the tests should be updated to match it — then reviewed so a human confirms the change was intentional, not accidental.',
					},
					{
						text: 'Revert and never touch tokens again',
						correct: false,
						consequence:
							'Understandable instinct, but unnecessary — this is normal, healthy feedback, not danger. Backing away from tokens entirely cedes work you\'re capable of. Update the expectations and move on.',
					},
				],
			},
		},
		terms: [
			{
				slug: 'code-review',
				word: 'code review',
				definition:
					'The step where another person reads your proposed change, asks questions, suggests improvements, and approves before it merges. The human quality check that sits alongside the automated ones. Peer review, for code.',
				designerContext:
					'Designers increasingly take part in code reviews for token, copy, and UI changes. Knowing what a review is — and that comments are normal, not criticism — lets you participate confidently instead of feeling audited.',
			},
			{
				slug: 'linting',
				word: 'linting',
				codeExample: 'eslint src/',
				definition:
					'An automatic checker for style and consistency — formatting, naming, small mistakes — separate from whether the code works. It keeps a codebase looking uniform no matter how many people touch it. Like a grammar checker for code.',
				designerContext:
					'Linting is the engineering cousin of a design system\'s rules — automated consistency enforcement. A "lint error" on your change is usually a quick formatting fix, not a sign anything\'s actually broken.',
			},
			{
				slug: 'test',
				word: 'test',
				codeExample: 'expect(button.color).toBe(token.primary)',
				definition:
					'An automated check that confirms a specific piece of the app behaves the way it\'s supposed to. Run them all and you quickly learn whether a change broke anything. Like a checklist that re-verifies itself every time the work changes.',
				designerContext:
					'When a change "breaks tests," it means an automatic check noticed different behavior. That\'s often good — it surfaces ripple effects of your change instantly, like discovering one token touches 47 components.',
			},
			{
				slug: 'coverage',
				word: 'coverage',
				codeExample: 'Coverage: 84% of statements',
				definition:
					'A measure of how much of the code is watched by tests. High coverage means most changes will trip a test if they break something; low coverage means problems can slip through unnoticed. A gauge of how well-guarded the code is.',
				designerContext:
					'Coverage explains why some changes get loud, immediate feedback and others sail through silently. Well-covered areas catch your mistakes early — a feature, not a frustration.',
			},
		],
	},
];

// ---------------------------------------------------------------------------
// Track 5 — Security & Compliance (spec §10)
// ---------------------------------------------------------------------------

const securityLevels: Level[] = [
	{
		number: 1,
		title: 'The basics',
		xpReward: 15,
		scenario: {
			briefing:
				'Mission 5-A: A security auditor is poking at the site and pings the team: "Why is this page served over HTTP?" There\'s a small lock icon missing from the address bar on one page — and that tiny missing lock is apparently a real problem.',
			exchanges: [
				{
					speaker: 'The Security Engineer',
					text: "That page loads over plain `HTTP` instead of `HTTPS`. The 'S' means the connection is encrypted — scrambled so no one in between can read it. Without it, anything typed on that page travels in the open, readable by anyone snooping the network.",
					highlightedTerms: ['https', 'encryption'],
				},
				{
					speaker: 'The Security Engineer',
					text: 'The scrambling itself is `encryption` — turning readable data into nonsense that only the right key can unlock. HTTPS encrypts the conversation between the browser and the server. The missing lock icon means this one page isn\'t doing that.',
					highlightedTerms: ['encryption'],
				},
				{
					speaker: 'The Tech Lead',
					text: "Two more words you'll hear constantly, and people mix them up: `authentication` is proving *who you are* — logging in. `authorization` is what you're *allowed to do* once you're in. Auth-n is the ID check at the door; auth-z is which rooms your badge opens.",
					highlightedTerms: ['authentication', 'authorization'],
				},
				{
					speaker: 'You',
					text: 'So the fix is forcing HTTPS on that page. And the auth distinction finally clicks — the "you\'re logged in but can\'t access this" state I keep designing is authorization, not authentication. Different screen, different message.',
					highlightedTerms: [],
				},
			],
			decision: {
				prompt: 'A page that collects user info is served over HTTP, not HTTPS. How serious is this?',
				options: [
					{
						text: "Minor — it's just a missing icon",
						correct: false,
						consequence:
							'The icon is the visible symptom; the real issue is that user data on that page is unencrypted in transit. That\'s a genuine security gap, not cosmetics.',
					},
					{
						text: 'Serious — user data is unencrypted in transit',
						correct: true,
						consequence:
							'Exactly. Without HTTPS, anything entered on that page can be read by anyone between the user and the server. This is a real fix, prioritized accordingly.',
					},
					{
						text: 'Not your concern as a designer',
						correct: false,
						consequence:
							'Security touches UX directly — trust signals, the lock icon, "your connection is secure" messaging. Understanding it makes you a better partner, not a bystander.',
					},
				],
			},
		},
		terms: [
			{
				slug: 'authentication',
				word: 'authentication',
				codeExample: '(login that proves identity — "authn")',
				definition:
					'Proving you are who you claim to be, usually by logging in. The front-door ID check before a system trusts you at all. Distinct from what you\'re then permitted to do.',
				designerContext:
					'Every login, signup, password reset, and "session expired, sign in again" flow is authentication design. Knowing the term — and that it\'s separate from permissions — sharpens how you design the "who are you" moments.',
			},
			{
				slug: 'authorization',
				word: 'authorization',
				codeExample: '(permission check — "authz")',
				definition:
					'Deciding what an already-identified user is allowed to do or see. You can be authenticated (logged in) but not authorized (not permitted) for a specific action. The ID check gets you in the building; authorization decides which doors open.',
				designerContext:
					'"You don\'t have access to this" states are authorization design. Mixing it up with authentication leads to confusing messages — telling someone to log in when they\'re already logged in and simply lack permission.',
			},
			{
				slug: 'https',
				word: 'HTTPS',
				codeExample: 'https://acme.com',
				definition:
					'The secure version of the web\'s basic protocol. The "S" means the connection between browser and server is encrypted, so data can\'t be read or tampered with along the way. The little lock icon in the address bar is its visible badge.',
				designerContext:
					'HTTPS is a baseline trust signal users have learned to look for. A missing lock or a "not secure" warning actively undermines confidence — which is why every page handling real data needs it.',
			},
			{
				slug: 'encryption',
				word: 'encryption',
				codeExample: '(scrambling data so only a key can read it)',
				definition:
					'Turning readable information into scrambled nonsense that only someone with the right key can turn back. It protects data both while it travels and while it\'s stored. Like writing in a cipher only the intended reader can decode.',
				designerContext:
					'Encryption underpins the "your data is safe" promises in your UI. Understanding it lets you design honest security messaging — and know when phrases like "end-to-end encrypted" are accurate versus marketing.',
			},
		],
	},
	{
		number: 2,
		title: 'The data',
		xpReward: 20,
		scenario: {
			briefing:
				'Mission 5-B: A user just typed their Social Security number into a field you labeled "Order number." They misread it under stress. Now there\'s sensitive personal data sitting somewhere it was never meant to be, and the team has to deal with it carefully.',
			exchanges: [
				{
					speaker: 'The Security Engineer',
					text: 'An SSN is `PII` — Personally Identifiable Information. Data that can identify a real person: names, emails, government IDs, addresses. It\'s handled under stricter rules than ordinary data because a leak can genuinely harm someone.',
					highlightedTerms: ['pii', 'data-retention'],
				},
				{
					speaker: 'The Security Engineer',
					text: 'Now we apply our `data retention` policy — the rules for how long we keep different kinds of data and when we delete it. PII that landed somewhere it shouldn\'t gets purged, not archived. The goal is to hold sensitive data for the shortest time we legitimately need it.',
					highlightedTerms: ['data-retention'],
				},
				{
					speaker: 'The Tech Lead',
					text: 'This is also a `vulnerability` worth fixing — a weakness someone could exploit, here a field that invites the wrong data. We design under `zero trust`: assume no request is automatically safe, verify everything. A clearer label and validation on that field closes the gap.',
					highlightedTerms: ['vulnerability', 'zero-trust'],
				},
				{
					speaker: 'You',
					text: 'So a confusing label became a security problem. That reframes input design entirely — the label, the format hint, the validation aren\'t just UX polish, they\'re the first line of defense. I can prevent this category of mistake.',
					highlightedTerms: [],
				},
			],
			decision: {
				prompt: 'A confusing field caused users to enter sensitive data in the wrong place. Whose problem is it?',
				options: [
					{
						text: 'Purely an engineering/security issue',
						correct: false,
						consequence:
							'The root cause was a misleading label — a design decision. Security cleans up the data, but preventing the next occurrence is squarely design work.',
					},
					{
						text: 'A design problem with security consequences',
						correct: true,
						consequence:
							'Exactly. Clear labels, format hints, and validation are how design prevents users from putting sensitive data where it doesn\'t belong. This is your lever.',
					},
					{
						text: 'The user\'s fault for misreading',
						correct: false,
						consequence:
							'Tempting, but "blame the user" fixes nothing — they were stressed and misled. If the label invited the mistake, the design owns preventing the next one.',
					},
				],
			},
		},
		terms: [
			{
				slug: 'pii',
				word: 'PII',
				codeExample: '(name, email, SSN, address — Personally Identifiable Information)',
				definition:
					'Any data that can identify a specific real person — names, emails, phone numbers, government IDs, home addresses. It\'s governed by stricter handling and legal rules than ordinary data because exposing it can harm real people.',
				designerContext:
					'Whenever a form collects PII, you\'re designing something with legal and ethical weight. Knowing what counts as PII helps you design appropriate consent, clarity, and "why we need this" reassurance.',
			},
			{
				slug: 'data-retention',
				word: 'data retention',
				codeExample: '(policy: "delete logs after 90 days")',
				definition:
					'The rules for how long different kinds of data are kept and when they\'re deleted. Good practice is to keep sensitive data only as long as genuinely needed, then remove it. Less "store everything forever," more "hold only what\'s necessary, only as long as necessary."',
				designerContext:
					'Retention shapes features like "download your data" and "delete my account." Understanding it helps you design honest, compliant flows around what happens to a user\'s information over time.',
			},
			{
				slug: 'zero-trust',
				word: 'zero trust',
				codeExample: '(verify every request, trust none by default)',
				definition:
					'A security approach that assumes no request or user is automatically safe — even from inside the network — and verifies everything every time. The opposite of "you\'re in the building, so you must be fine." Trust is earned per action, not granted by location.',
				designerContext:
					'Zero trust can mean more frequent verification in the UI — re-confirming identity for sensitive actions, step-up auth. Knowing the principle helps you design those checks as reassurance rather than friction.',
			},
			{
				slug: 'vulnerability',
				word: 'vulnerability',
				codeExample: '(an exploitable weakness, e.g. an unvalidated input)',
				definition:
					'A weakness in a system that someone could exploit to cause harm — steal data, break something, get unauthorized access. Found and fixed before bad actors find them, ideally. A gap in the fence, located before anyone climbs through. (Often shortened to "vuln" in conversation.)',
				designerContext:
					'Some vulnerabilities start as design gaps — a confusing field, a missing confirmation, an oversharing default. Recognizing that helps you see when a design choice is also a security choice.',
			},
		],
	},
	{
		number: 3,
		title: 'The audit',
		xpReward: 25,
		scenario: {
			briefing:
				'Mission 5-C: The audit report landed. There are findings — not catastrophic, but real, and each one needs an owner and a fix. A few of them, it turns out, point at screens you designed.',
			exchanges: [
				{
					speaker: 'The Security Engineer',
					text: 'Some findings came from `penetration testing` — hired experts who try to break in on purpose, with permission, to find holes before real attackers do. They probe like an adversary so we can patch what they find. Think of it as a fire drill for break-ins.',
					highlightedTerms: ['penetration-testing', 'compliance'],
				},
				{
					speaker: 'The Tech Lead',
					text: 'The whole audit exists for `compliance` — meeting the formal security and privacy standards our industry or customers require. Passing isn\'t optional; contracts and regulations depend on it. The findings are the gap between where we are and what the standard demands.',
					highlightedTerms: ['compliance'],
				},
				{
					speaker: 'The Security Engineer',
					text: 'Two findings are yours-adjacent: `access control` — making sure people can only reach what they\'re permitted to — was too loose on one admin screen. And the `audit log`, the tamper-evident record of who did what and when, wasn\'t surfaced clearly in the UI for reviewers.',
					highlightedTerms: ['access-control', 'audit-log'],
				},
				{
					speaker: 'You',
					text: 'So "who can see this" and "show the history of what happened" are design responsibilities with compliance teeth. The admin screen needs clearer permission states, and the audit log needs to be actually legible. Real, fixable, mine.',
					highlightedTerms: [],
				},
			],
			decision: {
				prompt: 'An audit finding says an admin screen lets the wrong roles see sensitive controls. What\'s the design role here?',
				options: [
					{
						text: 'None — access control is backend only',
						correct: false,
						consequence:
							'Enforcement is backend, but *what each role sees* is interface design. Hiding or disabling controls by permission is a design decision with compliance impact.',
					},
					{
						text: 'Design clear permission-based states for the screen',
						correct: true,
						consequence:
							'Exactly. Showing the right controls to the right roles — and clearly — is design work. Good permission states make access control legible and auditable.',
					},
					{
						text: 'Hide the whole screen from everyone',
						correct: false,
						consequence:
							'Hiding it from everyone blocks the people who legitimately need it. The goal is the *right* access, not no access — that\'s what "access control" means.',
					},
				],
			},
		},
		terms: [
			{
				slug: 'penetration-testing',
				word: 'penetration testing',
				codeExample: '(authorized simulated attack — "pen test")',
				definition:
					'Hiring skilled people to attack your own system on purpose, with permission, to find security holes before real attackers do. They think like an adversary so the weaknesses get patched first. A controlled break-in, run by the good guys.',
				designerContext:
					'Pen test findings often include UX-adjacent issues — exposed controls, weak confirmations, oversharing. Knowing the term helps you understand where some security-driven design changes originate.',
			},
			{
				slug: 'compliance',
				word: 'compliance',
				codeExample: '(meeting standards like SOC 2, GDPR, HIPAA)',
				definition:
					'Meeting the formal security and privacy rules your industry, customers, or laws require. It\'s often a prerequisite to selling to certain clients or operating in certain markets. The documented proof that you handle data responsibly.',
				designerContext:
					'Compliance drives real UI requirements — consent banners, data-export tools, audit trails, specific disclosures. Understanding it helps you see why certain "boring" screens are non-negotiable rather than optional polish.',
			},
			{
				slug: 'access-control',
				word: 'access control',
				codeExample: '(role-based permissions: who can do what)',
				definition:
					'The system of deciding who is allowed to see or do what, and enforcing it. It keeps sensitive actions and data limited to the right people. The set of rules behind "you have permission" and "you don\'t."',
				designerContext:
					'Access control is interface design as much as backend logic — which controls appear, which are disabled, what an under-permissioned user sees. Designing these states clearly is how access control becomes usable instead of confusing.',
			},
			{
				slug: 'audit-log',
				word: 'audit log',
				codeExample: '[2026-06-27 14:03] user:42 changed role of user:88',
				definition:
					'A secure, tamper-evident record of who did what and when within a system — especially sensitive actions. When something needs accounting for, the audit log is the authoritative history. A logbook you can\'t quietly edit.',
				designerContext:
					'Audit logs frequently need a human-readable interface — for admins, reviewers, or auditors. Designing that history to be scannable and trustworthy is real, compliance-relevant design work.',
			},
		],
	},
];

// ---------------------------------------------------------------------------
// Track 6 — Data & Databases (spec §10)
// ---------------------------------------------------------------------------

const dataDbsLevels: Level[] = [
	{
		number: 1,
		title: 'The structure',
		xpReward: 15,
		scenario: {
			briefing:
				'Mission 6-A: You designed a slick new "team workspace" feature. Engineering\'s first question isn\'t about the visuals — it\'s "what\'s the data model?" You nod like you understand. You\'re about to actually understand.',
			exchanges: [
				{
					speaker: 'The Data Engineer',
					text: 'Everything your feature shows has to be stored somewhere — that\'s the `database`. It\'s the organized warehouse where all the app\'s information lives: users, workspaces, settings, everything. Your screens are windows into it.',
					highlightedTerms: ['database', 'schema'],
				},
				{
					speaker: 'The Data Engineer',
					text: 'Inside the database, data is organized into `table`s — think spreadsheets, one per type of thing. A `users` table, a `workspaces` table. Each table holds many rows, and each row is one record: one user, one workspace.',
					highlightedTerms: ['table'],
				},
				{
					speaker: 'The Tech Lead',
					text: 'The `schema` is the blueprint — what tables exist, what `field`s (columns) each one has, and how they connect. A field is a single piece of info: a user\'s email, a workspace\'s name. When we ask "what\'s the data model," we\'re asking you to help define this blueprint.',
					highlightedTerms: ['schema', 'field'],
				},
				{
					speaker: 'You',
					text: 'So my "workspace" needs a table, with fields: name, owner, members, created date. I\'m basically designing a structured form that maps to columns. This is just information architecture wearing a database costume.',
					highlightedTerms: [],
				},
			],
			decision: {
				prompt: 'Engineering asks for the "data model" behind your new feature. What are they asking for?',
				options: [
					{
						text: 'The visual mockups, in higher fidelity',
						correct: false,
						consequence:
							'They have the visuals. They\'re asking what *information* the feature needs stored — the tables and fields underneath, not the pixels on top.',
					},
					{
						text: 'What information it stores and how it\'s structured',
						correct: true,
						consequence:
							'Exactly. The data model is the tables, fields, and relationships your feature needs. Sketching that with them makes you a stronger design partner.',
					},
					{
						text: 'That\'s purely an engineering decision',
						correct: false,
						consequence:
							'You know best what information the feature requires — what each card shows, what users edit. That directly shapes the data model. Don\'t opt out of it.',
					},
				],
			},
		},
		terms: [
			{
				slug: 'database',
				word: 'database',
				codeExample: '(e.g. PostgreSQL, MySQL)',
				definition:
					'An organized store where an app keeps all its information so it can be saved, found, and updated reliably. Far more structured than a pile of files — more like a well-run warehouse with labeled shelves. Almost every app you use sits on top of one.',
				designerContext:
					'Every piece of real data in your designs — a username, a saved draft, a setting — lives in a database. Understanding that helps you reason about what\'s stored, what\'s temporary, and what has to persist between sessions.',
			},
			{
				slug: 'table',
				word: 'table',
				codeExample: 'users, workspaces, orders',
				definition:
					'A single collection of one type of thing inside a database, organized like a spreadsheet — columns define the kinds of info, rows are individual records. One table for users, one for orders, and so on.',
				designerContext:
					'Tables often map closely to the "objects" in your design — users, projects, messages. Thinking in tables helps you align your information architecture with how the data is actually structured.',
			},
			{
				slug: 'schema',
				word: 'schema',
				codeExample: '(the structure: tables, fields, relationships)',
				definition:
					'The blueprint of a database — which tables exist, what fields each one holds, and how they relate. It defines the *shape* of the data before any actual data fills it in. The floor plan, not the furniture.',
				designerContext:
					'When you map out what information a feature needs and how its pieces relate, you\'re sketching a schema. Collaborating on it early prevents mismatches between what you designed and what the data can actually support.',
			},
			{
				slug: 'field',
				word: 'field',
				codeExample: 'email, created_at, workspace_name',
				definition:
					'A single piece of information in a record — one column of a table. A user record might have fields for name, email, and signup date. The smallest labeled unit of stored data. (Also called a column.)',
				designerContext:
					'Every piece of data you put on a screen corresponds to a field. Knowing this helps you ask precise questions — "is there a field for that?" — instead of assuming data exists that was never stored.',
			},
		],
	},
	{
		number: 2,
		title: 'Getting the data',
		xpReward: 20,
		scenario: {
			briefing:
				'Mission 6-B: An analytics dashboard you designed is showing wrong numbers — revenue figures that don\'t match finance\'s totals. The design is reading the data faithfully. The data it\'s being handed is wrong, and the reason is in how it\'s being fetched.',
			exchanges: [
				{
					speaker: 'The Data Engineer',
					text: 'The dashboard runs a `query` to get its numbers — a precise request to the database for specific data. "Give me total revenue for June." If the query asks the wrong question, you get confident, wrong answers. The display is honest; the question was off.',
					highlightedTerms: ['query', 'sql'],
				},
				{
					speaker: 'The Data Engineer',
					text: 'Queries are written in `SQL` — the standard language for asking databases questions. This one joined the wrong tables. It pulled refunds in with sales because the connection between them was wired up incorrectly.',
					highlightedTerms: ['sql'],
				},
				{
					speaker: 'The Tech Lead',
					text: 'The wiring problem is about keys. Every row has a `primary key` — a unique ID, like a fingerprint for that record. A `foreign key` is how one table points to a row in another. The query matched on the wrong foreign key, so it stitched together rows that don\'t actually belong together.',
					highlightedTerms: ['primary-key', 'foreign-key'],
				},
				{
					speaker: 'You',
					text: 'So my dashboard is fine — it\'s faithfully displaying a flawed query. The fix is upstream in how the data\'s joined, not in my charts. Knowing that, I can describe the bug precisely instead of doubting my own design.',
					highlightedTerms: [],
				},
			],
			decision: {
				prompt: 'Your dashboard shows wrong revenue, but the design renders exactly what it\'s given. Where\'s the bug?',
				options: [
					{
						text: 'In your chart components',
						correct: false,
						consequence:
							'The charts faithfully display whatever data arrives. If the numbers are wrong but the rendering is correct, the problem is in the data being fed in, not the display.',
					},
					{
						text: 'In the query feeding the dashboard',
						correct: true,
						consequence:
							'Right. A faithful display of bad data points upstream — to a query pulling or joining the wrong rows. Naming that precisely gets it to the right person fast.',
					},
					{
						text: 'In the user\'s browser',
						correct: false,
						consequence:
							'The same wrong numbers would show everywhere — this isn\'t a local glitch. Consistently wrong totals point at the query, not one person\'s browser.',
					},
				],
			},
		},
		terms: [
			{
				slug: 'query',
				word: 'query',
				codeExample: "SELECT SUM(amount) FROM sales WHERE month = 'June'",
				definition:
					'A specific request to a database for specific information. "Give me all orders from yesterday," "count active users." The database answers exactly what you ask — which means a poorly framed query returns confidently wrong results.',
				designerContext:
					'Most data on a screen arrives via a query. When numbers look wrong but the layout is right, the query is a prime suspect. Knowing this helps you point engineers upstream instead of doubting your own design.',
			},
			{
				slug: 'sql',
				word: 'SQL',
				codeExample: 'SELECT name FROM users WHERE active = true',
				definition:
					'The standard language for asking databases questions and getting data back. Readable enough that the intent is often clear even to non-engineers — SELECT name FROM users reads almost like English. The lingua franca of structured data.',
				designerContext:
					'You don\'t need to write SQL, but recognizing it helps you follow data conversations and even sanity-check what a screen is *supposed* to be pulling. It demystifies where your numbers come from.',
			},
			{
				slug: 'primary-key',
				word: 'primary key',
				codeExample: 'id: 4471 (unique per row)',
				definition:
					'A unique identifier for each record in a table — no two rows share one. It\'s how the database tells records apart with certainty, even if other details match. A fingerprint for a row.',
				designerContext:
					'Primary keys are why "two users named Alex Smith" never get confused by the system. They explain how an app reliably references the exact item you selected, even among look-alikes.',
			},
			{
				slug: 'foreign-key',
				word: 'foreign key',
				codeExample: 'workspace_id: 4471 (points to a row in another table)',
				definition:
					'A field in one table that points to a specific record in another, creating a relationship between them. It\'s how a database connects related things — this order belongs to that customer. The thread linking two tables together.',
				designerContext:
					'Foreign keys are the data version of relationships you design constantly — a comment belongs to a post, a task belongs to a project. Understanding them clarifies how connected data is wired, and how a wrong link produces wrong results.',
			},
		],
	},
	{
		number: 3,
		title: 'Keeping it healthy',
		xpReward: 25,
		scenario: {
			briefing:
				'Mission 6-C: Mid-demo, in front of a client, the app slows to a crawl and then throws an error. Behind the scenes, a database migration was running at exactly the wrong moment. Live demos have a sense of timing.',
			exchanges: [
				{
					speaker: 'The Data Engineer',
					text: 'A `migration` was running — a controlled, versioned change to the database\'s structure, like adding a column or reshaping a table. Migrations are how the schema evolves safely over time. This one just had catastrophically bad timing against a live demo.',
					highlightedTerms: ['migration', 'data-integrity'],
				},
				{
					speaker: 'The Data Engineer',
					text: 'The slowdown got worse because a query that needed an `index` didn\'t have one. An index is like a book\'s index — it lets the database jump straight to the rows it needs instead of scanning every page. Without it, big tables crawl.',
					highlightedTerms: ['index'],
				},
				{
					speaker: 'The Tech Lead',
					text: 'For demos, we should\'ve been on `seed data` — fake but realistic sample data made for testing and demos, kept separate from real records. And migrations are written carefully to protect `data integrity`: the guarantee that the data stays accurate and consistent, with no broken links or half-finished changes.',
					highlightedTerms: ['seed-data', 'data-integrity'],
				},
				{
					speaker: 'You',
					text: 'So three lessons: run migrations off-hours, make sure demo-critical screens are indexed, and demo on seed data. None of these are "design" exactly, but knowing them makes me the kind of designer engineers actually want in the planning room.',
					highlightedTerms: [],
				},
			],
			decision: {
				prompt: 'A migration during a live demo caused slowness and errors. What\'s the lesson for next time?',
				options: [
					{
						text: 'Never change the database again',
						correct: false,
						consequence:
							'Databases have to evolve — migrations are normal and necessary. The lesson is *timing and preparation*, not avoiding change forever.',
					},
					{
						text: 'Schedule migrations off-hours and demo on seed data',
						correct: true,
						consequence:
							'Exactly. Run structural changes when traffic\'s low, and demo on safe sample data. Both are simple practices that prevent exactly this.',
					},
					{
						text: 'Blame the database engineer',
						correct: false,
						consequence:
							'Blame fixes nothing and misses the real takeaway: better timing and a seed-data demo environment. The fix is process, not fault.',
					},
				],
			},
		},
		terms: [
			{
				slug: 'migration',
				word: 'migration',
				codeExample: 'ALTER TABLE users ADD COLUMN avatar_url',
				definition:
					'A controlled, versioned change to a database\'s structure — adding a column, renaming a table, reshaping how data is organized. Migrations let the schema evolve over time without losing or corrupting existing data. Each one is a tracked, reversible step.',
				designerContext:
					'When you add a new field to a feature — a profile bio, a new status — a migration is what makes room for it in the database. Understanding this helps you grasp why "a small new field" can still require real engineering coordination.',
			},
			{
				slug: 'index',
				word: 'index',
				codeExample: 'CREATE INDEX ON orders (customer_id)',
				definition:
					'A behind-the-scenes shortcut that lets a database find specific rows fast, without scanning the entire table. Like the index at the back of a book — jump straight to the right page instead of reading all of them. Essential as data grows large.',
				designerContext:
					'Indexes are often why one screen loads instantly and a similar one lags. When a list or search feels slow, "is that column indexed?" is a surprisingly relevant question for a designer to understand.',
			},
			{
				slug: 'seed-data',
				word: 'seed data',
				codeExample: '(sample records loaded for testing/demos)',
				definition:
					'Fake but realistic data created to fill an app during development, testing, or demos — kept entirely separate from real user records. It lets you see how a feature looks "full" without touching or risking actual data. A stunt double for the real thing.',
				designerContext:
					'Good seed data is a design ally — it\'s how you preview empty, sparse, and overflowing states. Asking for realistic seed data (long names, edge cases) helps you design for reality instead of tidy placeholder text.',
			},
			{
				slug: 'data-integrity',
				word: 'data integrity',
				codeExample: '(constraints that keep data valid and consistent)',
				definition:
					'The guarantee that data stays accurate, consistent, and uncorrupted — no broken links between records, no half-finished changes, no contradictions. The systems and rules that keep the warehouse honest. When it fails, you get impossible states.',
				designerContext:
					'Data integrity failures surface as weird UI — an order with no customer, a comment on a deleted post, a count that doesn\'t add up. Recognizing these as integrity issues helps you report them precisely instead of as one-off "glitches."',
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
		levels: cloudInfraLevels,
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
		levels: cicdLevels,
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
		levels: securityLevels,
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
		levels: dataDbsLevels,
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

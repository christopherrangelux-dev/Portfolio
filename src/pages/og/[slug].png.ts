import { OGImageRoute } from 'astro-og-canvas';
import { getCollection } from 'astro:content';

type RGBColor = [number, number, number];

function hexToRgb(hex: string): RGBColor {
	const value = hex.replace('#', '');
	return [parseInt(value.slice(0, 2), 16), parseInt(value.slice(2, 4), 16), parseInt(value.slice(4, 6), 16)];
}

const work = await getCollection('work');
const pages = Object.fromEntries(work.map((entry) => [entry.id, entry]));

export const { getStaticPaths, GET } = await OGImageRoute({
	param: 'slug',
	pages,
	getSlug: (path) => path,
	getImageOptions: (_path, entry: (typeof work)[number]) => ({
		title: entry.data.title,
		description: `${entry.data.metric} ${entry.data.metricLabel}`,
		bgGradient: [[17, 19, 30], hexToRgb(entry.data.color)],
		border: { color: hexToRgb(entry.data.color), width: 12, side: 'block-end' },
		font: {
			title: { color: [240, 234, 216], size: 64 },
			description: { color: [167, 159, 140], size: 36 },
		},
	}),
});

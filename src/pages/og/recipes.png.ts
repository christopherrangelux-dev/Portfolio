import { generateOpenGraphImage } from 'astro-og-canvas';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
	const body = await generateOpenGraphImage({
		title: 'Recipes',
		description: 'Things we actually cook. With the stories attached.',
		bgGradient: [[17, 19, 30], [139, 94, 60]],
		border: { color: [139, 94, 60], width: 12, side: 'block-end' },
		font: {
			title: { color: [240, 234, 216], size: 64 },
			description: { color: [167, 159, 140], size: 36 },
		},
	});
	return new Response(body, { headers: { 'Content-Type': 'image/png' } });
};

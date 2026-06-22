import { generateOpenGraphImage } from 'astro-og-canvas';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
	const body = await generateOpenGraphImage({
		title: 'Christopher Rangel',
		description: 'Product Designer — systems thinking, human outcomes',
		bgGradient: [[17, 19, 30], [56, 43, 95]],
		border: { color: [194, 117, 46], width: 12, side: 'block-end' },
		font: {
			title: { color: [240, 234, 216], size: 68 },
			description: { color: [167, 159, 140], size: 36 },
		},
	});
	return new Response(body, { headers: { 'Content-Type': 'image/png' } });
};

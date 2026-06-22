export interface ParsedMetric {
	staticPrefix: string;
	animPrefix: string;
	end: number;
	animSuffix: string;
	comma: boolean;
}

/**
 * Splits a metric string into a static lead-in (for "53% → 96%" style metrics,
 * the "53% → " part stays static) and the animatable final number.
 */
export function parseMetric(metric: string): ParsedMetric {
	const arrowIndex = metric.indexOf('→');
	const staticPrefix = arrowIndex === -1 ? '' : metric.slice(0, arrowIndex + 1).trim() + ' ';
	const finalPart = arrowIndex === -1 ? metric : metric.slice(arrowIndex + 1).trim();

	const match = finalPart.match(/^(\D*)([\d,]+)(.*)$/);
	if (!match) {
		return { staticPrefix, animPrefix: '', end: 0, animSuffix: finalPart, comma: false };
	}
	const [, animPrefix, digits, animSuffix] = match;
	return {
		staticPrefix,
		animPrefix,
		end: parseInt(digits.replace(/,/g, ''), 10),
		animSuffix,
		comma: digits.includes(','),
	};
}

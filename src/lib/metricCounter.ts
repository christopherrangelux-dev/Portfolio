export function animateMetric(el: HTMLElement) {
	const target = parseFloat(el.dataset.metricEnd ?? '0');
	const prefix = el.dataset.metricPrefix ?? '';
	const suffix = el.dataset.metricSuffix ?? '';
	const comma = el.dataset.metricComma === '1';
	const duration = 600;
	const start = performance.now();

	requestAnimationFrame(function tick(now) {
		const pct = Math.min((now - start) / duration, 1);
		const eased = 1 - Math.pow(1 - pct, 3);
		const value = Math.round(target * eased);
		el.textContent = prefix + (comma ? value.toLocaleString() : String(value)) + suffix;
		if (pct < 1) requestAnimationFrame(tick);
	});
}

export function setupMetricCounters() {
	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const metrics = document.querySelectorAll<HTMLElement>('[data-metric]');
	if (reduceMotion || metrics.length === 0) return;

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				observer.unobserve(entry.target);
				animateMetric(entry.target as HTMLElement);
			});
		},
		{ threshold: 0.5 }
	);
	metrics.forEach((el) => observer.observe(el));
}

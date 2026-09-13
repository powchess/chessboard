const calcNewSize = (size: number) =>
	(Math.floor((size * window.devicePixelRatio) / 8) * 8) / window.devicePixelRatio;

export function fitSize(node: HTMLDivElement) {
	const parent = node.parentElement as HTMLDivElement;
	let lastSize: number | undefined;

	if (typeof window.ResizeObserver === 'undefined') {
		throw new Error('window.ResizeObserver is missing.');
	}

	const observer = new ResizeObserver((entries) => {
		const entry = entries[0];
		if (!entry) return;
		const newSize = calcNewSize(entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width);
		if (newSize === lastSize) return;
		lastSize = newSize;

		node.dispatchEvent(
			new CustomEvent('newsize', {
				detail: newSize
			})
		);

		node.style.setProperty('width', `${newSize}px`);
		node.style.setProperty('height', `${newSize}px`);
	});

	observer.observe(parent);

	return {
		update() {
			observer.unobserve(parent);
			observer.disconnect();

			observer.observe(parent);
		},
		destroy() {
			observer.unobserve(parent);
			observer.disconnect();
		}
	};
}

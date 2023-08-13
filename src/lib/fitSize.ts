const calcNewSize = (size: number) =>
	(Math.floor((size * window.devicePixelRatio) / 8) * 8) / window.devicePixelRatio;

export function fitSize(node: HTMLDivElement) {
	const parent = node.parentElement as HTMLDivElement;

	if (typeof window.ResizeObserver === 'undefined') {
		throw new Error('window.ResizeObserver is missing.');
	}

	const observer = new ResizeObserver((entries) => {
		const boundingRect = parent.getBoundingClientRect();
		entries.forEach(() => {
			const newSize = calcNewSize(boundingRect.width);

			node.dispatchEvent(
				new CustomEvent('newsize', {
					detail: newSize
				})
			);

			node.style.setProperty('width', `${newSize}px`);
			node.style.setProperty('height', `${newSize}px`);
		});
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

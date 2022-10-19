export default function resizing(node: HTMLElement, params: { mouseEvents: boolean; curScale: number }) {
	// const { curScale } = params;
	let { mouseEvents } = params;
	let scale = params.curScale;

	let initialX: number;
	let initialY: number;
	let initialScale: number;

	function handleMousemove(e: PointerEvent) {
		e.stopPropagation();
		node.dispatchEvent(
			new CustomEvent('resizing', {
				detail: {
					scale: Math.round(
						Math.min(
							Math.max(0, Math.min(100, initialScale + (e.pageX - initialX) / 3)),
							Math.max(0, Math.min(100, initialScale + (e.pageY - initialY) / 3))
						)
					)
				}
			})
		);
	}

	function handleMouseup(e: PointerEvent) {
		e.stopPropagation();
		node.dispatchEvent(
			new CustomEvent('endResizing', {
				detail: {
					scale: Math.round(
						Math.min(
							Math.max(0, Math.min(100, initialScale + (e.pageX - initialX) / 3)),
							Math.max(0, Math.min(100, initialScale + (e.pageY - initialY) / 3))
						)
					)
				}
			})
		);
		window.removeEventListener('pointermove', handleMousemove);
		window.removeEventListener('pointerup', handleMouseup);
	}

	function handleMousedown(e: MouseEvent) {
		if (!mouseEvents) return;
		e.stopPropagation();
		if (e.button !== 0) return;

		initialX = e.pageX;
		initialY = e.pageY;
		initialScale = scale;

		window.addEventListener('pointermove', handleMousemove);
		window.addEventListener('pointerup', handleMouseup);
	}

	node.addEventListener('pointerdown', handleMousedown);

	return {
		update(newParams: { mouseEvents: boolean; curScale: number }) {
			scale = newParams.curScale;
			if (mouseEvents !== newParams.mouseEvents) mouseEvents = newParams.mouseEvents;
		},
		destroy() {
			node.removeEventListener('mousedown', handleMousedown);
		}
	};
}

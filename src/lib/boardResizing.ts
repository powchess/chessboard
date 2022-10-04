export default function resizing(
	node: HTMLElement,
	params: { mouseEvents: boolean; minWidth: number; maxWidth: number; curWidth: number }
) {
	const { minWidth, maxWidth, curWidth } = params;
	let { mouseEvents } = params;
	let Width: number = curWidth;

	let initialX: number;
	let initialY: number;
	let initialWidth: number;
	let initialHeight: number;

	function handleMousemove(e: MouseEvent) {
		e.stopPropagation();
		node.dispatchEvent(
			new CustomEvent('resizing', {
				detail: {
					size: Math.max(
						Math.max(minWidth, Math.min(maxWidth, initialWidth + (e.pageX - initialX))),
						Math.max(minWidth, Math.min(maxWidth, initialHeight + (e.pageY - initialY)))
					)
				}
			})
		);
	}

	function handleMouseup(e: MouseEvent) {
		e.stopPropagation();
		node.dispatchEvent(
			new CustomEvent('endResizing', {
				detail: {
					size: Math.max(
						Math.max(minWidth, Math.min(maxWidth, initialWidth + Math.floor((e.pageX - initialX) / 8) * 8)),
						Math.max(minWidth, Math.min(maxWidth, initialHeight + Math.floor((e.pageY - initialY) / 8) * 8))
					)
				}
			})
		);
		window.removeEventListener('mousemove', handleMousemove);
		window.removeEventListener('mouseup', handleMouseup);
	}

	function handleMousedown(e: MouseEvent) {
		if (!mouseEvents) return;
		e.stopPropagation();
		if (e.button !== 0) return;

		initialX = e.pageX;
		initialWidth = Width;
		initialY = e.pageY;
		initialHeight = Width;

		window.addEventListener('mousemove', handleMousemove);
		window.addEventListener('mouseup', handleMouseup);
	}

	node.addEventListener('mousedown', handleMousedown);

	return {
		update(newParams: { mouseEvents: boolean; minWidth: number; maxWidth: number; curWidth: number }) {
			Width = newParams.curWidth;
			if (mouseEvents !== newParams.mouseEvents) mouseEvents = newParams.mouseEvents;
		},
		destroy() {
			node.removeEventListener('mousedown', handleMousedown);
		}
	};
}

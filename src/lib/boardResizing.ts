export default function resizing(node: HTMLElement, params: { minWidth: number; maxWidth: number; curWidth: number }) {
	let { minWidth, maxWidth, curWidth } = params;
	let Width: number = curWidth;

	let initialX: number;
	let initialY: number;
	let initialWidth: number;
	let initialHeight: number;

	node.addEventListener('mousedown', handleMousedown);

	function handleMousedown(e: MouseEvent) {
		e.stopPropagation();
		if (e.button != 0) return;

		initialX = e.pageX;
		initialWidth = Width;
		initialY = e.pageY;
		initialHeight = Width;

		window.addEventListener('mousemove', handleMousemove);
		window.addEventListener('mouseup', handleMouseup);
	}

	function handleMousemove(e: MouseEvent) {
		e.stopPropagation();
		node.dispatchEvent(
			new CustomEvent('resizing', {
				detail: {
					size: Math.max(
						Math.max(minWidth, Math.min(maxWidth, initialWidth + (e.pageX - initialX) * 2)),
						Math.max(minWidth, Math.min(maxWidth, initialHeight + (e.pageY - initialY) * 2))
					) 
				},
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
					),
				},
			})
		);
		window.removeEventListener('mousemove', handleMousemove);
		window.removeEventListener('mouseup', handleMouseup);
	}

	return {
		update(newParams: { minWidth: number; maxWidth: number; curWidth: number }) {
			Width = newParams.curWidth;
		},
		destroy() {
			node.removeEventListener('mousedown', handleMousedown);
		},
	};
}

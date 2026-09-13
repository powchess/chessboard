import { tweened } from 'svelte/motion';
import { describe, expect, it, vi } from 'vitest';
import resizing from './boardResizing.js';
import drag from './draggable.js';
import { fitSize } from './fitSize.js';

const pointerEvent = (type: string, x: number, y: number) => {
	const event = new MouseEvent(type, { bubbles: true, button: 0, clientX: x, clientY: y });
	Object.defineProperties(event, {
		isPrimary: { value: true },
		pointerType: { value: 'mouse' },
		offsetX: { value: 10 },
		offsetY: { value: 10 },
		pageX: { value: x },
		pageY: { value: y }
	});
	return event as unknown as PointerEvent;
};

describe('board actions', () => {
	it('only reports a changed pixel-aligned size', () => {
		let observerCallback: ResizeObserverCallback | undefined;
		class ResizeObserverMock {
			constructor(callback: ResizeObserverCallback) {
				observerCallback = callback;
			}
			observe = vi.fn();
			unobserve = vi.fn();
			disconnect = vi.fn();
		}
		vi.stubGlobal('ResizeObserver', ResizeObserverMock);

		const parent = document.createElement('div');
		const board = document.createElement('div');
		parent.append(board);
		const sizes: number[] = [];
		board.addEventListener('newsize', (event) => sizes.push((event as CustomEvent<number>).detail));
		const action = fitSize(board);
		const entry = { contentRect: { width: 401 } } as unknown as ResizeObserverEntry;

		observerCallback?.([entry], {} as ResizeObserver);
		observerCallback?.([entry], {} as ResizeObserver);

		expect(sizes).toEqual([400]);
		expect(board.style.width).toBe('400px');
		action.destroy();
	});

	it('reports resizing continuously and cleans up after pointerup', () => {
		const node = document.createElement('div');
		const resizingEvents: number[] = [];
		const endEvents: number[] = [];
		node.addEventListener('resizing', (event) =>
			resizingEvents.push((event as CustomEvent<{ scale: number }>).detail.scale)
		);
		node.addEventListener('endResizing', (event) =>
			endEvents.push((event as CustomEvent<{ scale: number }>).detail.scale)
		);
		const action = resizing(node, { mouseEvents: true, curScale: 50 });

		node.dispatchEvent(pointerEvent('pointerdown', 10, 10));
		window.dispatchEvent(pointerEvent('pointermove', 70, 70));
		window.dispatchEvent(pointerEvent('pointerup', 70, 70));

		expect(resizingEvents).toEqual([70]);
		expect(endEvents).toEqual([70]);
		action.destroy();
	});

	it('raises the active piece while dragging and emits the original events', () => {
		const board = document.createElement('div');
		const piece = document.createElement('div');
		board.append(piece);
		Object.defineProperty(board, 'clientWidth', { value: 800 });
		Object.defineProperties(piece, {
			offsetWidth: { value: 100 },
			offsetHeight: { value: 100 }
		});
		board.getBoundingClientRect = () => ({ x: 0, y: 0, width: 800, height: 800 }) as DOMRect;
		piece.getBoundingClientRect = () => ({ x: 400, y: 600, width: 100, height: 100 }) as DOMRect;

		const started = vi.fn();
		const dropped = vi.fn();
		piece.addEventListener('startMoving', started);
		piece.addEventListener('dropped', dropped);
		const coords = tweened({ x: 400, y: 600, scale: 1 });
		const action = drag(piece, {
			startSquare: 'e2',
			boardFlipped: false,
			mouseEvents: true,
			canDrag: true,
			duration: 0,
			easingFunc: (value) => value,
			coords
		});

		piece.dispatchEvent(pointerEvent('pointerdown', 410, 610));
		window.dispatchEvent(pointerEvent('pointermove', 430, 630));

		expect(piece.classList.contains('dragging')).toBe(true);
		expect(started).toHaveBeenCalledOnce();

		window.dispatchEvent(pointerEvent('pointerup', 430, 630));
		expect(dropped).toHaveBeenCalledOnce();
		action.destroy();
	});
});

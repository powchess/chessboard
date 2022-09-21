/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
import { get } from 'svelte/store';
import type { Tweened } from 'svelte/motion';
import { fileToIndex, squareToSQXY } from './utils';

function getEndSquare(
	startSquare: string,
	directionX: number,
	directionY: number,
	boardFlipped: boolean | undefined
): string | null | undefined {
	if (directionX === 0 && directionY === 0) return startSquare;

	const files = boardFlipped ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].reverse() : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
	const ranks = boardFlipped ? ['8', '7', '6', '5', '4', '3', '2', '1'].reverse() : ['8', '7', '6', '5', '4', '3', '2', '1'];

	const newFile = files[files.indexOf(startSquare[0]) + directionX];
	const newRank = ranks[ranks.indexOf(startSquare[1]) + directionY];

	if (!newFile || !newRank) return undefined;

	return newFile + newRank;
}

function createTouchCircle(node: HTMLElement, scale: number, boardFlipped: boolean | undefined): SVGElement {
	const newScale = scale * 1.15;
	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	svg.setAttribute('width', (node.offsetWidth * newScale).toString());
	svg.setAttribute('height', (node.offsetHeight * newScale).toString());
	svg.style.position = 'absolute';
	svg.style.zIndex = '100';
	svg.style.translate = `${boardFlipped ? '' : '-'}${(25 * newScale) / 2}% -${(25 * newScale) / 2}%`;
	svg.style.opacity = '0.2';
	circle.setAttribute('r', ((node.offsetWidth * newScale) / 2).toString());
	circle.setAttribute('cx', ((node.offsetWidth * newScale) / 2).toString());
	circle.setAttribute('cy', ((node.offsetHeight * newScale) / 2).toString());
	circle.setAttribute('fill', 'black');
	svg.appendChild(circle);

	return svg;
}

type DragParams = {
	startSquare: string;
	boardFlipped: boolean;
	onlyShow: boolean;
	duration: number;
	easingFunc: (t: number) => number;
	coords: Tweened<{
		x: number;
		y: number;
		scale: number;
	}>;
};

export default function drag(node: HTMLImageElement, params: DragParams) {
	let waitingArgs: unknown[] | null;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function throttle(callback: (...args: any[]) => unknown, delay = 1000) {
		let shouldWait = false;

		const timeoutFunction = () => {
			if (waitingArgs == null) shouldWait = false;
			else {
				callback(...waitingArgs);
				waitingArgs = null;
				setTimeout(timeoutFunction, delay);
			}
		};

		return (...args: unknown[]) => {
			if (shouldWait) {
				waitingArgs = args;
				return;
			}

			callback(...args);
			shouldWait = true;
			setTimeout(timeoutFunction, delay);
		};
	}

	let x: number;
	let y: number;
	let offsetX: number;
	let offsetY: number;
	let globalDX: number;
	let globalDY: number;
	let scrollX: number;
	let scrollY: number;
	let nodeCentered = false;
	let timeout: number;
	const boardDiv = <HTMLDivElement>node.parentNode;
	let currentSquare: string;

	let { startSquare, boardFlipped, onlyShow, duration, easingFunc } = params;
	const { coords } = params;

	node.style.cursor = onlyShow ? 'default' : 'pointer';

	let startX = get(coords).x;
	let startY = get(coords).y;

	const touchScale = 1.6;
	let circle = createTouchCircle(node, touchScale, boardFlipped);
	node.draggable = false;

	function pointermove(e: PointerEvent) {
		const dx = e.clientX - x;
		const dy = e.clientY - y;
		x = e.clientX;
		y = e.clientY;

		globalDX += dx;
		globalDY += dy;

		if (!nodeCentered) {
			if (Math.abs(globalDX) > 1 || Math.abs(globalDY) > 1) {
				coords.update(
					(coord) => ({
						x: coord.x + (x - node.offsetWidth / 2 - node.getBoundingClientRect().x) / node.clientWidth,
						y:
							e.pointerType === 'touch'
								? coord.y - (y - node.offsetHeight * 1.5 - node.getBoundingClientRect().y) / node.clientWidth
								: coord.y - (y - node.offsetHeight / 2 - node.getBoundingClientRect().y) / node.clientWidth, //
						scale: e.pointerType === 'touch' ? touchScale : 1
					}),
					{ duration, easing: easingFunc }
				);
				nodeCentered = true;
				node.style.zIndex = '30';
				node.style.cursor = 'grabbing';

				node.dispatchEvent(new CustomEvent('startMoving'));
			}
		}

		if (!nodeCentered) return;

		if (e.pointerType === 'touch') {
			const diffX = Math.floor((globalDX + offsetX) / node.offsetWidth);
			const diffY = Math.floor((globalDY + offsetY) / node.offsetHeight);
			const targetSquare = getEndSquare(startSquare, diffX, diffY, boardFlipped);

			if (targetSquare) {
				if (targetSquare !== currentSquare) {
					const square = squareToSQXY(targetSquare);
					circle.style.left = `${square.x * 12.5}%`;
					circle.style.top = `${square.y * 12.5}%`;
					boardDiv.appendChild(circle);
				}
			} else if (currentSquare) {
				currentSquare = '';
			}
		}

		coords.update(
			(coord) => ({
				x: coord.x + dx / node.clientWidth,
				y: coord.y - dy / node.clientWidth,
				scale: e.pointerType === 'touch' ? touchScale : 1
			}),
			{ duration: 0 }
		);
		node.dispatchEvent(
			new CustomEvent('moving', {
				detail: {
					x,
					y
				}
			})
		);
	}

	const movingFunc = throttle(pointermove, 10);

	function scrolling(): void {
		const dx = window.scrollX - scrollX;
		const dy = window.scrollY - scrollY;

		scrollX = window.scrollX;
		scrollY = window.scrollY;

		coords.update(
			(coord) => ({
				x: coord.x + dx,
				y: coord.y + dy,
				scale: 1
			}),
			{ duration: 0 }
		);
	}

	function pointerup() {
		window.removeEventListener('pointermove', movingFunc);
		window.removeEventListener('pointerup', pointerup);
		window.removeEventListener('pointercancel', pointerup);
		document.body.removeEventListener('pointerleave', pointerup);
		window.removeEventListener('scroll', scrolling);

		waitingArgs = null;

		const diffX = Math.floor((globalDX + offsetX) / node.offsetWidth);
		const diffY = Math.floor((globalDY + offsetY) / node.offsetHeight);
		const targetSquare = getEndSquare(startSquare, diffX, diffY, boardFlipped);

		node.dispatchEvent(
			new CustomEvent('dropped', {
				detail: targetSquare
			})
		);
		coords
			.update(() => ({ x: startX, y: startY, scale: 1 }), { duration, easing: easingFunc })
			.then(() => {
				node.dispatchEvent(new CustomEvent('animationEnded'));
			});

		x = 0;
		y = 0;
		globalDX = 0;
		globalDY = 0;
		node.style.cursor = onlyShow ? 'default' : 'pointer';

		nodeCentered = false;
		setTimeout(() => {
			node.style.zIndex = '1';
		}, duration);
		circle.remove();
	}

	function pointerdown(e: PointerEvent): void {
		e.preventDefault();
		if (e.button !== 0 || !e.isPrimary) return;

		startX = boardFlipped ? 7 - fileToIndex(startSquare[0]) : fileToIndex(startSquare[0]);
		startY = boardFlipped ? 8 - parseInt(startSquare[1], 10) : parseInt(startSquare[1], 10) - 1;

		currentSquare = startSquare;
		const bcr = (<HTMLElement>e.target).getBoundingClientRect();

		if (e.pointerType === 'touch') {
			x = e.clientX;
			y = e.clientY;
			offsetX = e.clientX - bcr.x;
			offsetY = e.clientY - bcr.y;
		} else {
			x = e.clientX;
			y = e.clientY;
			offsetX = e.offsetX;
			offsetY = e.offsetY;
		}

		globalDX = 0;
		globalDY = 0;
		scrollX = window.scrollX;
		scrollY = window.scrollY;

		node.dispatchEvent(new CustomEvent('clicked'));

		window.addEventListener('pointermove', movingFunc);
		window.addEventListener('pointerup', pointerup);
		window.addEventListener('pointercancel', pointerup);
		document.body.addEventListener('pointerleave', pointerup);
		window.addEventListener('scroll', scrolling);
	}

	function contextmenu(e: Event): void {
		e.preventDefault();
	}

	function dragstart(e: Event): void {
		e.preventDefault();
	}

	node.addEventListener('contextmenu', contextmenu);
	node.addEventListener('dragstart', dragstart);
	if (!onlyShow) node.addEventListener('pointerdown', pointerdown);

	return {
		destroy() {
			node.removeEventListener('pointerdown', pointerdown);
			node.removeEventListener('contextmenu', contextmenu);
			node.removeEventListener('dragstart', dragstart);
			window.clearTimeout(timeout);
		},
		update(newParams: DragParams) {
			startSquare = newParams.startSquare;
			duration = newParams.duration;
			easingFunc = newParams.easingFunc;

			if (newParams.onlyShow !== onlyShow) {
				onlyShow = newParams.onlyShow;
				if (onlyShow) {
					node.removeEventListener('pointerdown', pointerdown);
					node.style.cursor = 'default';
				} else {
					node.addEventListener('pointerdown', pointerdown);
					node.style.cursor = 'pointer';
				}
			}

			if (boardFlipped !== newParams.boardFlipped) circle = createTouchCircle(node, touchScale, newParams.boardFlipped);
			boardFlipped = newParams.boardFlipped;
		}
	};
}

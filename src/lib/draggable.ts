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
	svg.style.transform = `translate(${boardFlipped ? '' : '-'}${(25 * newScale) / 2}%, -${(25 * newScale) / 2}%)`;
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

	let startX = get(coords).x;
	let startY = get(coords).y;

	const touchScale = 1.6;
	let circle = createTouchCircle(node, touchScale, boardFlipped);
	node.draggable = false;

	function mousemove(e: MouseEvent | TouchEvent) {
		let dx: number;
		let dy: number;

		if (!(e instanceof MouseEvent)) {
			dx = e.touches[0].clientX - x;
			dy = e.touches[0].clientY - y;
			x = e.touches[0].clientX;
			y = e.touches[0].clientY;
		} else {
			dx = e.clientX - x;
			dy = e.clientY - y;
			x = e.clientX;
			y = e.clientY;
		}

		globalDX += dx;
		globalDY += dy;

		if (!nodeCentered) {
			if (Math.abs(globalDX) > 1 || Math.abs(globalDY) > 1) {
				coords.update(
					(coord) => ({
						x: coord.x + (x - node.offsetWidth / 2 - node.getBoundingClientRect().x) / node.clientWidth,
						y:
							e instanceof MouseEvent
								? coord.y - (y - node.offsetHeight / 2 - node.getBoundingClientRect().y) / node.clientWidth
								: coord.y - (y - node.offsetHeight * 1.5 - node.getBoundingClientRect().y) / node.clientWidth,
						scale: e instanceof MouseEvent ? 1 : touchScale
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

		if (!(e instanceof MouseEvent)) {
			const diffX = Math.floor((globalDX + offsetX) / node.offsetWidth);
			const diffY = Math.floor((globalDY + offsetY) / node.offsetHeight);
			const targetSquare = getEndSquare(startSquare, diffX, diffY, boardFlipped);

			if (targetSquare) {
				if (targetSquare !== currentSquare) {
					if (!(e instanceof MouseEvent)) {
						const square = squareToSQXY(targetSquare);
						circle.style.left = `${square.x * 12.5}%`;
						circle.style.top = `${square.y * 12.5}%`;
						boardDiv.appendChild(circle);
					}
				}
			} else if (currentSquare) {
				currentSquare = '';
			}
		}

		coords.update(
			(coord) => ({
				x: coord.x + dx / node.clientWidth,
				y: coord.y - dy / node.clientWidth,
				scale: e instanceof MouseEvent ? 1 : touchScale
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

	const movingFunc = throttle(mousemove, 10);

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

	function mouseup() {
		window.removeEventListener('mousemove', movingFunc);
		window.removeEventListener('mouseup', mouseup);
		document.body.removeEventListener('mouseleave', mouseup);
		window.removeEventListener('scroll', scrolling);
		window.removeEventListener('touchmove', movingFunc);
		window.removeEventListener('touchend', mouseup);
		window.removeEventListener('touchcancel', mouseup);

		waitingArgs = null;

		const diffX = Math.floor((globalDX + offsetX) / node.offsetWidth);
		const diffY = Math.floor((globalDY + offsetY) / node.offsetHeight);
		const targetSquare = getEndSquare(startSquare, diffX, diffY, boardFlipped);

		if (targetSquare) {
			node.dispatchEvent(
				new CustomEvent('dropped', {
					detail: targetSquare
				})
			);
		}
		coords
			.update(() => ({ x: startX, y: startY, scale: 1 }), { duration, easing: easingFunc })
			.then(() => {
				node.dispatchEvent(new CustomEvent('animationEnded'));
			});

		x = 0;
		y = 0;
		globalDX = 0;
		globalDY = 0;

		nodeCentered = false;
		node.style.removeProperty('cursor');
		setTimeout(() => {
			node.style.zIndex = '1';
		}, duration);
		circle.remove();
	}

	function mousedown(e: MouseEvent | TouchEvent): void {
		e.preventDefault();

		if (e instanceof MouseEvent && e.button !== 0) return;
		if (!(e instanceof MouseEvent) && e.touches?.length > 1) return;

		startX = boardFlipped ? 7 - fileToIndex(startSquare[0]) : fileToIndex(startSquare[0]);
		startY = boardFlipped ? 8 - parseInt(startSquare[1], 10) : parseInt(startSquare[1], 10) - 1;

		currentSquare = startSquare;
		const bcr = (<HTMLElement>e.target).getBoundingClientRect();

		if (!(e instanceof MouseEvent) && e.touches[0] && e.targetTouches[0]) {
			x = e.touches[0].clientX;
			y = e.touches[0].clientY;
			offsetX = e.targetTouches[0].clientX - bcr.x;
			offsetY = e.targetTouches[0].clientY - bcr.y;
		} else if (e instanceof MouseEvent) {
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

		window.addEventListener('mousemove', movingFunc);
		window.addEventListener('mouseup', mouseup);
		document.body.addEventListener('mouseleave', mouseup);
		window.addEventListener('scroll', scrolling);
		window.addEventListener('touchmove', movingFunc);
		window.addEventListener('touchend', mouseup);
	}

	function contextmenu(e: Event): void {
		e.preventDefault();
	}

	function dragstart(e: Event): void {
		e.preventDefault();
	}

	node.addEventListener('contextmenu', contextmenu);
	node.addEventListener('dragstart', dragstart);

	if (!onlyShow) {
		node.addEventListener('mousedown', mousedown);
		node.addEventListener('touchstart', mousedown);
	}

	return {
		destroy() {
			node.removeEventListener('mousedown', mousedown);
			node.removeEventListener('touchstart', mousedown);
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
					node.removeEventListener('mousedown', mousedown);
					node.removeEventListener('touchstart', mousedown);
				} else {
					node.addEventListener('mousedown', mousedown);
					node.addEventListener('touchstart', mousedown);
				}
			}

			if (boardFlipped !== newParams.boardFlipped) circle = createTouchCircle(node, touchScale, newParams.boardFlipped);
			boardFlipped = newParams.boardFlipped;
		}
	};
}

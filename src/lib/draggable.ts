/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
import { get } from 'svelte/store';
import type { Tweened } from 'svelte/motion';
import { fileToIndex, squareToSQXY } from './utils';
import type { ChessFile, ChessRank, ChessSquare } from './chessTypes';

function getEndSquare(
	startSquare: ChessSquare,
	directionX: number,
	directionY: number,
	boardFlipped: boolean | undefined
): ChessSquare | null | undefined {
	if (directionX === 0 && directionY === 0) return startSquare;

	const files = boardFlipped
		? ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a']
		: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
	const ranks = boardFlipped
		? ['1', '2', '3', '4', '5', '6', '7', '8']
		: ['8', '7', '6', '5', '4', '3', '2', '1'];

	const newFile = files[files.indexOf(startSquare[0]) + directionX];
	const newRank = ranks[ranks.indexOf(startSquare[1]) + directionY];

	if (!newFile || !newRank) return undefined;

	return `${<ChessFile>newFile}${<ChessRank>newRank}`;
}

function createTouchCircle(
	node: HTMLElement,
	scale: number,
	boardFlipped: boolean | undefined
): SVGElement {
	const newScale = scale * 1.15;
	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	svg.setAttribute('width', `${node.offsetWidth * newScale}`);
	svg.setAttribute('height', `${node.offsetHeight * newScale}`);
	svg.style.position = 'absolute';
	svg.style.zIndex = '100';
	svg.style.translate = `${boardFlipped ? '' : '-'}${(25 * newScale) / 2}% -${
		(25 * newScale) / 2
	}%`;
	svg.style.opacity = '0.2';
	svg.style.pointerEvents = 'none';
	circle.setAttribute('r', `${(node.offsetWidth * newScale) / 2}`);
	circle.setAttribute('cx', `${(node.offsetWidth * newScale) / 2}`);
	circle.setAttribute('cy', `${(node.offsetHeight * newScale) / 2}`);
	circle.setAttribute('fill', 'black');
	svg.appendChild(circle);

	return svg;
}

type DragParams = {
	startSquare: ChessSquare;
	boardFlipped: boolean;
	mouseEvents: boolean;
	canDrag: boolean;
	canSelect: boolean;
	canCapture: boolean;
	duration: number;
	easingFunc: (t: number) => number;
	coords: Tweened<{
		x: number;
		y: number;
		scale: number;
	}>;
};

export default function drag(node: HTMLDivElement, params: DragParams) {
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
	let currentSquare: ChessSquare | undefined;
	let circleAdded = false;

	let dragging = false;
	let isMobile = false;

	let {
		startSquare,
		boardFlipped,
		mouseEvents,
		canDrag,
		canSelect,
		canCapture,
		duration,
		easingFunc
	} = params;
	const { coords } = params;

	let startX = get(coords).x;
	let startY = get(coords).y;

	const touchScale = 1.6;
	const circle = createTouchCircle(node, touchScale, boardFlipped);

	function pointerdown(e: PointerEvent): void {
		if (e.button !== 0 || !e.isPrimary || !mouseEvents) return;
		if (e.pointerType === 'touch') isMobile = true;
		else isMobile = false;

		if (canCapture) {
			node.dispatchEvent(new CustomEvent('captured'));
			return;
		}
		if (canSelect || canDrag) node.dispatchEvent(new CustomEvent('clicked'));
		if (!canDrag) {
			node.dispatchEvent(
				new CustomEvent('dropped', {
					detail: startSquare
				})
			);
			return;
		}

		startX =
			((boardFlipped
				? 7 - fileToIndex(<ChessFile>startSquare[0])
				: fileToIndex(<ChessFile>startSquare[0])) *
				boardDiv.clientWidth) /
			8;
		startY =
			((boardFlipped ? parseInt(startSquare[1], 10) - 1 : 8 - parseInt(startSquare[1], 10)) *
				boardDiv.clientWidth) /
			8;

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

		dragging = true;

		window.addEventListener('pointermove', pointermove);
		window.addEventListener('pointerup', pointerup);
		window.addEventListener('pointercancel', pointercancel);
		document.body.addEventListener('pointerleave', pointercancel);
		window.addEventListener('scroll', scrolling);
	}

	function pointermove(e: PointerEvent) {
		const dx = e.clientX - x;
		const dy = e.clientY - y;
		x = e.clientX;
		y = e.clientY;

		globalDX += dx;
		globalDY += dy;

		if (!nodeCentered) centerNode(isMobile);
		if (!nodeCentered) return;

		if (isMobile) {
			const diffX = Math.floor((globalDX + offsetX) / node.offsetWidth);
			const diffY = Math.floor((globalDY + offsetY) / node.offsetHeight);
			const targetSquare = getEndSquare(startSquare, diffX, diffY, boardFlipped);

			if (targetSquare) {
				const square = squareToSQXY(targetSquare);
				circle.setAttribute('r', `${(node.offsetWidth * touchScale * 1.15) / 2}`);
				circle.setAttribute('cx', `${(node.offsetWidth * touchScale * 1.15) / 2}`);
				circle.setAttribute('cy', `${(node.offsetHeight * touchScale * 1.15) / 2}`);
				const squareX =
					(boardFlipped
						? ((7 - square.x) * boardDiv.clientWidth) / 8
						: (square.x * boardDiv.clientWidth) / 8) -
					(node.offsetWidth * touchScale * 1.15) / 2 +
					node.offsetWidth / 2;

				const squareY =
					(boardFlipped
						? ((7 - square.y) * boardDiv.clientWidth) / 8
						: (square.y * boardDiv.clientWidth) / 8) -
					(node.offsetWidth * touchScale * 1.15) / 2 +
					node.offsetWidth / 2;

				circle.style.translate = `${squareX}px ${squareY}px`;
				if (!circleAdded) {
					boardDiv.appendChild(circle);
					circleAdded = true;
				}
			} else if (currentSquare) {
				currentSquare = undefined;
			}
		}

		coords.update(
			(coord) => ({
				x: coord.x + dx,
				y: coord.y + dy,
				scale: isMobile ? touchScale : 1
			}),
			{ duration: 0 }
		);
		node.dispatchEvent(
			new CustomEvent('moving', {
				detail: {
					x: e.clientX + scrollX,
					y: e.clientY + scrollY
				}
			})
		);
	}

	function scrolling(): void {
		const dx = window.scrollX - scrollX;
		const dy = window.scrollY - scrollY;

		scrollX = window.scrollX;
		scrollY = window.scrollY;

		globalDX += dx;
		globalDY += dy;

		if (!nodeCentered) centerNode(isMobile);
		if (!nodeCentered) return;

		coords.update(
			(coord) => ({
				x: coord.x + dx,
				y: coord.y + dy,
				scale: isMobile ? touchScale : 1
			}),
			{ duration: 0 }
		);
		node.dispatchEvent(
			new CustomEvent('moving', {
				detail: {
					x: x + window.scrollX,
					y: y + window.scrollY
				}
			})
		);
	}

	function pointerup() {
		const diffX = Math.floor((globalDX + offsetX) / node.offsetWidth);
		const diffY = Math.floor((globalDY + offsetY) / node.offsetHeight);
		const targetSquare = getEndSquare(startSquare, diffX, diffY, boardFlipped);

		node.dispatchEvent(
			new CustomEvent('dropped', {
				detail: targetSquare
			})
		);

		dragging = false;

		pointercancel();
	}

	function pointercancel() {
		window.removeEventListener('pointermove', pointermove);
		window.removeEventListener('pointerup', pointerup);
		window.removeEventListener('pointercancel', pointerup);
		document.body.removeEventListener('pointerleave', pointerup);
		window.removeEventListener('scroll', scrolling);

		if (dragging) node.dispatchEvent(new CustomEvent('canceled'));
		dragging = false;

		coords
			.update(() => ({ x: startX, y: startY, scale: 1 }), {
				duration,
				easing: easingFunc
			})
			.then(() => {
				if (!dragging) node.dispatchEvent(new CustomEvent('animationEnded'));
				if (!dragging) node.classList.remove('dragging');
			});

		x = 0;
		y = 0;
		globalDX = 0;
		globalDY = 0;

		setTimeout(() => {
			if (!dragging) node.classList.remove('dragging');
		}, duration);

		nodeCentered = false;
		circle.remove();
		circleAdded = false;
	}

	function centerNode(isTouch = false): void {
		coords.update(
			() => ({
				x: startX,
				y: startY,
				scale: 1
			}),
			{ duration: 0 }
		);
		if (Math.abs(globalDX) > 1 || Math.abs(globalDY) > 1) {
			coords.update(
				() => ({
					x: startX + (x - node.offsetWidth / 2 - node.getBoundingClientRect().x),
					y: isTouch
						? startY + (y - node.offsetHeight * 1.5 - node.getBoundingClientRect().y)
						: startY + (y - node.offsetHeight / 2 - node.getBoundingClientRect().y),
					scale: isTouch ? touchScale : 1
				}),
				{ duration: 0 }
			);
			nodeCentered = true;
			node.classList.add('dragging');

			node.dispatchEvent(new CustomEvent('startMoving'));
		}
	}

	function contextmenu(e: Event): void {
		if (dragging) pointercancel();
		e.preventDefault();
	}

	function dragstart(e: Event): void {
		e.preventDefault();
	}

	node.addEventListener('contextmenu', contextmenu);
	node.addEventListener('dragstart', dragstart);
	node.addEventListener('pointerdown', pointerdown);

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

			if (newParams.canDrag !== canDrag) canDrag = newParams.canDrag;

			if (newParams.canSelect !== canSelect) canSelect = newParams.canSelect;

			if (newParams.canCapture !== canCapture) canCapture = newParams.canCapture;

			if (newParams.mouseEvents !== mouseEvents) mouseEvents = newParams.mouseEvents;

			boardFlipped = newParams.boardFlipped;
		}
	};
}

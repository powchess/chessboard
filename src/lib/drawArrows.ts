import { squareToSQXY } from './utils';

type Props = {
	svg: SVGGElement;
	flipped: boolean;
	enabled: boolean;
	settings: {
		knightLShape: boolean;
		onlyChessMove: boolean;
	};
};

export type ArrowData = {
	move: string;
	color: string;
	opacity: number;
};

type Pair<T> = { x: T; y: T };

type SqXY = Pair<number>;

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

export function removeComupterArrows(svg: SVGGElement): void {
	svg.querySelectorAll('[sf]').forEach((element) => element.remove());
}

function getChessSquare(square: SqXY) {
	return `${files[square.x]}${ranks[square.y]}`;
}

function isKnightMove(startSquare: SqXY, endSquare: SqXY) {
	return Math.abs((startSquare.x - endSquare.x) * (startSquare.y - endSquare.y)) === 2;
}

function getChessMove(startSquare: SqXY, endSquare: SqXY) {
	return `${getChessSquare(startSquare)}${getChessSquare(endSquare)}`;
}

function isChessMove(startSq: SqXY, endSquare: SqXY) {
	if (isKnightMove(startSq, endSquare)) return true;
	if (Math.abs(startSq.x - endSquare.x) === Math.abs(startSq.y - endSquare.y)) return true;
	if ((startSq.x === endSquare.x) !== (startSq.y === endSquare.y)) return true;
	return false;
}

function changeExistArrow(
	arrow: SVGPolylineElement,
	startSquare: SqXY,
	endSquare: SqXY,
	knightLShape?: boolean,
	color?: string,
	opacity?: number
) {
	let midPoint: SqXY = { x: -1, y: -1 };
	let end: SqXY;
	let angle;
	if (isKnightMove(startSquare, endSquare) && knightLShape) {
		if (Math.abs(endSquare.x - startSquare.x) === 2) midPoint = { x: endSquare.x, y: startSquare.y };
		else midPoint = { x: startSquare.x, y: endSquare.y };

		if (midPoint.y - startSquare.y < 0) angle = Math.PI + Math.atan((midPoint.x - startSquare.x) / (midPoint.y - startSquare.y));
		else angle = Math.atan((midPoint.x - startSquare.x) / Math.abs(midPoint.y - startSquare.y));
		end = {
			x: endSquare.x - Math.sign(endSquare.x - midPoint.x) * (midPoint.x !== endSquare.x ? 0.4 : 0),
			y: endSquare.y - Math.sign(endSquare.y - midPoint.y) * (midPoint.y !== endSquare.y ? 0.4 : 0)
		};
	} else {
		if (endSquare.y - startSquare.y < 0) angle = Math.PI + Math.atan((endSquare.x - startSquare.x) / (endSquare.y - startSquare.y));
		else angle = Math.atan((endSquare.x - startSquare.x) / Math.abs(endSquare.y - startSquare.y));
		end = {
			x: endSquare.x - Math.sin(angle) * 0.4,
			y: endSquare.y - Math.cos(angle) * 0.4
		};
	}

	const start = {
		x: startSquare.x + Math.sin(angle) * 0.4,
		y: startSquare.y + Math.cos(angle) * 0.4
	};

	arrow.setAttribute(
		'points',
		`${start.x + 0.5},${start.y + 0.5} ${
			midPoint.x !== -1 && midPoint.y !== -1 && knightLShape ? `${midPoint.x + 0.5},${midPoint.y + 0.5} ` : ''
		}${end.x + 0.5},${end.y + 0.5}`
	);
	arrow.setAttribute('data-sqID', `${getChessMove(startSquare, endSquare)}`);
	if (opacity !== undefined) arrow.setAttribute('opacity', `${opacity}`);
	if (color !== undefined) {
		arrow.setAttribute('marker-start', `url(#start-${color[0]})`);
		arrow.setAttribute('marker-end', `url(#end-${color[0]})`);
		arrow.setAttribute('stroke', color);
	}
}

function changeColor(
	svg: SVGGElement,
	drawingSVG: SVGPolylineElement | SVGCircleElement | undefined,
	startSquare: SqXY,
	shiftKey: boolean,
	ctrlKey: boolean,
	altKey: boolean
) {
	if (drawingSVG === undefined || (startSquare.x === -1 && startSquare.y === -1)) return;
	if (drawingSVG.tagName === 'circle') {
		drawingSVG.setAttribute('fill', 'transparent');
		if (shiftKey) drawingSVG.setAttribute('stroke', 'red');
		else if (ctrlKey) drawingSVG.setAttribute('stroke', 'orange');
		else if (altKey) drawingSVG.setAttribute('stroke', 'blue');
		else drawingSVG.setAttribute('stroke', 'green');

		svg.querySelectorAll(`сircle[cx="${startSquare.x + 0.5}"][cy="${startSquare.y + 0.5}"]`).forEach((element) => {
			if (drawingSVG !== undefined && element !== drawingSVG) {
				if (element.getAttribute('stroke') === drawingSVG.getAttribute('stroke')) drawingSVG.setAttribute('remove', '');
				else if (drawingSVG.hasAttribute('remove')) drawingSVG.removeAttribute('remove');
			}
		});
	} else if (drawingSVG.tagName === 'polyline') {
		const color = shiftKey ? 'red' : ctrlKey ? 'orange' : altKey ? 'blue' : 'green';
		drawingSVG.setAttribute('stroke', `${color}`);
		drawingSVG.setAttribute('marker-start', `url(#start-${color[0]})`);
		drawingSVG.setAttribute('marker-end', `url(#end-${color[0]})`);

		svg.querySelectorAll(`polyline[data-sqID="${drawingSVG.getAttribute('data-sqID')}"]`).forEach((element) => {
			if (!(drawingSVG instanceof SVGPolylineElement)) return;
			if (element !== drawingSVG) {
				if (element.getAttribute('stroke') === drawingSVG.getAttribute('stroke')) {
					drawingSVG.setAttribute('remove', '');
				} else if (drawingSVG.hasAttribute('remove')) {
					drawingSVG.removeAttribute('remove');
				}
			}
		});
	}
}

function createArrow(startSquare: SqXY, endSquare: SqXY, knightLShape?: boolean, color?: string, opacity?: number) {
	const drawingSVG = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
	changeExistArrow(drawingSVG, startSquare, endSquare, knightLShape, color, opacity);

	drawingSVG.setAttribute('fill', 'none');
	drawingSVG.setAttribute('stroke-width', '0.25');
	drawingSVG.setAttribute('stroke-linejoin', 'round');
	drawingSVG.setAttribute('opacity', opacity !== undefined ? `${opacity}` : '0.4');
	drawingSVG.setAttribute('marker-start', color ? `url(#start-${color[0]})` : 'url(#start-g)');
	drawingSVG.setAttribute('marker-end', color ? `url(#end-${color[0]})` : 'url(#end-g)');
	drawingSVG.setAttribute('stroke', color || 'green');
	return drawingSVG;
}

export function drawComputerArrows(svg: SVGGElement, data: ArrowData[], knightLShape?: boolean): void {
	data.forEach((element) => {
		const arrow = createArrow(
			squareToSQXY(element.move.substring(0, 2)),
			squareToSQXY(element.move.substring(2, 4)),
			knightLShape,
			element.color,
			element.opacity
		);
		arrow.setAttribute('sf', '');
		svg.appendChild(arrow);
	});
}

export function removeUserArrows(svg: SVGGElement): void {
	svg.querySelectorAll('circle,polyline').forEach((element) => {
		if (!element.hasAttribute('sf')) element.remove();
	});
}

export default function drawArrows(node: HTMLDivElement, params: Props) {
	let { svg, flipped, enabled, settings } = params;
	let leftButtonPressed = false;

	let startSquare: SqXY = { x: -1, y: -1 };
	let toBeRemoved: Element | undefined;

	let drawingSVG: SVGCircleElement | SVGPolylineElement | undefined;

	function getSVGCoords(x: number, y: number): SqXY {
		const boundingRect = node.getBoundingClientRect();

		const newX = flipped ? boundingRect.width - (x - boundingRect.left) : x - boundingRect.left;
		const newY = flipped ? boundingRect.height - (y - boundingRect.top) : y - boundingRect.top;
		return {
			x: Math.max(0, Math.min(7, Math.floor(newX / (node.clientWidth / 8)))),
			y: Math.max(0, Math.min(7, Math.floor(newY / (node.clientHeight / 8))))
		};
	}

	function createCircle(square: SqXY) {
		drawingSVG = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
		drawingSVG.setAttribute('cx', `${square.x + 0.5}`);
		drawingSVG.setAttribute('cy', `${square.y + 0.5}`);
		drawingSVG.setAttribute('r', `0.465`);
		drawingSVG.setAttribute('opacity', '0.4');
		drawingSVG.setAttribute('fill', 'none');
		drawingSVG.setAttribute('stroke-width', '0.07');
		drawingSVG.setAttribute('stroke', 'green');
	}

	function handleMousemove(e: MouseEvent) {
		if (drawingSVG === undefined || (startSquare.x === -1 && startSquare.y === -1)) return;
		const endSquare = getSVGCoords(e.clientX, e.clientY);

		if (settings.onlyChessMove && !isChessMove(startSquare, endSquare)) return;

		toBeRemoved = undefined;

		if (drawingSVG.hasAttribute('remove')) drawingSVG.removeAttribute('remove');

		if (startSquare.x === endSquare.x && startSquare.y === endSquare.y) {
			getChessMove(startSquare, endSquare);
			if (drawingSVG instanceof SVGPolylineElement) {
				drawingSVG.remove(); // remove from DOM
				createCircle(endSquare);
			}

			changeColor(svg, drawingSVG, startSquare, e.shiftKey, e.ctrlKey, e.altKey);
			svg.appendChild(drawingSVG);

			svg.querySelectorAll(`circle[cx="${startSquare.x + 0.5}"][cy="${startSquare.y + 0.5}"]`).forEach((element) => {
				if (element === drawingSVG) return;
				toBeRemoved = element;
				if (drawingSVG !== undefined && element.getAttribute('stroke') === drawingSVG.getAttribute('stroke')) {
					drawingSVG.setAttribute('remove', '');
				}
			});
		} else {
			if (drawingSVG instanceof SVGCircleElement) drawingSVG.remove();

			toBeRemoved = undefined;

			svg.querySelectorAll(`polyline[data-sqID="${getChessMove(startSquare, endSquare)}"]`).forEach((element) => {
				if (drawingSVG === undefined || (startSquare.x === -1 && startSquare.y === -1) || element === drawingSVG) return;
				toBeRemoved = element;
				if (element.getAttribute('stroke') === drawingSVG.getAttribute('stroke')) {
					drawingSVG.setAttribute('remove', '');
				}
			});
			if (drawingSVG instanceof SVGCircleElement) {
				drawingSVG = createArrow(startSquare, endSquare, settings.knightLShape);
				changeColor(svg, drawingSVG, startSquare, e.shiftKey, e.ctrlKey, e.altKey);
				svg.appendChild(drawingSVG);
			} else if (drawingSVG instanceof SVGPolylineElement) {
				changeExistArrow(drawingSVG, startSquare, endSquare, settings.knightLShape);
			}
		}
	}

	function handleContextmenu(e: MouseEvent) {
		e.preventDefault();
	}

	function handleKey(e: KeyboardEvent) {
		e.preventDefault();
		changeColor(svg, drawingSVG, startSquare, e.shiftKey, e.ctrlKey, e.altKey);
	}

	function handleMouseup(e: MouseEvent) {
		if (e.button === 0) {
			leftButtonPressed = false;
		} else if (e.button === 2) {
			if (startSquare.x === -1 && startSquare.y === -1) return;
			svg.querySelectorAll(`[remove]`).forEach((element) => {
				element.remove();
			});
			if (toBeRemoved) toBeRemoved.remove();
			toBeRemoved = undefined;
			if (drawingSVG?.tagName === 'circle' && !drawingSVG.hasAttribute('remove'))
				node.dispatchEvent(
					new CustomEvent('drawCircle', {
						detail: {
							square: getChessSquare(startSquare),
							color: drawingSVG.getAttribute('stroke')
						}
					})
				);
			if (drawingSVG?.tagName === 'polyline' && !drawingSVG.hasAttribute('remove'))
				node.dispatchEvent(
					new CustomEvent('drawArrow', {
						detail: {
							move: drawingSVG.getAttribute('data-sqID'),
							color: drawingSVG.getAttribute('stroke')
						}
					})
				);
			drawingSVG = undefined;
			startSquare = { x: -1, y: -1 };
			leftButtonPressed = false;

			window.removeEventListener('mousemove', handleMousemove);
			window.removeEventListener('keydown', handleKey);
			window.removeEventListener('keyup', handleKey);
			window.removeEventListener('contextmenu', handleContextmenu);
		}
		window.removeEventListener('mouseup', handleMouseup);
	}

	function handleMousedown(e: MouseEvent) {
		if (e.button === 0) {
			leftButtonPressed = true;
			removeUserArrows(svg);
			window.addEventListener('mouseup', handleMouseup);
		} else if (e.button === 2 && !leftButtonPressed) {
			const square = getSVGCoords(e.clientX, e.clientY);
			startSquare = square;

			createCircle(square);
			changeColor(svg, drawingSVG, startSquare, e.shiftKey, e.ctrlKey, e.altKey);

			toBeRemoved = undefined;

			svg.querySelectorAll(`circle[cx="${square.x + 0.5}"][cy="${square.y + 0.5}"]`).forEach((element) => {
				toBeRemoved = element;
				if (drawingSVG !== undefined && element.getAttribute('stroke') === drawingSVG.getAttribute('stroke')) {
					drawingSVG.setAttribute('remove', '');
				}
			});

			if (drawingSVG) svg.appendChild(drawingSVG);

			window.addEventListener('mousemove', handleMousemove);
			window.addEventListener('mouseup', handleMouseup);
			window.addEventListener('keydown', handleKey);
			window.addEventListener('keyup', handleKey);
			window.addEventListener('contextmenu', handleContextmenu);
		}
	}

	if (enabled) node.addEventListener('mousedown', handleMousedown);

	return {
		update(newParams: Props) {
			if (newParams.svg !== svg) svg = newParams.svg;
			if (newParams.enabled !== enabled) {
				enabled = newParams.enabled;
				if (enabled) node.addEventListener('mousedown', handleMousedown);
				else {
					removeUserArrows(svg);
					node.removeEventListener('mousedown', handleMousedown);
				}
			}
			settings = newParams.settings;
			flipped = newParams.flipped;
		}
	};
}

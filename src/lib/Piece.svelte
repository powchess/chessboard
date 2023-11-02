<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import * as easingFuncs from 'svelte/easing';
	import drag from './draggable.js';
	import type { ChessPiece, ChessSquare } from './chessTypes.js';
	import './assets/pieces.css';
	import type DraggableState from './state/draggable.js';
	import type MovableState from './state/movable.js';
	import type { Piece, PieceId } from './state/piece.js';
	import type BoardState from './state/board.js';

	export let id: PieceId;
	export let square: ChessSquare;
	export let name: ChessPiece;
	export let mouseEvents = true;
	export let getGridCoordsFromSquare: (square: ChessSquare) => { x: number; y: number };
	export let flipped: boolean;
	export let isGhost = false;

	export let boardSize: number;
	export let skins: BoardState['skins'];

	if (isGhost) mouseEvents = false;

	export let selectedPiece: Piece | undefined = undefined;
	export let draggableState: DraggableState | undefined = undefined;
	export let movableState: MovableState | undefined = undefined;

	let pieceDiv: HTMLDivElement;
	let selected = false;

	const dispatch = createEventDispatcher();
	let curDuration = draggableState?.transition?.enabled
		? draggableState.transition.settings.duration
		: 0;
	const coords = tweened(
		{ x: 0, y: 0, scale: 1 },
		{
			duration: curDuration,
			easing: easingFuncs[draggableState?.transition.settings.easing ?? 'cubicInOut']
		}
	);

	let mounted = false;

	const reRenderPieces = (withAnimation: boolean) => {
		pieceDiv?.classList.remove('dragging');
		const newCoords = getGridCoordsFromSquare(square);

		coords.update(
			() => ({
				x: (newCoords.x * boardSize) / 8,
				y: ((7 - newCoords.y) * boardSize) / 8,
				scale: 1
			}),
			{
				duration: withAnimation && mounted ? curDuration : 0,
				easing: easingFuncs[draggableState?.transition.settings.easing ?? 'cubicInOut']
			}
		);

		curDuration = draggableState?.transition.enabled
			? draggableState.transition.settings.duration
			: 0;
	};

	const changePosition = (newBoardSize: number) => {
		const newCoords = getGridCoordsFromSquare(square);

		coords.update(
			() => ({
				x: (newCoords.x * newBoardSize) / 8,
				y: ((7 - newCoords.y) * newBoardSize) / 8,
				scale: 1
			}),
			{
				duration: 0
			}
		);
	};

	const dropped = (e: CustomEvent) => {
		const dropSquare = e.detail as ChessSquare | undefined;
		if (
			draggableState?.transition?.settings !== undefined &&
			!draggableState.transition.settings.clickMoveAnimation
		)
			curDuration = 0;
		if (!dropSquare) dispatch('deselect');
		if (square === dropSquare) {
			if (!selected) dispatch('select');
			else dispatch('deselect');
			selected = !selected;
		} else selected = false;
		if (canDrag(movableState, draggableState)) dispatch('endDragging', square + e.detail);
		if (square !== e.detail && e.detail) {
			curDuration = 0;
			dispatch('move', square + e.detail);
		}
	};

	const canDrag = (movable?: MovableState, draggable?: DraggableState) => {
		if (!movable?.enabled || !draggable?.enabled || !mouseEvents) return false;
		return true;
	};

	const curPieceIsNotSelectedPiece = (piece: Piece | undefined) =>
		piece === undefined || piece.name !== name || piece.square !== square;

	onMount(() => {
		mounted = true;
	});

	$: if (curPieceIsNotSelectedPiece(selectedPiece)) selected = false;
	$: flipped, reRenderPieces(false);
	$: square, reRenderPieces(true);
	$: changePosition(boardSize);
</script>

<div
	bind:this={pieceDiv}
	use:drag={{
		startSquare: square,
		mouseEvents,
		canDrag: canDrag(movableState, draggableState),
		boardFlipped: flipped,
		duration: draggableState?.transition.enabled ? draggableState.transition.settings.duration : 0,
		easingFunc: easingFuncs[draggableState?.transition.settings.easing ?? 'cubicInOut'],
		coords
	}}
	on:dropped={dropped}
	on:startMoving
	on:clicked
	on:canceled
	on:squareover={(e) => {
		dispatch('squareover', e.detail);
	}}
	style="{skins.enabled && skins.urls[id]
		? `background: url(${skins.urls[id]}); `
		: ''}translate: {$coords.x}px {$coords.y}px;{$coords.scale !== 1
		? ` scale: ${$coords.scale}`
		: ''}"
	class="{name}{name[0] === 'w' ? ' white' : ' black'}{isGhost
		? ' ghost'
		: ''}{!movableState?.enabled && !isGhost ? ' static' : ''}{!mounted ? ' opacity-0' : ''}"
/>

<style>
	div {
		-webkit-touch-callout: none; /* iOS Safari */
		-webkit-user-select: none; /* Safari */
		-khtml-user-select: none; /* Konqueror HTML */
		-moz-user-select: none; /* Old versions of Firefox */
		-ms-user-select: none; /* Internet Explorer/Edge */
		user-select: none; /* Non-prefixed version, currently supported by Chrome, Opera and Firefox */
		touch-action: none;
		position: absolute;
		left: 0;
		top: 0;
		aspect-ratio: 1 / 1;
		width: 12.5%;
		background-size: 100% 100% !important;
		will-change: transform;
		z-index: 2;
		pointer-events: none;
	}
	.ghost {
		opacity: 0.3;
		z-index: 0 !important;
	}

	.static {
		z-index: 1;
	}

	.canMove,
	.capture {
		cursor: pointer;
	}

	.dragging {
		cursor: grabbing !important;
		z-index: 30;
	}
</style>

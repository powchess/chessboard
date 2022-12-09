<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import * as easingFuncs from 'svelte/easing';
	import drag from './draggable';
	import type { ChessPiece, ChessSquare } from './chessTypes';
	import { Color } from './enums';
	import type MovableState from './state/movable';
	import type { Piece } from './state';
	import type DraggableState from './state/draggable';
	import type LegalState from './state/legal';
	import type SelectableState from './state/selectable';
	import './assets/pieces.css';

	export let square: ChessSquare;
	export let name: ChessPiece;
	export let mouseEvents = true;
	export let getGridCoordsFromSquare: (square: ChessSquare) => { x: number; y: number };
	export let flipped: boolean;
	export let isGhost = false;

	export let boardSize: number;

	if (isGhost) mouseEvents = false;

	export let selectableState: SelectableState | undefined = undefined;
	export let draggableState: DraggableState | undefined = undefined;
	export let legalState: LegalState | undefined = undefined;
	export let movableState: MovableState | undefined = undefined;

	let selected = false;
	let canDragVar = false;
	let canSelectVar = false;
	let canCaptureVar = false;

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

	const getColorFromString = (piece: ChessPiece) => (piece[0] === 'w' ? Color.WHITE : Color.BLACK);

	const reRenderPieces = (sq: ChessSquare) => {
		const newCoords = getGridCoordsFromSquare(sq);

		coords.update(
			() => ({
				x: (newCoords.x * boardSize) / 8,
				y: ((7 - newCoords.y) * boardSize) / 8,
				scale: 1
			}),
			{
				duration: mounted ? curDuration : 0,
				easing: easingFuncs[draggableState?.transition.settings.easing ?? 'cubicInOut']
			}
		);

		curDuration = draggableState?.transition.enabled
			? draggableState.transition.settings.duration
			: 0;
	};

	const changeSize = (size: number) => {
		const newCoords = getGridCoordsFromSquare(square);

		coords.update(
			() => ({ x: (newCoords.x * size) / 8, y: ((7 - newCoords.y) * size) / 8, scale: 1 }),
			{
				duration: 0
			}
		);
	};

	const dropped = (e: CustomEvent) => {
		curDuration = 0;
		if (!e.detail) dispatch('deselect');
		if (square === e.detail) {
			if (!selected && canSelect(movableState, selectableState)) dispatch('select');
			else dispatch('deselect');
			selected = !selected;
		} else selected = false;
		if (canDrag(movableState, draggableState)) dispatch('endDragging', square + e.detail);
		if (square !== e.detail && e.detail) dispatch('move', square + e.detail);
	};

	const checkColor = (movable: MovableState) => {
		if (legalState?.enabled) {
			if (legalState.preMoves.enabled && getColorFromString(name) === movable.color) return true;
			if (
				movable.color === Color.WHITE &&
				legalState.whiteToMove &&
				getColorFromString(name) === Color.WHITE
			)
				return true;
			if (
				movable.color === Color.BLACK &&
				!legalState.whiteToMove &&
				getColorFromString(name) === Color.BLACK
			)
				return true;
			if (movable.color === Color.BOTH) {
				if (getColorFromString(name) === Color.WHITE && legalState.whiteToMove) return true;
				if (getColorFromString(name) === Color.BLACK && !legalState.whiteToMove) return true;
			}
			return false;
		}

		if (movable.color === getColorFromString(name) || movable.color === Color.BOTH) return true;
		return false;
	};

	const canDrag = (movable?: MovableState, draggable?: DraggableState) => {
		if (!movable?.enabled || !draggable?.enabled || !mouseEvents) return false;

		return checkColor(movable);
	};

	const canSelect = (movable?: MovableState, selectable?: SelectableState) => {
		if (!movable?.enabled || !selectable?.enabled || !mouseEvents) return false;

		return checkColor(movable);
	};

	const canCapture = (legal?: LegalState, movable?: MovableState, selectable?: SelectableState) => {
		if (!movable?.enabled || !selectable?.enabled || !mouseEvents) return false;

		if (legal?.enabled) {
			if (
				selectableState?.selectedPiece !== undefined &&
				selectableState?.selectedPiece?.square !== square &&
				(legal.moves.includes(selectableState.selectedPiece.square + square) ||
					legal.moves.includes(`${selectableState.selectedPiece.square + square}q`))
			) {
				return true;
			}
			if (
				selectableState?.selectedPiece !== undefined &&
				legal.preMoves.enabled &&
				getColorFromString(selectableState?.selectedPiece.name) === movable.color &&
				(legal.preMoves.moves.includes(selectableState.selectedPiece.square + square) ||
					legal.preMoves.moves.includes(`${selectableState.selectedPiece.square + square}q`))
			)
				return true;
			return false;
		}

		if (
			selectableState?.selectedPiece !== undefined &&
			selectableState?.selectedPiece?.square !== square
		)
			return true;
		return false;
	};

	const curPieceIsNotSelectedPiece = (piece: Piece | undefined) =>
		piece === undefined || piece.name !== name || piece.square !== square;

	onMount(() => {
		mounted = true;
	});

	$: canDragVar = canDrag(movableState, draggableState);
	$: canSelectVar = canSelect(movableState, selectableState);
	$: canCaptureVar = canCapture(legalState, movableState, selectableState);
	$: if (curPieceIsNotSelectedPiece(selectableState?.selectedPiece)) selected = false;
	$: flipped, reRenderPieces(square);
	$: changeSize(boardSize);
</script>

<div
	use:drag={{
		startSquare: square,
		mouseEvents,
		canDrag: canDragVar,
		canSelect: canSelectVar,
		canCapture: canCaptureVar,
		boardFlipped: flipped,
		duration: draggableState?.transition.enabled ? draggableState.transition.settings.duration : 0,
		easingFunc: easingFuncs[draggableState?.transition.settings.easing ?? 'cubicInOut'],
		coords
	}}
	on:dropped={dropped}
	on:clicked
	on:startMoving
	on:animationEnded
	on:captured
	on:canceled
	on:squareover={(e) => {
		dispatch('squareover', e.detail);
	}}
	style="translate: {$coords.x}px {$coords.y}px;{$coords.scale !== 1
		? ` scale: ${$coords.scale}`
		: ''}"
	class="{name}{name[0] === 'w' ? ' white' : ' black'}{isGhost
		? ' ghost'
		: ''}{!movableState?.enabled && !isGhost ? ' static' : ''}{!mounted
		? ' opacity-0'
		: ''}{canCaptureVar ? ' capture' : ''}"
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

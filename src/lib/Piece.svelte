<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { tweened } from 'svelte/motion';
	import * as easingFuncs from 'svelte/easing';
	import drag from './draggable';
	import getChessPieceImage from './chessPieceSVGs';
	import type { ChessPiece } from './chessTypes';
	import { Color } from './enums';
	import type MovableState from './state/movable';
	import type { Piece } from './state';
	import type DraggableState from './state/draggable';
	import type LegalState from './state/legal';

	export let square: string;
	export let name: ChessPiece;
	export let getGridCoordsFromSquare: (square: string) => { x: number; y: number };
	export let flipped: boolean;
	export let isGhost = false;

	export let draggableState: DraggableState | undefined = undefined;
	export let legalState: LegalState | undefined = undefined;
	export let movableState: MovableState | undefined = undefined;

	export let selectedPiece: Piece | undefined = undefined;
	let selected = false;

	const dispatch = createEventDispatcher();
	let curDuration = draggableState?.transition?.enabled ? draggableState.transition.settings.duration : 0;
	const coords = tweened(
		{ x: 0, y: 0, scale: 1 },
		{ duration: curDuration, easing: easingFuncs[draggableState?.transition.settings.easing ?? 'cubicInOut'] }
	);

	let initialized = false;

	const getColorFromString = (piece: ChessPiece) => (piece[0] === 'w' ? Color.WHITE : Color.BLACK);

	const reRenderPieces = (sq: string) => {
		const newCoords = getGridCoordsFromSquare(sq);

		coords.update(() => ({ x: newCoords.x, y: newCoords.y, scale: 1 }), {
			duration: initialized ? curDuration : 0,
			easing: easingFuncs[draggableState?.transition.settings.easing ?? 'cubicInOut']
		});

		if (!initialized) initialized = true;
		curDuration = draggableState?.transition.enabled ? draggableState.transition.settings.duration : 0;
	};

	const dropped = (e: CustomEvent) => {
		curDuration = 0;
		if (!e.detail) dispatch('deselect');
		if (square === e.detail) {
			if (!selected) dispatch('select');
			else dispatch('deselect');
			selected = !selected;
		} else selected = false;
		dispatch('endDragging', square + e.detail);
		if (square !== e.detail && e.detail) dispatch('move', square + e.detail);
	};

	const canMove = (movable?: MovableState) => {
		if (!movable?.enabled) return false;

		if (legalState?.enabled) {
			if (legalState.preMoves.enabled && getColorFromString(name) === movable.color) return true;
			if (movable.color === Color.WHITE && legalState.whiteToMove && getColorFromString(name) === Color.WHITE) return true;
			if (movable.color === Color.BLACK && !legalState.whiteToMove && getColorFromString(name) === Color.BLACK) return true;
			if (movable.color === Color.BOTH) {
				if (getColorFromString(name) === Color.WHITE && legalState.whiteToMove) return true;
				if (getColorFromString(name) === Color.BLACK && !legalState.whiteToMove) return true;
			}
			return false;
		}

		if (movable.color === getColorFromString(name) || movable.color === Color.BOTH) return true;
		return false;
	};

	const curPieceWasDeselected = (piece: Piece | undefined) => piece === undefined || piece.name !== name || piece.square !== square;

	$: if (curPieceWasDeselected(selectedPiece)) selected = false;
	$: flipped, reRenderPieces(square);
	$: pieceZIndex = typeof movableState === 'boolean' ? (movableState ? 2 : 1) : movableState?.enabled ? 2 : 1;
</script>

<img
	use:drag={{
		startSquare: square,
		onlyShow: !canMove(movableState),
		boardFlipped: flipped,
		duration: draggableState?.transition.enabled ? draggableState.transition.settings.duration : 0,
		easingFunc: easingFuncs[draggableState?.transition.settings.easing ?? 'cubicInOut'],
		coords
	}}
	on:dropped={dropped}
	on:clicked
	on:startMoving
	on:animationEnded
	on:moving={(e) => {
		dispatch('moving', e.detail);
	}}
	style="left: {$coords.x * 12.5}%; 
		bottom: {$coords.y * 12.5}%; 
		scale: {$coords.scale};
		z-Index: {isGhost ? 0 : pieceZIndex}; 
		opacity: {isGhost ? 0.3 : 1}; 
		cursor: pointer;"
	class="noselect"
	src={getChessPieceImage(name)}
	alt={name}
/>

<style>
	img {
		position: absolute;
		aspect-ratio: 1;
		width: 12.5%;
	}
</style>

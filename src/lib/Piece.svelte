<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { tweened } from 'svelte/motion';
	import * as easingFuncs from 'svelte/easing';
	import drag from './draggable';
	import getChessPieceImage from './chessPieceSVGs';
	import type { ChessPiece } from './chessTypes';
	import { Color } from './enums';
	import type { EasingFuncs } from './boardConfig';
	import type MovableState from './state/movable';
	import type { Piece } from './state';

	export let square: string;
	export let name: ChessPiece;
	export let getGridCoordsFromSquare: (square: string) => { x: number; y: number };
	export let flipped: boolean;
	export let legal: boolean;
	export let preMoves = false;
	export let whiteToMove = false;
	export let movableState: MovableState;
	export let ghostPiece = false;
	export let easing: EasingFuncs = 'cubicInOut';
	export let duration = 120;

	export let selectedPiece: Piece | undefined = undefined;
	let selected = false;

	const dispatch = createEventDispatcher();
	let curDuration = duration;
	const coords = tweened({ x: 0, y: 0, scale: 1 }, { duration: curDuration, easing: easingFuncs[easing] });

	let initialized = false;

	const getColorFromString = (piece: ChessPiece) => (piece[0] === 'w' ? Color.WHITE : Color.BLACK);

	const reRenderPieces = (sq: string) => {
		const newCoords = getGridCoordsFromSquare(sq);

		coords.update(() => ({ x: newCoords.x, y: newCoords.y, scale: 1 }), {
			duration: initialized ? curDuration : 0,
			easing: easingFuncs[easing]
		});

		if (!initialized) initialized = true;
		curDuration = duration;
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

	const canMove = (movable: MovableState) => {
		if (!movable.enabled) return false;

		if (legal) {
			if (preMoves && getColorFromString(name) === movable.color) return true;
			if (movable.color === Color.WHITE && whiteToMove && getColorFromString(name) === Color.WHITE) return true;
			if (movable.color === Color.BLACK && !whiteToMove && getColorFromString(name) === Color.BLACK) return true;
			if (movable.color === Color.BOTH) {
				if (getColorFromString(name) === Color.WHITE && whiteToMove) return true;
				if (getColorFromString(name) === Color.BLACK && !whiteToMove) return true;
			}
			return false;
		}

		if (movable.color === getColorFromString(name) || movable.color === Color.BOTH) return true;
		return false;
	};

	const curPieceWasDeselected = (piece: Piece | undefined) => piece === undefined || piece.name !== name || piece.square !== square;

	$: if (curPieceWasDeselected(selectedPiece)) selected = false;
	$: flipped, reRenderPieces(square);
	$: pieceZIndex = typeof movableState === 'boolean' ? (movableState ? 2 : 1) : movableState.enabled ? 2 : 1;
</script>

<img
	use:drag={{
		startSquare: square,
		onlyShow: !canMove(movableState),
		boardFlipped: flipped,
		duration,
		easingFunc: easingFuncs[easing],
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
		z-Index: {ghostPiece ? 0 : pieceZIndex}; 
		opacity: {ghostPiece ? 0.3 : 1}; 
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

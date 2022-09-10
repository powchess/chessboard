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

	export let square: string;
	export let name: ChessPiece;
	export let getGridCoordsFromSquare: (square: string) => { x: number; y: number };
	export let flipped: boolean;
	export let legal: boolean;
	export let whiteToMove = false;
	export let movable: MovableState;
	export let ghostPiece = false;
	export let easing: EasingFuncs = 'cubicInOut';
	export let duration = 120;

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
		dispatch('endDragging', e.detail);
		dispatch('move', square + e.detail);
	};

	const canMove = (_movable: MovableState) => {
		if (!_movable.enabled) return false;

		if (legal) {
			if (_movable.color === Color.WHITE && whiteToMove && getColorFromString(name) === Color.WHITE) return true;
			if (_movable.color === Color.BLACK && !whiteToMove && getColorFromString(name) === Color.BLACK) return true;
			if (_movable.color === Color.BOTH) {
				if (getColorFromString(name) === Color.WHITE && whiteToMove) return true;
				if (getColorFromString(name) === Color.BLACK && !whiteToMove) return true;
			}
			return false;
		}

		if (_movable.color === getColorFromString(name) || _movable.color === Color.BOTH) return true;
		return false;
	};

	$: flipped, reRenderPieces(square);
	$: pieceZIndex = typeof movable === 'boolean' ? (movable ? 1 : 0) : movable.enabled ? 1 : 0;
</script>

<img
	use:drag={{
		startSquare: square,
		onlyShow: !canMove(movable),
		boardFlipped: flipped,
		duration,
		easingFunc: easingFuncs[easing],
		coords
	}}
	on:dropped={dropped}
	on:clicked
	on:startMoving
	on:animationEnded
	on:moving={(e) => dispatch('moving', e.detail)}
	style="left:{$coords.x * 12.5}%;bottom:{$coords.y * 12.5}%; z-Index: {pieceZIndex}; opacity: {ghostPiece ? 0.3 : 1};"
	class="noselect {canMove(movable) ? 'cursor-pointer' : ''}"
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

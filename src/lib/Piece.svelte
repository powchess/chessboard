<script context="module" lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { tweened } from 'svelte/motion';
	import * as easingFuncs from 'svelte/easing';
	import drag from './draggable';
	import getChessPieceImage from './chessPieceSVGs';
	import type { ChessPiece } from './chessTypes';
	import { Color } from './enums';
	import type { EasingFuncs } from './boardConfig';

	type Movable = { enabled: boolean; color: Color.WHITE | Color.BLACK | Color.BOTH } | boolean;
</script>

<script lang="ts">
	export let square: string;
	export let name: ChessPiece;
	export let getGridCoordsFromSquare: (square: string) => { x: number; y: number };
	export let flipped: boolean;
	export let whiteToMove = false;
	export let movable: Movable;
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
			duration: initialized ? curDuration : 0
		});

		if (!initialized) initialized = true;
		curDuration = duration;
	};

	const dropped = (e: CustomEvent) => {
		curDuration = 0;
		dispatch('endDragging', e.detail);
		dispatch('move', square + e.detail);
	};

	const canMove = () =>
		movable === true ||
		(movable !== false &&
			movable.enabled &&
			(movable.color === getColorFromString(name) ||
				(movable.color === Color.BOTH &&
					((whiteToMove && getColorFromString(name) === Color.WHITE) || (!whiteToMove && getColorFromString(name) === Color.BLACK)))));

	// eslint-disable-next-line @typescript-eslint/no-unused-expressions, no-sequences
	$: flipped, reRenderPieces(square);
	$: pieceZIndex = typeof movable === 'boolean' ? (movable ? 1 : 0) : movable.enabled ? 1 : 0;
</script>

<img
	use:drag={{
		startSquare: square,
		onlyShow: !canMove(),
		boardFlipped: flipped,
		coords
	}}
	on:dropped={dropped}
	on:clicked
	on:startMoving
	on:animationEnded
	on:moving={(e) => dispatch('moving', e.detail)}
	style="left:{$coords.x * 12.5}%;bottom:{$coords.y * 12.5}%; z-Index: {pieceZIndex}; opacity: {ghostPiece ? 0.3 : 1};"
	class="noselect {canMove() ? 'cursor-pointer' : ''}"
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

<script lang="ts">
	import { tweened } from 'svelte/motion';
	import * as easingFuncs from 'svelte/easing';
	import { createEventDispatcher } from 'svelte';
	import { drag } from './draggable';
	import { getChessPieceImage } from './chessPieceSVGs';
	import type { ChessPiece } from './chessTypes';
	import { Color } from './enums';
	import type { EasingFuncs } from './boardConfig';

	const dispatch = createEventDispatcher();

	export let square: string;
	export let name: ChessPiece;
	export let getGridCoordsFromSquare: (square: string) => { x: number; y: number };
	export let flipped: boolean;
	export let whiteToMove: boolean = false;
	export let movable:
		| {
				enabled: boolean;
				color: Color.WHITE | Color.BLACK | Color.BOTH;
		  }
		| boolean;
	export let ghostPiece: boolean = false;
	export let easing: EasingFuncs = 'cubicInOut';

	export let duration = 120;

	let curDuration = duration;
	const coords = tweened({ x: 0, y: 0, scale: 1 }, { duration: curDuration, easing: easingFuncs[easing] });

	let initialized = false;

	const getColorFromString = (name: string) => {
		return name[0] === 'w' ? Color.WHITE : Color.BLACK;
	};

	const reRenderPieces = (sq: string, _flipped?: boolean) => {
		const newCoords = getGridCoordsFromSquare(sq);

		coords.update(
			() => {
				return { x: newCoords.x, y: newCoords.y, scale: 1 };
			},
			{
				duration: initialized ? curDuration : 0
			}
		);

		if (!initialized) initialized = true;
		curDuration = duration;
	};

	$: reRenderPieces(square, flipped);

	const dropped = (e: CustomEvent) => {
		curDuration = 0;
		dispatch('endDragging', e.detail);
		dispatch('move', square + e.detail);
	};

	const canMove = (movable: { enabled: boolean; color: Color.WHITE | Color.BLACK | Color.BOTH } | boolean, whiteToMove: boolean) => {
		return (
			movable === true ||
			(movable !== false &&
				movable.enabled &&
				(movable.color === getColorFromString(name) ||
					(movable.color === Color.BOTH &&
						((whiteToMove && getColorFromString(name) === Color.WHITE) || (!whiteToMove && getColorFromString(name) === Color.BLACK)))))
		);
	};
</script>

<img
	use:drag={{
		startSquare: square,
		onlyShow: !canMove(movable, whiteToMove),
		boardFlipped: flipped,
		coords
	}}
	on:dropped={dropped}
	on:clicked
	on:startMoving
	on:animationEnded
	on:moving={(e) => dispatch('moving', e.detail)}
	style="left:{$coords.x * 12.5}%;bottom:{$coords.y * 12.5}%;"
	class="noselect {ghostPiece ? 'opacity-40' : 'z-10'} {canMove(movable, whiteToMove) ? 'cursor-pointer' : ''}"
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

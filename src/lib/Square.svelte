<script lang="ts">
	import type { BoardTheme } from './boardConfig';
	import boardThemesStyles from './boardThemes/boardThemes';
	import type { ChessSquare } from './chessTypes';
	import type { SquareType } from './enums';

	export let square: ChessSquare;
	export let color: SquareType;
	export let getGridCoordsFromSquare: (square: ChessSquare) => { x: number; y: number };
	export let flipped: boolean;
	export let theme: BoardTheme;
	export let mouseEvents = true;
	export let boardSize: number;

	export let corner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | '' = '';

	let x: number;
	let y: number;

	const reRenderSquares = () => {
		const newCoords = getGridCoordsFromSquare(square);
		x = newCoords.x;
		y = newCoords.y;
	};

	$: flipped, reRenderSquares();
</script>

<div
	style="translate: {(x * boardSize) / 8}px {((7 - y) * boardSize) / 8}px;{corner
		? ` border-${corner}-radius: inherit;`
		: ''}"
	class="{boardThemesStyles.squareStyles[theme][color]}{!mouseEvents ? ' pointer-events-none' : ''}"
/>

<style>
	div {
		position: absolute;
		overflow: hidden;
		width: 12.5%;
		height: 12.5%;
		left: 0;
		top: 0;
	}

	.move {
		background: radial-gradient(
			ellipse at center,
			rgba(0, 0, 0, 0) 0,
			rgba(219, 141, 31, 0.7) 100%
		);
	}

	.move-db {
		background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0) 0, rgba(26, 61, 131, 0.7) 100%);
	}

	.check {
		background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0) 0, rgba(172, 4, 4, 0.6) 100%);
	}

	.select {
		background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0) 0, rgba(103, 73, 15, 0.4) 100%);
	}

	.select-db {
		background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0) 0, rgba(15, 56, 103, 0.4) 100%);
	}

	.nextMove {
		background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0) 0, rgba(27, 38, 187, 0.8) 100%);
	}

	.legal::before {
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background-color: rgba(83, 139, 19, 0.6);
		box-shadow: inset 0px 0px 1.5vmin 0px rgba(83, 139, 19, 0.9);
		transform: scale(0.4);
		transition: all 100ms ease-in-out;
	}

	.legal:hover::before,
	.legal:focus::before {
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 0;
		transform: scale(1);
		background-color: rgba(83, 139, 19, 0.1);
		box-shadow: inset 0px 0px 1.5vmin 0px rgba(83, 139, 19, 0.8);
	}

	.preMove::before {
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background-color: rgba(54, 52, 48, 0.8);
		box-shadow: inset 0px 0px 1.5vmin 0px rgba(54, 52, 48, 1);
		transform: scale(0.4);
		transition: all 100ms ease-in-out;
	}

	.preMove:hover::before,
	.preMove:focus::before {
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 0;
		transform: scale(1);
		background-color: rgba(54, 52, 48, 0.1);
		box-shadow: inset 0px 0px 1.5vmin 0px rgba(54, 52, 48, 0.8);
	}

	.preMove-h::before {
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: rgba(54, 52, 48, 0.1);
		box-shadow: inset 0px 0px 1.5vmin 0px rgba(54, 52, 48, 0.8);
		transition: all 100ms ease-in-out;
	}

	.legal-h::before {
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: rgba(83, 139, 19, 0.1);
		box-shadow: inset 0px 0px 1.5vmin 0px rgba(83, 139, 19, 0.8);
		transition: all 100ms ease-in-out;
	}
</style>

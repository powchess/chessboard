<script lang="ts">
	import type { BoardTheme } from './boardConfig';
	import boardThemesStyles from './boardThemes/boardThemes';
	import type { ChessSquare } from './chessTypes';
	import { SquareColor } from './enums';

	export let square: ChessSquare;
	export let color: SquareColor;
	export let getGridCoordsFromSquare: (square: ChessSquare) => { x: number; y: number };
	export let flipped: boolean;
	export let theme: BoardTheme;
	export let mouseEvents = true;

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
	style="left: {x * 12.5}%; bottom: {y * 12.5}%;"
	class="noselect {boardThemesStyles.squareStyles[theme][color]}{!mouseEvents ? ' pointer-events-none' : ''}{color === SquareColor.LEGAL ||
	color === SquareColor.LEGALHOVER ||
	color === SquareColor.PREMOVE ||
	color === SquareColor.PREMOVEHOVER
		? ' legal'
		: ''}"
/>

<style>
	div {
		position: absolute;
		width: 12.5%;
		height: 12.5%;
	}

	.legal {
		z-index: 2;
	}
</style>

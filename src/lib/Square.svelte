<script lang="ts">
	import type { BoardTheme } from './boardConfig';
	import boardThemesStyles from './boardThemes/boardThemes';
	import type { ChessSquare } from './chessTypes';
	import type { SquareColor } from './enums';

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
	class="noselect {boardThemesStyles.squareStyles[theme][color]}{!mouseEvents ? ' pointer-events-none' : ''}"
/>

<style>
	div {
		position: absolute;
		width: 12.5%;
		height: 12.5%;
	}
</style>

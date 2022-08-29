<script lang="ts">
	import { boardThemesStyles, type BoardThemes } from './boardThemes/boardThemes';
	import type { SquareColor } from './types/chessboard';

	export let square: string;
	export let color: SquareColor;
	export let getGridCoordsFromSquare: (square: string) => { x: number; y: number };
	export let flipped: boolean;
	export let theme: BoardThemes;

	let x: number, y: number;

	const reRenderSquares = (_flipped?: boolean) => {
		const newCoords = getGridCoordsFromSquare(square);

		x = newCoords.x;
		y = newCoords.y;
	};

	$: reRenderSquares(flipped);
</script>

<div
	style="left: {x * 12.5}%; bottom: {y * 12.5}%;"
	class="noselect absolute aspect-square w-[12.5%] max-w-[12.5vw] {boardThemesStyles.squareStyles[
		theme
	][color]}"
/>

<style>
	@import './boardThemes/themes.css';
</style>

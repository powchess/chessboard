<script lang="ts">
	import type { BoardThemes } from './boardConfig';

	import { boardThemesStyles } from './boardThemes/boardThemes';
	import type { SquareColor } from './enums';

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

<div style="left: {x * 12.5}%; bottom: {y * 12.5}%;" class="select-none {boardThemesStyles.squareStyles[theme][color]}" />

<style>
	@import './boardThemes/themes.css';
	div {
		position: absolute;
		width: 12.5%;
		height: 12.5%;
		max-width: 12.5vw;
		max-height: 12.5vw;
	}
</style>

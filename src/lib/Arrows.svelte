<script lang="ts">
	import { onMount } from 'svelte';
	import { drawComputerArrows, removeComupterArrows, type ArrowData } from './drawArrows';

	export let flipped = false;
	export let svg: SVGGElement;
	export let LshapeKnightMove = false;
	export let computerArrows: ArrowData[] = [];

	let mounted = false;

	$: redrawComputerArrows(computerArrows);

	onMount(() => {
		mounted = true;
		redrawComputerArrows(computerArrows);
	});

	function redrawComputerArrows(data: ArrowData[]) {
		if (!mounted) return;
		removeComupterArrows(svg);
		drawComputerArrows(svg, data, LshapeKnightMove);
	}

	const ArrowColors = ['green', 'red', 'blue', 'orange'] as const;
</script>

<svg xmlns="http://www.w3.org/2000/svg" style="transform: rotate({flipped ? '180deg' : '0deg'})" class="rounded" viewBox="0 0 8 8">
	<defs>
		{#each ArrowColors as color}
			<marker
				id="start-{color[0]}"
				viewBox="0 0 5 20"
				refX="4"
				refY="10"
				markerUnits="strokeWidth"
				markerWidth="0.5"
				markerHeight="1"
				orient="auto"
			>
				<path fill={color} d="M 5 0 Q 0 0 0 5 L 0 15 Q 0 20 5 20 Z" />
			</marker>
			<marker id="end-{color[0]}" viewBox="0 0 10 20" refX="0.2" refY="10" markerUnits="strokeWidth" orient="auto" fill="currentColor">
				<path fill={color} d="M 0 4 L 10 10 L 0 16 Z" />
			</marker>
		{/each}
	</defs>
	<g bind:this={svg} />
</svg>

<style>
	svg {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		z-index: 2;
		pointer-events: none;
	}
</style>

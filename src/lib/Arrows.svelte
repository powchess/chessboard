<script lang="ts">
	import { onMount } from 'svelte';
	import {
		drawTools,
		removeComputerArrows,
		type ArrowTool,
		type CircleTool
	} from './drawArrows.js';

	export let flipped = false;
	export let svg: SVGGElement;
	export let knightLShape = false;
	export let tools: (CircleTool | ArrowTool)[] = [];

	let mounted = false;

	function redrawTools(data: (CircleTool | ArrowTool)[]) {
		if (!mounted) return;
		removeComputerArrows(svg);
		drawTools(svg, data, knightLShape);
	}

	$: redrawTools(tools);

	onMount(() => {
		mounted = true;
		redrawTools(tools);
	});

	const ArrowColors = ['green', 'red', 'blue', 'orange'] as const;
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	style="transform: rotate({flipped ? '180deg' : '0deg'})"
	viewBox="0 0 8 8"
>
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
				<path fill={color} d="M 0 5 v 10 c 0 2.8 2.2 5 5 5 L 6 20 V 0 L 5 0 C 2.2 0 0 2.2 0 5 z" />
			</marker>
			<marker
				id="end-{color[0]}"
				viewBox="0 0 12 16"
				refX="1"
				refY="8"
				markerUnits="strokeWidth"
				markerWidth="3"
				markerHeight="3.5"
				orient="auto"
				fill="currentColor"
			>
				<path fill={color} d="M 11.192 8 L 0.8 0 L 0.8 16 Z" />
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
		z-index: 3;
		pointer-events: none;
	}
</style>

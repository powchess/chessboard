<script lang="ts">
	import { slide } from 'svelte/transition';
	import { EasingFuncsArray } from '$lib/boardConfig.js';
	import Section from './Section.svelte';

	export let name = 'Draggable';
	export let enabled = false;
	export let ghostPiece = false;
	export let transition = false;
	export let duration = 120;
	export let easing = 'easeInOut';
	export let clickMoveAnimation = true;

	export let expanded = false;
</script>

<Section {name} bind:enabled {expanded}>
	<div class="mb-2">
		<input id="ghostPiece" type="checkbox" bind:checked={ghostPiece} />
		<label for="ghostPiece" class="select-none">ghost piece</label>
	</div>
	<div class="mb-2">
		<input id="draggableEnabled" type="checkbox" bind:checked={transition} />
		<label for="draggableEnabled" class="select-none">transition</label>
	</div>
	{#if transition}
		<div class="pl-2 pr-4 flex-col" transition:slide|local>
			<div class="flex gap-2 mb-2">
				<input id="transitionDuration" type="number" class="w-16" bind:value={duration} />
				<label for="transitionDuration" class="select-none">duration</label>
			</div>
			<div class="flex gap-2 mb-2">
				<select id="easingFuncs" bind:value={easing}>
					{#each EasingFuncsArray as easingFunc}
						<option value={easingFunc}>{easingFunc}</option>
					{/each}
				</select>
				<label for="easingFuncs" class="select-none">easing</label>
			</div>
			<div class="flex gap-2">
				<input id="clickMoveAnimation" type="checkbox" bind:checked={clickMoveAnimation} />
				<label for="clickMoveAnimation" class="select-none">Click-Move Animation</label>
			</div>
		</div>
	{/if}
</Section>

<style>
	select {
		color: black;
		border-radius: 0.125rem;
		padding-left: 4px;
		padding-top: 2px;
		padding-bottom: 2px;
	}

	input {
		color: black;
		border-radius: 0.125rem;
		padding-left: 4px;
		padding-top: 2px;
		padding-bottom: 2px;
	}
</style>

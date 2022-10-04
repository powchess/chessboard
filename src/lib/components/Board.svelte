<script lang="ts">
	import { slide } from 'svelte/transition';
	import { BoardThemes, type BoardTheme } from '$lib/boardConfig';
	import Section from './Section.svelte';

	export let name = 'Board';
	export let boardTheme: BoardTheme;
	export let mouseEvents: boolean;
	export let notation: boolean;
	export let flipped: boolean;
	export let shadow: boolean;
	export let borderRadius: `${number}rem` | `${number}px` = '0px';
	export let resizible = false;
	export let min = 0;
	export let max = 0;

	export let expanded = false;

	let style = true;
	let bR: number = parseFloat(borderRadius.endsWith('px') ? borderRadius.slice(0, -2) : borderRadius.slice(0, -3));

	$: borderRadius = `${bR ?? 0}rem` as `${number}rem`;
</script>

<Section {name} {expanded}>
	<div class="mb-2">
		<select bind:value={boardTheme}>
			{#each BoardThemes as theme}
				<option value={theme}>{theme}</option>
			{/each}
		</select>
		<label for="boardTheme" class="select-none">board theme</label>
	</div>

	<div class="mb-2">
		<input id="mouseEvents" type="checkbox" bind:checked={mouseEvents} />
		<label for="mouseEvents" class="select-none">mouseEvents</label>
	</div>

	<div class="mb-2">
		<input id="notation" type="checkbox" bind:checked={notation} />
		<label for="notation" class="select-none">notation</label>
	</div>

	<div class="mb-2">
		<input id="flipped" type="checkbox" bind:checked={flipped} />
		<label for="flipped" class="select-none">flipped</label>
	</div>

	<div>
		<input id="styleEnabled" type="checkbox" bind:checked={style} />
		<label for="styleEnabled" class="select-none">style</label>
	</div>
	{#if style}
		<div class="pl-2 pr-4 flex-col" transition:slide|local>
			<div class="flex gap-2 mb-2">
				<input id="shadow" type="checkbox" bind:checked={shadow} />
				<label for="shadow" class="select-none">shadow</label>
			</div>
			<div class="flex gap-2 mb-2">
				<input id="borderRadius" type="number" class="w-16" min={0} max={1} bind:value={bR} />
				<label for="borderRadius" class="select-none whitespace-nowrap">border-radius (rem)</label>
			</div>
		</div>
	{/if}
	<div class="mt-2 mb-1">
		<input id="resizibleEnabled" type="checkbox" bind:checked={resizible} />
		<label for="resizibleEnabled" class="select-none">resizible</label>
	</div>
	{#if resizible}
		<div class="pl-2 pr-4 flex-col" transition:slide|local>
			<div class="flex gap-2 mb-2">
				<input id="resizibleMin" type="number" class="w-16" bind:value={min} />
				<label for="resizibleMin" class="select-none">min</label>
			</div>
			<div class="flex gap-2">
				<input id="resizibleMax" type="number" class="w-16" bind:value={max} />
				<label for="resizibleMax" class="select-none">max</label>
			</div>
		</div>
	{/if}
</Section>

<style>
	input {
		color: black;
		border-radius: 0.125rem;
		padding-left: 4px;
		padding-top: 2px;
		padding-bottom: 2px;
	}

	select {
		color: black;
		border-radius: 0.125rem;
		padding-left: 4px;
		padding-top: 2px;
		padding-bottom: 2px;
	}
</style>

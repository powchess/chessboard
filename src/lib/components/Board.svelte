<script lang="ts">
	import { BoardThemes, type BoardTheme } from '$lib/boardConfig';
	import Section from './Section.svelte';

	export let name = 'Board';
	export let boardTheme: BoardTheme;
	export let mouseEvents: boolean;
	export let notation: boolean;
	export let flipped: boolean;
	export let resizible = false;

	export let expanded = false;
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

	<div class="mt-2 mb-1">
		<input id="resizibleEnabled" type="checkbox" bind:checked={resizible} />
		<label for="resizibleEnabled" class="select-none">resizible</label>
	</div>
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

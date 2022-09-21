<script lang="ts">
	import { BoardThemes, type BoardTheme } from '$lib/boardConfig';
	import Section from './Section.svelte';

	export let name = 'Board';
	export let boardTheme: BoardTheme;
	export let notation: boolean;
	export let flipped: boolean;
	export let shadow: boolean;

	export let expanded = false;
</script>

<Section {name} {expanded}>
	<div>
		<select bind:value={boardTheme}>
			{#each BoardThemes as theme}
				<option value={theme}>{theme}</option>
			{/each}
		</select>
		<label for="boardTheme" class="select-none">board theme</label>
	</div>

	<div>
		<input id="notation" type="checkbox" bind:checked={notation} />
		<label for="notation" class="select-none">notation</label>
	</div>

	<div>
		<input id="flipped" type="checkbox" bind:checked={flipped} />
		<label for="flipped" class="select-none">flipped</label>
	</div>

	<div>
		<input id="shadow" type="checkbox" bind:checked={shadow} />
		<label for="shadow" class="select-none">shadow</label>
	</div>
</Section>

<style>
	input {
		color: black;
	}

	select {
		color: black;
	}
</style>

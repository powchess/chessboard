<script lang="ts">
	import Section from './Section.svelte';

	export let name = 'DrawTools';
	export let enabled = false;
	export let knightLShape = false;
	export let onlyChessMove = false;

	export let expanded = false;
</script>

<Section {name} bind:enabled {expanded}>
	<div>
		<input id="knightLShapeMoveEnabled" type="checkbox" bind:checked={knightLShape} />
		<label for="knightLShapeMoveEnabled" class="select-none">L shape knight move</label>
	</div>
	<div>
		<input id="onlyChessMoveEnabled" type="checkbox" bind:checked={onlyChessMove} />
		<label for="onlyChessMoveEnabled" class="select-none">only chess move</label>
	</div>
</Section>

<style>
	input {
		color: black;
	}
</style>

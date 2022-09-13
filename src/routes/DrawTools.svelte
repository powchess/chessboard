<script lang="ts">
	import Section from './Section.svelte';

	export let name = 'DrawTools';
	export let enabled = false;

	export let LshapeKnightMove = false;
	export let onlyChessMove = false;
</script>

<Section {name} bind:enabled>
	<div>
		<input id="LshapeKnightMoveEnabled" type="checkbox" bind:checked={LshapeKnightMove} />
		<label for="LshapeKnightMoveEnabled" class="select-none">L shape knight move</label>
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

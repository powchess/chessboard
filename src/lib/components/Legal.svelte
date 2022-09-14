<script lang="ts">
	import Section from './Section.svelte';

	export let name = 'Legal';
	export let enabled = false;

	export let preMovesEnabled = false;
</script>

<Section {name} bind:enabled>
	<div>
		<input id="preMovesEnabled" type="checkbox" bind:checked={preMovesEnabled} />
		<label for="preMovesEnabled" class="select-none">preMoves</label>
	</div>
</Section>

<style>
	input {
		color: black;
	}
</style>

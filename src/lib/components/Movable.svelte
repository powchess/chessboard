<script lang="ts">
	import { Color } from '$lib/enums';
	import Section from './Section.svelte';

	export let name = 'Movable';
	export let enabled = false;
	export let color: Color;

	export let expanded = false;
</script>

<Section {name} bind:enabled {expanded}>
	<div>
		<select bind:value={color}>
			<option value={Color.BOTH}>Both</option>
			<option value={Color.WHITE}>White</option>
			<option value={Color.BLACK}>Black</option>
		</select>
	</div>
</Section>

<style>
	select {
		color: black;
	}
</style>

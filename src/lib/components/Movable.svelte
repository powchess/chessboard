<script lang="ts">
	import type { Color } from '$lib/enums.js';
	import Section from './Section.svelte';

	export let name = 'Movable';
	export let enabled = false;
	export let color: Color;

	export let expanded = false;
</script>

<Section {name} bind:enabled {expanded}>
	<div>
		<select bind:value={color}>
			<option value="BOTH">Both</option>
			<option value="WHITE">White</option>
			<option value="BLACK">Black</option>
		</select>
	</div>
</Section>

<style>
	select {
		color: black;
		border-radius: 0.125rem;
		padding-left: 4px;
		padding-top: 2px;
		padding-bottom: 2px;
	}
</style>

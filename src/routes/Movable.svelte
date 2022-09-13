<script lang="ts">
	import { Color } from '$lib/enums';
	import Section from './Section.svelte';

	export let name = 'Movable';
	export let enabled = false;
	export let color: Color;
</script>

<Section {name} bind:enabled>
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

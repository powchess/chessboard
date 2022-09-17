<script lang="ts">
	import type SoundsState from '$lib/state/sounds';
	import Section from './Section.svelte';

	export let name = 'Sounds';
	export let enabled = false;
	export let settings: SoundsState['settings'];

	const soundsNames = ['MOVE', 'CAPTURE', 'CASTLE', 'UNDO'] as const;
</script>

<Section {name} bind:enabled>
	{#each soundsNames as sound}
		<div>
			<input id="{sound}Enabled" type="checkbox" bind:checked={settings[sound]} />
			<label for="{sound}Enabled" class="select-none">{sound}</label>
		</div>
	{/each}
</Section>

<style>
	input {
		color: black;
		user-select: none;
	}
</style>

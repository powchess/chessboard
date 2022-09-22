<script lang="ts">
	import type SoundsState from '$lib/state/sounds';
	import Section from './Section.svelte';

	export let name = 'Sounds';
	export let enabled = false;
	export let settings: SoundsState['settings'];

	const soundsNames = ['MOVE', 'CAPTURE', 'CASTLE', 'UNDO'] as const;

	export let expanded = false;
</script>

<Section {name} bind:enabled {expanded}>
	{#each soundsNames as sound}
		<div class="mb-2">
			<input id="{sound}Enabled" type="checkbox" bind:checked={settings[sound]} />
			<label for="{sound}Enabled" class="select-none">{sound.toLowerCase()}</label>
		</div>
	{/each}
</Section>

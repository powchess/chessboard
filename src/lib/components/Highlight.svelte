<script lang="ts">
	import type HighlightState from '$lib/state/highlight.js';
	import Section from './Section.svelte';

	export let name = 'Highlight';
	export let enabled = false;
	export let settings: HighlightState['settings'];

	const highlightNames = ['select', 'legal', 'move', 'preMove', 'nextMove', 'check'] as const;

	export let expanded = false;
</script>

<Section {name} bind:enabled {expanded}>
	{#each highlightNames as highlight}
		<div class="mb-2">
			<input id="{highlight}Enabled" type="checkbox" bind:checked={settings[highlight]} />
			<label for="{highlight}Enabled" class="select-none">{highlight}</label>
		</div>
	{/each}
</Section>

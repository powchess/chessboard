<script lang="ts">
	import Section from './Section.svelte';

	export let name = 'Legal';
	export let enabled = false;
</script>

<Section {name} bind:enabled on:changed showExpand={false} />

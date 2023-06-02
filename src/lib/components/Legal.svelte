<script lang="ts">
	import Section from './Section.svelte';

	export let name = 'Legal';
	export let enabled = false;

	export let allowCastling: boolean;
	export let allowEnPassant: boolean;
</script>

<Section {name} bind:enabled on:changed showExpand={true}>
	<div class="mb-2">
		<input id="allowCastling" type="checkbox" bind:checked={allowCastling} />
		<label for="allowCastling" class="select-none">allow Castling</label>
	</div>
	<div class="mb-2">
		<input id="allowEnPassant" type="checkbox" bind:checked={allowEnPassant} />
		<label for="allowEnPassant" class="select-none">allow EnPassant</label>
	</div>
</Section>

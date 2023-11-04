<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import './assets/pieces.css';

	export let name: string;
	export let url: string | undefined = undefined;

	const dispatch = createEventDispatcher();

	const handleMouseMove = (e: MouseEvent) => {
		dispatch('mousemove', { name, primaryEvent: e });
	};

	const handleMouseUp = (e: MouseEvent) => {
		dispatch('mouseup', { name, primaryEvent: e });

		window.removeEventListener('mousemove', handleMouseMove);
		window.removeEventListener('mouseup', handleMouseUp);
	};

	const handleMouseDown = (e: MouseEvent) => {
		dispatch('mousedown', { name, primaryEvent: e });

		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', handleMouseUp);
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	role="button"
	tabindex="0"
	on:click
	on:mousedown={handleMouseDown}
	style={url ? `background: url(${url});` : ''}
	class={name}
/>

<style>
	div {
		-webkit-touch-callout: none; /* iOS Safari */
		-webkit-user-select: none; /* Safari */
		-khtml-user-select: none; /* Konqueror HTML */
		-moz-user-select: none; /* Old versions of Firefox */
		-ms-user-select: none; /* Internet Explorer/Edge */
		user-select: none; /* Non-prefixed version, currently supported by Chrome, Opera and Firefox */
		touch-action: none;
		position: absolute;
		left: 0;
		top: 0;
		aspect-ratio: 1 / 1;
		width: 100%;
		background-size: 100% 100% !important;
		will-change: transform;
		cursor: pointer;
	}
</style>

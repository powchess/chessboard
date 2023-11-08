<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import './assets/pieces.css';

	export let name: string;
	export let url: string | undefined = undefined;

	const dispatch = createEventDispatcher();

	const handleMouseMove = (e: MouseEvent) => {
		dispatch('mousemove', { name, url, primaryEvent: e });
	};

	const handleMouseUp = (e: MouseEvent) => {
		dispatch('mouseup', { name, url, primaryEvent: e });

		window.removeEventListener('mousemove', handleMouseMove);
		window.removeEventListener('mouseup', handleMouseUp);
	};

	const handleMouseDown = (e: MouseEvent) => {
		dispatch('mousedown', { name, url, primaryEvent: e });

		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', handleMouseUp);
	};

	const handleClick = (e: MouseEvent) => {
		dispatch('click', { name, url, primaryEvent: e });
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	role="button"
	tabindex="0"
	on:click={handleClick}
	on:mousedown={handleMouseDown}
	style={url ? `background: url(${url});` : ''}
	class={name}
/>

<style>
	div {
		width: 100%;
		height: 100%;
		background-size: 100% 100% !important;
		will-change: transform;
		cursor: pointer;
	}
</style>

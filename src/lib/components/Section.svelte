<script lang="ts">
	import { slide } from 'svelte/transition';

	export let name = 'board';
	// eslint-disable-next-line no-undef-init
	export let enabled: boolean | undefined = undefined;
	export let showExpand = true;

	let expanded = false;
</script>

<div class="bg-slate-900/20 rounded shadow-lg flex flex-col">
	<button
		on:click={() => {
			expanded = !expanded;
		}}
		class="flex justify-between px-4 py-2 {showExpand ? 'transition hover:bg-slate-800/40' : ''} rounded"
		disabled={!showExpand}
	>
		<div class="flex gap-1">
			{#if enabled !== undefined}
				<input type="checkbox" bind:checked={enabled} class="mr-1" />
			{/if}
			<span class={enabled === undefined ? 'ml-[21px]' : ''}>{name}</span>
		</div>
		{#if showExpand}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="w-5 h-5 transition {expanded ? 'rotate-180' : 'rotate-0'}"
			>
				<path
					fill-rule="evenodd"
					d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
					clip-rule="evenodd"
				/>
			</svg>
		{/if}
	</button>

	{#if expanded}
		<div class="py-2 px-4" transition:slide|local>
			<slot />
		</div>
	{/if}
</div>

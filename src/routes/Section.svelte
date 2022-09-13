<script lang="ts">
	import { slide } from 'svelte/transition';

	export let name = 'board';
	// eslint-disable-next-line no-undef-init
	export let enabled: boolean | undefined = undefined;
	export let showExpand = true;

	let expanded = false;
</script>

<div class="bg-slate-900/20 rounded shadow-lg p-2 pl-4 flex flex-col">
	<div class="flex justify-between mb-1">
		<div class="flex gap-1">
			{#if enabled !== undefined}
				<input type="checkbox" bind:checked={enabled} class="mr-1" />
			{/if}
			<span class={enabled === undefined ? 'ml-[21px]' : ''}>{name}</span>
		</div>
		{#if showExpand}
			<button
				on:click={() => {
					expanded = !expanded;
				}}
				class="rounded-full hover:bg-slate-600 transition"
			>
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
			</button>
		{/if}
	</div>

	{#if expanded}
		<div class="pb-2" transition:slide|local>
			<slot />
		</div>
	{/if}
</div>

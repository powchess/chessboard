<script lang="ts">
	export let copyText: string;

	let button: HTMLButtonElement;
	let copied = false;

	function copyToClipboard() {
		navigator.clipboard.writeText(copyText);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 2000);
		button.setAttribute('data-cooltipz-dir', 'top');
		button.setAttribute('aria-label', 'Copied!');
		setTimeout(() => {
			button.removeAttribute('aria-label');
			button.removeAttribute('data-cooltipz-dir');
		}, 2000);
	}
</script>

<button
	type="button"
	bind:this={button}
	on:click={copyToClipboard}
	class="box-border rounded-sm bg-slate-800 bg-opacity-40 text-gray-500 transition hover:text-gray-300 focus:z-10 focus:ring-1 focus:ring-blue-600 p-1"
>
	{#if copied}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-5 text-green-500"
			fill="none"
			viewBox="0 0 24 24"
			aria-hidden="true"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
			/>
		</svg>
	{:else}
		<svg
			style="transform: translate(1px, 0px);"
			xmlns="http://www.w3.org/2000/svg"
			class="h-5"
			fill="none"
			viewBox="0 0 24 24"
			aria-hidden="true"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
			/>
		</svg>
	{/if}
</button>

<script lang="ts">
	import { onDestroy } from 'svelte';

	export let copyText: string;

	let copied = false;
	let resetTimer: ReturnType<typeof setTimeout> | undefined;

	async function copyToClipboard() {
		await navigator.clipboard.writeText(copyText);
		copied = true;
		if (resetTimer) clearTimeout(resetTimer);
		resetTimer = setTimeout(() => {
			copied = false;
		}, 2000);
	}

	onDestroy(() => {
		if (resetTimer) clearTimeout(resetTimer);
	});
</script>

<button
	type="button"
	on:click={copyToClipboard}
	class="copy-button"
	class:copied
	aria-label={copied ? 'Code copied' : 'Copy code'}
>
	{#if copied}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			aria-hidden="true"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="1.8"
				d="m6.5 12.5 3.4 3.4 7.6-7.6"
			/>
		</svg>
	{:else}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			aria-hidden="true"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="1.7"
				d="M9 8.5V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-1.5M7 9h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z"
			/>
		</svg>
	{/if}
	<span aria-live="polite">{copied ? 'Copied' : 'Copy code'}</span>
</button>

<style>
	.copy-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.42rem;
		height: 2rem;
		min-width: 6.1rem;
		padding: 0 0.7rem;
		border: 1px solid rgba(148, 163, 184, 0.16);
		border-radius: 0.6rem;
		background: rgba(255, 255, 255, 0.055);
		color: #a7b2c2;
		font-size: 0.72rem;
		font-weight: 650;
		letter-spacing: 0.01em;
		transition:
			border-color 150ms ease,
			background 150ms ease,
			color 150ms ease,
			transform 150ms ease;
	}

	.copy-button:hover {
		border-color: rgba(148, 163, 184, 0.3);
		background: rgba(255, 255, 255, 0.09);
		color: #f1f5f9;
	}

	.copy-button.copied {
		border-color: rgba(52, 211, 153, 0.26);
		background: rgba(16, 185, 129, 0.11);
		color: #6ee7b7;
	}

	.copy-button:active {
		transform: scale(0.95);
	}
	.copy-button:focus-visible {
		outline: 2px solid #38bdf8;
		outline-offset: 2px;
	}
	.copy-button svg {
		width: 0.95rem;
		height: 0.95rem;
		flex: 0 0 auto;
	}
</style>

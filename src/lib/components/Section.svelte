<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	export let name = 'board';
	export let enabled: boolean | undefined = undefined;
	export let showExpand = true;
	export let expanded = false;
</script>

<section class:disabled={enabled === false} class="control-section">
	<div class="section-header">
		{#if enabled !== undefined}
			<label class="switch" aria-label={`Enable ${name}`}>
				<input
					on:change={() => dispatch('changed', enabled)}
					type="checkbox"
					bind:checked={enabled}
				/>
				<span class="switch-track" aria-hidden="true"><span></span></span>
			</label>
		{/if}

		{#if showExpand}
			<button
				type="button"
				class="section-trigger"
				on:click={() => {
					expanded = !expanded;
				}}
				aria-expanded={expanded}
			>
				<span>{name}</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class:expanded
					aria-hidden="true"
				>
					<path
						fill-rule="evenodd"
						d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		{:else}
			<span class="section-label">{name}</span>
		{/if}
	</div>

	{#if expanded}
		<div class="section-content" transition:slide|local={{ duration: 160 }}>
			<slot />
		</div>
	{/if}
</section>

<style>
	.control-section {
		border: 1px solid rgba(148, 163, 184, 0.12);
		border-radius: 0.9rem;
		background: rgba(255, 255, 255, 0.035);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.025);
		transition:
			border-color 160ms ease,
			background 160ms ease,
			opacity 160ms ease;
	}

	.control-section:hover {
		border-color: rgba(148, 163, 184, 0.2);
		background: rgba(255, 255, 255, 0.05);
	}

	.control-section.disabled {
		opacity: 0.62;
	}

	.section-header {
		display: flex;
		align-items: center;
		min-height: 3rem;
		padding: 0 0.9rem;
	}

	.section-trigger {
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: space-between;
		align-self: stretch;
		min-width: 0;
		padding: 0 0 0 0.65rem;
		color: #e5e7eb;
		font-size: 0.875rem;
		font-weight: 600;
		letter-spacing: 0.01em;
		text-align: left;
	}

	.section-trigger:first-child {
		padding-left: 0;
	}

	.section-trigger svg {
		width: 1.1rem;
		height: 1.1rem;
		color: #64748b;
		transition:
			transform 180ms ease,
			color 180ms ease;
	}

	.section-trigger:hover svg {
		color: #a7b2c2;
	}
	.section-trigger svg.expanded {
		transform: rotate(180deg);
	}

	.section-label {
		padding-left: 0.65rem;
		color: #e5e7eb;
		font-size: 0.875rem;
		font-weight: 600;
		letter-spacing: 0.01em;
	}

	.switch {
		position: relative;
		display: inline-flex;
		flex: 0 0 auto;
		cursor: pointer;
	}

	.switch input {
		position: absolute;
		width: 1px;
		height: 1px;
		opacity: 0;
	}

	.switch-track {
		display: flex;
		align-items: center;
		width: 2rem;
		height: 1.15rem;
		padding: 0.15rem;
		border: 1px solid rgba(148, 163, 184, 0.18);
		border-radius: 999px;
		background: #293241;
		transition:
			background 160ms ease,
			border-color 160ms ease;
	}

	.switch-track span {
		width: 0.72rem;
		height: 0.72rem;
		border-radius: 50%;
		background: #94a3b8;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
		transition:
			transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1),
			background 160ms ease;
	}

	.switch input:checked + .switch-track {
		border-color: rgba(52, 211, 153, 0.38);
		background: rgba(16, 185, 129, 0.3);
	}

	.switch input:checked + .switch-track span {
		transform: translateX(0.82rem);
		background: #6ee7b7;
	}

	.switch input:focus-visible + .switch-track {
		outline: 2px solid #38bdf8;
		outline-offset: 2px;
	}

	.section-content {
		padding: 0.15rem 0.9rem 0.9rem;
		color: #aeb8c7;
		font-size: 0.8rem;
	}
</style>

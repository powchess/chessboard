<script lang="ts">
	import { fly } from 'svelte/transition';
	import PromotionPiece from './PromotionPiece.svelte';

	let showModal = false;
	let isWhite: boolean;
	export let className = '';

	export function openPromotionModal(whiteToMove: boolean) {
		showModal = true;
		if (whiteToMove) isWhite = true;
		else isWhite = false;
	}
</script>

{#if showModal}
	<div class="modal {className}">
		<div
			in:fly={{ x: 100, duration: 300 }}
			out:fly={{ x: -200, duration: 100 }}
			class="modal-content"
		>
			{#each ['q', 'r', 'b', 'n'] as piece}
				<PromotionPiece {piece} bind:isWhite bind:showModal on:newPromotion />
			{/each}
		</div>
	</div>
{/if}

<style>
	.modal {
		display: flex;
		z-index: 10000;
		position: absolute;
		justify-content: center;
		align-items: center;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		direction: ltr;
		border-radius: inherit;
	}

	.modal-content {
		padding: 0.75rem;
		gap: 0.75rem;
		z-index: 9999999;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		width: 70%;
		height: 19%;
		background: rgb(51, 65, 85);
		border-radius: 1vmin;
	}
</style>

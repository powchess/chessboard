<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	// import getChessPieceImage from './chessPieceSVGs';
	import type { ChessPiece } from './chessTypes';

	export let piece: string;
	export let isWhite: boolean;
	export let showModal: boolean;

	const dispatch = createEventDispatcher();
	const pieceName = ((isWhite ? 'w' : 'b') + piece.toUpperCase()) as ChessPiece;

	const makePromotion = () => {
		dispatch('newPromotion', piece);
		showModal = false;
	};
</script>

<button on:click={makePromotion}>
	<div class="piece {pieceName}" />
</button>

<style>
	button {
		position: relative;
		height: 100%;
		aspect-ratio: 1 / 1;
	}
	div {
		height: 100%;
		width: 100%;
		background-size: cover;
	}

	button {
		border-radius: 0.375rem;
		border-width: 1px;
		border-color: rgb(145, 149, 155);
	}

	@media (hover: hover) {
		button:hover {
			border-color: rgb(2 132 199 / 1);
		}
	}
</style>

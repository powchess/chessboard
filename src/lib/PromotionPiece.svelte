<script lang="ts">
	import { createEventDispatcher } from 'svelte';
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
		background-size: 100% 100% !important;
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

	.bP {
		background: url('/images/pieces/bP.svg');
	}

	.wP {
		background: url('/images/pieces/wP.svg');
	}

	.bR {
		background: url('/images/pieces/bR.svg');
	}

	.wR {
		background: url('/images/pieces/wR.svg');
	}

	.bN {
		background: url('/images/pieces/bN.svg');
	}

	.wN {
		background: url('/images/pieces/wN.svg');
	}

	.bB {
		background: url('/images/pieces/bB.svg');
	}

	.wB {
		background: url('/images/pieces/wB.svg');
	}

	.bQ {
		background: url('/images/pieces/bQ.svg');
	}

	.wQ {
		background: url('/images/pieces/wQ.svg');
	}

	.bK {
		background: url('/images/pieces/bK.svg');
	}

	.wK {
		background: url('/images/pieces/wK.svg');
	}
</style>

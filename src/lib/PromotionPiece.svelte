<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import getChessPieceImage from './chessPieceSVGs';
	import type { ChessPiece } from './chessTypes';

	export let piece: string;
	export let isWhite: boolean;
	export let showModal: boolean;

	const dispatch = createEventDispatcher();
	const pieceName = ((isWhite ? 'w' : 'b') + piece.toUpperCase()) as ChessPiece;
	const pieceSrc = getChessPieceImage(pieceName);

	const makePromotion = () => {
		dispatch('newPromotion', piece);
		showModal = false;
	};
</script>

<button on:click={makePromotion}>
	<img src={pieceSrc} alt="Promotion to {piece.toUpperCase()}" />
</button>

<style>
	img {
		border-radius: 0.375rem;
		border-width: 1px;
		border-color: rgb(209 213 219 / 1);
	}

	img::hover {
		border-color: rgb(2 132 199 / 1);
		background-color: rgb(75 85 99 / 1);
	}
</style>

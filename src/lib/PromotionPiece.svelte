<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { getChessPieceImage } from './chessPieceSVGs';
	import type { ChessPiece } from './types/chess';

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
	<img
		src={pieceSrc}
		alt="Promotion to {piece.toUpperCase()}"
		class="rounded-md border border-gray-300 hover:border-sky-600 hover:bg-gray-600"
	/>
</button>

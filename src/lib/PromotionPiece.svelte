<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { ChessPiece } from './chessTypes.js';
	import './assets/pieces.css';

	export let piece: string;
	export let isWhite: boolean;

	const dispatch = createEventDispatcher();
	const names: Record<string, string> = {
		q: 'queen',
		r: 'rook',
		b: 'bishop',
		n: 'knight'
	};
	$: pieceName = ((isWhite ? 'w' : 'b') + piece.toUpperCase()) as ChessPiece;
</script>

<button
	type="button"
	role="menuitem"
	on:click={() => dispatch('newPromotion', piece)}
	aria-label="Promote to {names[piece]}"
>
	<span class="piece {pieceName}"></span>
</button>

<style>
	button {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 25%;
		padding: 0;
		border: 0;
		border-radius: 100%;
		background: radial-gradient(
			circle at center,
			rgba(255, 255, 255, 0.98) 0%,
			rgba(226, 232, 240, 0.98) 52%,
			rgba(203, 213, 225, 0.98) 76%,
			rgba(168, 181, 199, 0.98) 100%
		);
		box-shadow: 0 0.125rem 0.5rem rgba(15, 23, 42, 0.25);
		cursor: pointer;
		transition: border-radius 120ms ease-in-out;
	}

	button::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 0;
		border-radius: inherit;
		background: rgba(83, 139, 19, 0.1);
		box-shadow: inset 0 0 1.5vmin 0 rgba(83, 139, 19, 0.8);
		opacity: 0;
		transition:
			border-radius 120ms ease-in-out,
			opacity 100ms ease-in-out;
	}

	button:focus-visible {
		outline: none;
	}

	button:hover,
	button:focus-visible {
		border-radius: 0;
	}

	button:hover::before,
	button:focus-visible::before {
		opacity: 1;
	}

	.piece {
		position: relative;
		z-index: 1;
		display: block;
		width: 80%;
		height: 80%;
		background-size: 100% 100% !important;
		transition: transform 120ms ease-out;
	}

	@media (hover: hover) {
		button:hover .piece {
			transform: scale(1.25);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		button,
		button::before,
		.piece {
			transition: none;
		}
	}
</style>

<script lang="ts">
	import { createEventDispatcher, tick } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { ChessSquare } from './chessTypes.js';
	import PromotionPiece from './PromotionPiece.svelte';

	let showModal = false;
	let isWhite = true;
	let left = 0;
	let top = 0;
	let opensDown = true;
	let menu: HTMLDivElement;
	let promotionSquare: ChessSquare | undefined;
	let suppressOpeningTouchEnd = false;
	let suppressOpeningClick = false;
	export let className = '';
	export let flipped = false;

	const dispatch = createEventDispatcher();

	const positionMenu = (square: ChessSquare, boardFlipped: boolean) => {
		const file = square.charCodeAt(0) - 97;
		const rank = Number(square[1]);
		const screenFile = boardFlipped ? 7 - file : file;
		const screenRow = boardFlipped ? rank - 1 : 8 - rank;

		left = screenFile * 12.5;
		top = screenRow === 0 ? 0 : 50;
		opensDown = screenRow === 0;
	};

	$: if (showModal && promotionSquare) positionMenu(promotionSquare, flipped);

	export async function openPromotionModal(
		whiteToMove: boolean,
		square: ChessSquare,
		openedByTouch = false
	) {
		isWhite = whiteToMove;
		promotionSquare = square;
		positionMenu(square, flipped);
		suppressOpeningTouchEnd = openedByTouch;
		suppressOpeningClick = openedByTouch;
		showModal = true;
		await tick();
		menu?.querySelector<HTMLButtonElement>('button')?.focus();
	}

	const cancel = () => {
		if (!showModal) return;
		showModal = false;
		dispatch('cancelPromotion');
	};

	const selectPromotion = (event: CustomEvent<string>) => {
		choosePromotion(event.detail);
	};

	const choosePromotion = (piece: string) => {
		showModal = false;
		dispatch('newPromotion', piece);
	};

	const suppressTouchThatOpenedMenu = (event: PointerEvent) => {
		if (!suppressOpeningTouchEnd || event.pointerType !== 'touch') return;

		event.preventDefault();
		event.stopPropagation();
		suppressOpeningTouchEnd = false;

		// The compatibility click follows pointerup on touch devices. Keep the
		// guard through that click, then allow the next deliberate tap to choose.
		window.setTimeout(() => {
			suppressOpeningClick = false;
		}, 0);
	};

	const suppressClickThatOpenedMenu = (event: MouseEvent) => {
		if (!suppressOpeningClick) return;

		event.preventDefault();
		event.stopPropagation();
		suppressOpeningClick = false;
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (!showModal) return;
		if (event.key === 'Escape') {
			event.preventDefault();
			cancel();
			return;
		}
		if (event.ctrlKey || event.metaKey || event.altKey) return;

		const piece = event.key.toLowerCase();
		if (['q', 'n', 'r', 'b'].includes(piece)) {
			event.preventDefault();
			choosePromotion(piece);
		}
	};

	const reveal = (_node: Element, { duration = 150 }: { duration?: number }) => ({
		duration,
		css: (progress: number) => `
			opacity: ${progress};
			transform: scaleY(${progress});
		`
	});
</script>

<svelte:window on:keydown={handleKeydown} />

{#if showModal}
	<div
		class="promotion-layer {className}"
		role="presentation"
		transition:fade={{ duration: 150 }}
		on:pointerup|capture={suppressTouchThatOpenedMenu}
		on:click|capture={suppressClickThatOpenedMenu}
		on:pointerdown|stopPropagation={cancel}
	>
		<div
			bind:this={menu}
			class:opens-up={!opensDown}
			class="promotion-menu"
			role="menu"
			tabindex="-1"
			aria-label="Choose promotion piece"
			style="left: {left}%; top: {top}%;"
			transition:reveal={{ duration: 150 }}
			on:pointerdown|stopPropagation
		>
			{#each ['q', 'n', 'r', 'b'] as piece}
				<PromotionPiece {piece} {isWhite} on:newPromotion={selectPromotion} />
			{/each}
		</div>
	</div>
{/if}

<style>
	.promotion-layer {
		position: absolute;
		inset: 0;
		z-index: 10000;
		direction: ltr;
		border-radius: inherit;
		background: rgba(15, 23, 42, 0.62);
	}

	.promotion-menu {
		position: absolute;
		display: flex;
		flex-direction: column;
		width: 12.5%;
		height: 50%;
		overflow: visible;
		background: transparent;
		transform-origin: top center;
	}

	.promotion-menu.opens-up {
		flex-direction: column-reverse;
		transform-origin: bottom center;
	}
</style>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let piece: string;
	export let isWhite: boolean;
	export let showModal: boolean;

	const dispatch = createEventDispatcher();

	const makePromotion = () => {
		dispatch('newPromotion', piece);
		showModal = false;
	};
</script>

<button on:click={makePromotion}>
	<img
		src="/images/pieces/{isWhite ? `w` : 'b'}{piece.toUpperCase()}.svg"
		alt="Promotion to {piece.toUpperCase()}"
		class="h-s-1/8 w-s-1/8 rounded-md border border-gray-300 hover:border-sky-600 hover:bg-gray-600 sm:h-s-sm sm:w-s-sm lg:h-s-lg lg:w-s-lg xl:h-s-xl xl:w-s-xl 2xl:h-s-2xl 2xl:w-s-2xl"
	/>
</button>

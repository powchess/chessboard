<script lang="ts">
	import Chessboard from './Chessboard.svelte';

	export let onpiececlick: (event: CustomEvent) => void;
</script>

<Chessboard config={{}} on:piececlick={onpiececlick} />

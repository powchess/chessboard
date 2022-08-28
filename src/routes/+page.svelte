<script lang="ts">
	import Chessboard from '$lib/Chessboard.svelte';
	import { SquareColor, type ChessboardConfig } from '$lib/types/chessboard';

	let white: string = '#f0d9b5';
	let black: string = '#b58863';
	let board: Chessboard;

	let config: ChessboardConfig = {
		resizible: {
			min: 400,
			max: 1000
		},
		drawTools: true
	};
	let active = false;
</script>

<div class="mt-10 grid grid-cols-center">
	<div style="width: var(--boardSize, 40rem);" class="col-start-2 flex flex-col gap-10">
		<Chessboard bind:this={board} {config} />

		<div class="mx-auto flex gap-10">
			<div class="flex gap-4">
				<input type="color" bind:value={white} class="h-10 w-10" />
			</div>
			<div class="flex gap-4">
				<input type="color" bind:value={black} class="h-10 w-10" />
			</div>
			<button
				class="rounded-md bg-slate-600/40 px-4 py-2 text-gray-200 shadow"
				on:click={() => {
					board.flipBoard();
				}}>flip</button
			>
			<button
				class="rounded-md bg-slate-600/40 px-4 py-2 text-gray-200 shadow"
				on:click={() => {
					board.setFEN('rnbqkbnr/p1p1p1pp/8/3p1p2/1pP1PP2/3B4/PP1P2PP/RNBQK1NR w KQkq - 0 1');
				}}>change fen</button
			>
			<button
				class="rounded-md bg-slate-600/40 px-4 py-2 text-gray-200 shadow"
				on:click={() => {
					board.setFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
				}}>start fen</button
			>
			<button
				class="rounded-md bg-slate-600/40 px-4 py-2 text-gray-200 shadow"
				on:click={() => {
					board.setFEN('8/8/8/8/8/8/8/8 w - - 0 1');
				}}>empty fen</button
			>
			<button
				class="rounded-md bg-slate-600/40 px-4 py-2 text-gray-200 shadow"
				on:click={() => {
					board.makeMove('e1f5');
				}}>move e1f5</button
			>
			<button
				class="rounded-md bg-slate-600/40 px-4 py-2 text-gray-200 shadow"
				on:click={() => {
					board.highlightSquare('e1f5', SquareColor.MOVE);
				}}>last e1f5</button
			>
			<button
				class="rounded-md bg-slate-600/40 px-4 py-2 text-gray-200 shadow"
				on:click={() => {
					active = !active;
				}}>arrows {active}</button
			>
		</div>
	</div>
</div>

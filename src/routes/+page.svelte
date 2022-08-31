<script lang="ts">
	import type { ChessboardConfig } from '$lib/boardConfig';
	import Chessboard from '$lib/Chessboard.svelte';

	const config: ChessboardConfig = {
		board: {
			notation: true,
			shadow: true
		},
		resizible: {
			min: 400,
			max: 1000
		},
		drawTools: true
	};
</script>

<div class="mt-10 grid grid-cols-center">
	<div class="col-start-2 gap-10 grid grid-cols-[1fr-auto]">
		<div class="col-start-1 flex flex-col gap-2 w-60 bg-slate-800/30 rounded shadow-lg text-gray-300 text-sm p-4">
			<button
				on:click={() => {
					if (config?.board?.notation !== undefined) config.board.notation = !config.board.notation;
					else if (config?.board !== undefined) config.board.notation = false;
					else config.board = { notation: false };
				}}
			>
				<button
					on:click={() => {
						if (config?.board?.flipped !== undefined) config.board.flipped = !config.board.flipped;
						else if (config?.board !== undefined) config.board.flipped = true;
						else config.board = { flipped: true };
					}}
				>
					flip
				</button>

				<button
					on:click={() => {
						if (config?.board?.shadow !== undefined) config.board.shadow = !config.board.shadow;
						else if (config?.board !== undefined) config.board.shadow = true;
						else config.board = { shadow: true };
					}}
				>
					shadow
				</button>
			</button>
		</div>
		<div class="col-start-2 w-[var(--boardSize,40rem)]">
			<Chessboard {config} />
		</div>
	</div>
</div>

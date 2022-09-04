<script lang="ts">
	import {
		BoardThemes,
		type BoardTheme,
		type ChessboardConfig,
		type EasingFuncs,
		type KingLocations,
		type PiecesThemes
	} from '$lib/boardConfig';
	import Chessboard from '$lib/Chessboard.svelte';
	import { Color } from '$lib/enums';
	import { State } from '$lib/state';
	import Prism from 'svelte-prism';

	const defaultState = new State();

	type CBConfig = {
		board: {
			boardTheme: BoardTheme;
			piecesTheme: PiecesThemes;
			flipped: boolean;
			notation: boolean;
			shadow: boolean;
			startFen: string;
			startSize: number;
		};

		movable: boolean | Color.WHITE | Color.BLACK | Color.BOTH;

		draggable:
			| boolean
			| {
					ghostPiece: boolean;
					transition:
						| boolean
						| {
								duration: number;
								easing: EasingFuncs;
						  };
			  };

		selectable: boolean;

		legal:
			| boolean
			| {
					settings: {
						allowPromotion: boolean;
						allowEnPassant: boolean;
						allowCastling: boolean;
					};
					preMoves: boolean;
			  };

		callbacks: {
			getLegalMoves?: () => string[];
			getPreMoves?: () => string[];
			beforeMove?: (move: string) => void;
			afterMove?: (move: string) => void;
			getLastMove?: () => string;
			getLastMoveSAN?: () => string;
			getKingLocations?: () => KingLocations;
			getInCheck?: () => Color.WHITE | Color.BLACK | undefined;
			getWhiteToMove?: () => boolean;
		};

		highlight:
			| boolean
			| {
					select: boolean;
					legal: boolean;
					move: boolean;
					preMove: boolean;
					nextMove: boolean;
					check: boolean;
			  };

		drawTools:
			| boolean
			| {
					LshapeKnightMove: boolean;
					onlyChessMove: boolean;
			  };

		sounds:
			| boolean
			| {
					MOVE: boolean;
					CAPTURE: boolean;
					CASTLE: boolean;
					UNDO: boolean;
			  };

		resizible:
			| boolean
			| {
					min: number;
					max: number;
			  };
	};

	const config: CBConfig = {
		board: {
			boardTheme: 'standard',
			piecesTheme: 'standard',
			flipped: false,
			notation: true,
			shadow: true,
			startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
			startSize: 500
		},

		movable: Color.BOTH,

		draggable: true,

		selectable: true,

		legal: false,

		callbacks: {},

		highlight: true,

		drawTools: true,

		sounds: true,

		resizible: true
	};

	const getConfigString = (cfg: ChessboardConfig) => {
		const config = <ChessboardConfig>JSON.parse(JSON.stringify(cfg));
		if (config.board !== undefined) {
			if (config.board.boardTheme !== undefined && config.board.boardTheme === defaultState.board.boardTheme)
				delete config.board.boardTheme;
			if (config.board.piecesTheme !== undefined && config.board.piecesTheme === defaultState.board.piecesTheme)
				delete config.board.piecesTheme;
			if (config.board.flipped !== undefined && config.board.flipped === defaultState.board.flipped) delete config.board.flipped;
			if (config.board.notation !== undefined && config.board.notation === defaultState.board.notation) delete config.board.notation;
			if (config.board.shadow !== undefined && config.board.shadow === defaultState.board.shadow) delete config.board.shadow;
			if (config.board.startFen !== undefined && config.board.startFen === defaultState.board.startFen) delete config.board.startFen;

			if (Object.keys(config.board).length === 0) delete config.board;
		}

		return ('const config: ChessboardConfig = ' + JSON.stringify(config, null, 4)).replace(/"([^"]+)":/g, '$1:');
	};

	$: code = getConfigString(config);
</script>

<svelte:head>
	<title>Chessboard • PowChess.com</title>
	<link rel="stylesheet" href="prism-one-dark.css" />
</svelte:head>

<div class="mt-10 grid grid-cols-center">
	<div class="col-start-2 gap-10 grid grid-cols-[1fr-auto]">
		<div class="col-start-1 row-span-2 flex flex-col gap-2 w-60 text-gray-300 text-sm">
			<div class="bg-slate-900/20 rounded shadow-lg p-2 pl-4 flex flex-col">
				board
				<div class="p-2 pl-4">
					<div>
						<label for="boardTheme" class="select-none">notation</label>
						<select bind:value={config.board.boardTheme}>
							{#each BoardThemes as theme}
								<option value={theme}>{theme}</option>
							{/each}
						</select>
					</div>

					<div>
						<input id="notation" type="checkbox" bind:checked={config.board.notation} />
						<label for="notation" class="select-none">notation</label>
					</div>

					<div>
						<input id="flipped" type="checkbox" bind:checked={config.board.flipped} />
						<label for="flipped" class="select-none">flipped</label>
					</div>

					<div>
						<input id="shadow" type="checkbox" bind:checked={config.board.shadow} />
						<label for="shadow" class="select-none">shadow</label>
					</div>
				</div>
			</div>
		</div>
		<div class="col-start-2 w-[var(--boardSize,40rem)]">
			<Chessboard {config} />
		</div>
		<div class="col-start-2 row-start-2 shadow-lg rounded">
			<Prism source={code} />
		</div>
	</div>
</div>

<script lang="ts">
	import Prism from 'prismjs';
	import 'prism-svelte';
	import { onMount } from 'svelte';
	import { Chess, type Move } from 'chess.js';
	import Chessboard from '$lib/Chessboard.svelte';
	import { State } from '$lib/state/index.js';
	import type { ChessboardConfig } from '$lib/boardConfig.js';
	import { browser } from '$app/environment';
	import Board from '$lib/components/Board.svelte';
	import Movable from '$lib/components/Movable.svelte';
	import Draggable from '$lib/components/Draggable.svelte';
	import Section from '$lib/components/Section.svelte';
	import Highlight from '$lib/components/Highlight.svelte';
	import DrawTools from '$lib/components/DrawTools.svelte';
	import Sounds from '$lib/components/Sounds.svelte';
	import CopyButton from '$lib/components/CopyButton.svelte';
	import Legal from '$lib/components/Legal.svelte';

	const chess = new Chess();

	const config: ChessboardConfig = {
		movable: 'BOTH',
		legal: true,
		callbacks: {
			afterMove: (move) =>
				chess.move({
					from: move.substring(0, 2),
					to: move.substring(2, 4),
					...(move.length > 4 && { promotion: move[4] })
				}),
			getLegalMoves: () =>
				(<Move[]>chess.moves({ verbose: true })).map((move) => {
					return move.from + move.to + (move.promotion ?? '');
				}),
			getWhiteToMove: () => chess.turn() === 'w',
			getInCheck: () => chess.inCheck(),
			getLastMove: () => {
				const lastMove = chess.history({ verbose: true }).pop() as Move;
				if (!lastMove) return '';
				return lastMove.from + lastMove.to + (lastMove.promotion ?? '');
			}
		},
		board: {
			resizible: true
		}
	};

	const callbacksTS = `{
			afterMove: (move) =>
				chess.move({
					from: move.substring(0, 2),
					to: move.substring(2, 4),
					...(move.length > 4 && { promotion: move[4] })
				}),
			getLegalMoves: () =>
				(<Move[]>chess.moves({ verbose: true })).map((move) => {
					return move.from + move.to + (move.promotion ?? '');
				}),
			getWhiteToMove: () => chess.turn() === 'w',
			getInCheck: () => chess.inCheck(),
			getLastMove: () => {
				const lastMove = chess.history({ verbose: true }).pop() as Move;
				if (!lastMove) return '';
				return lastMove.from + lastMove.to + (lastMove.promotion ?? '');
			}
		}`;

	const callbacksJS = `{
			afterMove: (move) =>
				chess.move({
					from: move.substring(0, 2),
					to: move.substring(2, 4),
					...(move.length > 4 && { promotion: move[4] })
				}),
			getLegalMoves: () =>
				chess.moves({ verbose: true }).map((move) => {
					return move.from + move.to + (move.promotion ?? '');
				}),
			getWhiteToMove: () => chess.turn() === 'w',
			getInCheck: () => chess.inCheck(),
			getLastMove: () => {
				const lastMove = chess.history({ verbose: true }).pop();
				if (!lastMove) return '';
				return lastMove.from + lastMove.to + (lastMove.promotion ?? '');
			}
		}`;

	let chessboard: Chessboard;
	let state = new State(config);
	let mounted = false;
	let tsEnabled = true;
	let code = '';

	onMount(() => {
		mounted = true;
		state = chessboard.getState?.() as State;
	});

	const getConfigString = (newState: State, ts: boolean) => {
		const cfg = newState.getConfig();

		if (browser && mounted) {
			chessboard.setState?.(newState);
		}

		let configString = JSON.stringify(
			cfg,
			(key, value) => {
				if (key === 'callbacks') {
					return `{functions}`;
				}

				return value;
			},
			4
		);

		configString = configString
			.replace(/"([^"]+)":/g, '$1:')
			.replaceAll('\n', '\n\t\t')
			.replace('"{functions}"', ts ? callbacksTS : callbacksJS);

		const importColor = "\n\timport { Color } from '@powchess/chessboard/enums';";

		function needColorImport() {
			return (
				configString.includes("movable: 'WHITE'") ||
				configString.includes("movable: 'BLACK'") ||
				configString.includes("movable: 'BOTH'")
			);
		}

		/* eslint-disable no-useless-escape */
		const resultString = `
    <script${ts ? ' lang="ts"' : ''}> 
        import Chessboard${ts ? ', { type ChessboardConfig }' : ''} from '@powchess/chessboard';${
					needColorImport() && ts ? importColor : ''
				}${
					state.legal.enabled
						? ts
							? "\n\t\timport { Chess, type Move } from 'chess.js';"
							: "\n\t\timport { Chess } from 'chess.js';"
						: ''
				}${state.legal.enabled ? '\n\n\t\tconst chess = new Chess();' : ''}

        const config${ts ? ': ChessboardConfig' : ''} = ${configString};
    <\/script>

    <Chessboard {config} className="rounded-md" />`;

		return resultString;
	};

	$: code = getConfigString(state, tsEnabled);
</script>

<svelte:head>
	<title>Chessboard • PowChess.com</title>
	<link rel="stylesheet" href="prism-one-dark.css" />
</svelte:head>

<div class="my-10 grid grid-cols-center">
	<div class="lg:col-start-2 gap-10 grid lg:grid-cols-[auto_auto]">
		<div class="flex flex-col gap-2 mx-auto w-60 text-gray-300 text-sm">
			<Board
				bind:boardTheme={state.board.boardTheme}
				bind:mouseEvents={state.board.mouseEvents}
				bind:notation={state.board.notation}
				bind:flipped={state.board.flipped}
				bind:resizible={state.board.resizible}
				expanded
			/>
			<Movable bind:enabled={state.movable.enabled} bind:color={state.movable.color} expanded />
			<Draggable
				bind:enabled={state.draggable.enabled}
				bind:ghostPiece={state.draggable.ghostPiece.enabled}
				bind:transition={state.draggable.transition.enabled}
				bind:duration={state.draggable.transition.settings.duration}
				bind:easing={state.draggable.transition.settings.easing}
				bind:clickMoveAnimation={state.draggable.transition.settings.clickMoveAnimation}
			/>
			<Section name="Selectable" bind:enabled={state.selectable.enabled} showExpand={false} />
			<Legal
				on:changed={() => {
					if (!state.legal.enabled) {
						// for some reason it doesn't work without !state.legal.enabled,
						// on:changed event is triggered before the change??
						chess.reset();
						if (browser && mounted)
							chessboard.setPieces?.(state.board.startFen, { deselectPiece: true, sound: false });
					}
				}}
				bind:allowCastling={state.legal.settings.allowCastling}
				bind:allowEnPassant={state.legal.settings.allowEnPassant}
				bind:enabled={state.legal.enabled}
			/>
			<Highlight bind:enabled={state.highlight.enabled} bind:settings={state.highlight.settings} />
			<DrawTools
				bind:enabled={state.drawTools.enabled}
				bind:knightLShape={state.drawTools.settings.knightLShape}
				bind:onlyChessMove={state.drawTools.settings.onlyChessMove}
			/>
			<Sounds bind:enabled={state.sounds.enabled} bind:settings={state.sounds.settings} />
		</div>
		<div class="grid grid-rows-[90wh_auto] gap-10">
			<div class="w-full lg:w-[calc(70vh*(var(--boardScale,70)/100*0.7+0.3))]">
				<Chessboard bind:this={chessboard} {config} class="rounded-md" />
			</div>
			<div class="row-start-2 relative">
				<div class="shadow-lg rounded">
					<div class="absolute right-2 top-2 flex gap-4">
						<button
							on:click={() => {
								tsEnabled = !tsEnabled;
							}}
							class="text-gray-500 font-mono flex text-[0.8rem] mt-1"
						>
							<span class={tsEnabled ? 'text-yellow-600' : ''}>ts</span>
							<span class="text-gray-600">/</span>
							<span class={!tsEnabled ? 'text-yellow-600' : ''}>js</span>
						</button>
						<CopyButton copyText={code} />
					</div>
					<pre class="bg-gray-800 rounded pr-6 overflow-auto">
                        <code>
                            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                            {@html Prism.highlight(code, Prism.languages.svelte, 'svelte')}
                        </code>
					</pre>
				</div>
			</div>
		</div>
	</div>
</div>

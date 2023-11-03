<script lang="ts">
	import Prism from 'svelte-prism';
	import { onMount } from 'svelte';
	import { Chess, type Move } from 'chess.js';
	import Chessboard from '$lib/Chessboard.svelte';
	import { State, defaultFEN } from '$lib/state/index.js';
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
			resizible: true,
			skins: {
				enabled: true,
				urls: {
					wP60: 'https://banner2.cleanpng.com/20180409/gde/kisspng-chess-computer-icons-pawn-bishop-pawn-5acb74c9227837.2430830015232831451412.jpg',
					wP4: 'https://cdn.shopify.com/s/files/1/2209/1363/products/ColorChangePawn_600x.gif?v=1535647342'
				}
			}
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
			.replaceAll('\n', '\n\t')
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
		const resultString = `\
<script${ts ? ' lang="ts"' : ''}>
	import Chessboard${ts ? ', { type ChessboardConfig }' : ''} from '@powchess/chessboard';${
			needColorImport() && ts ? importColor : ''
		}${
			state.legal.enabled
				? ts
					? "\n\timport { Chess, type Move } from 'chess.js';"
					: "\n\timport { Chess } from 'chess.js';"
				: ''
		}${state.legal.enabled ? '\n\n\tconst chess = new Chess();' : ''}

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
			<button
				on:click={() => {
					chessboard.setPieces([
						{
							id: 'bR0',
							square: 'a8',
							name: 'bR'
						},
						{
							id: 'bN0',
							square: 'b8',
							name: 'bN'
						},
						{
							id: 'bB0',
							square: 'c8',
							name: 'bB'
						},
						{
							id: 'bQ0',
							square: 'd8',
							name: 'bQ'
						},
						{
							id: 'bK0',
							square: 'e8',
							name: 'bK'
						},
						{
							id: 'bB1',
							square: 'f8',
							name: 'bB'
						},
						{
							id: 'bN1',
							square: 'g8',
							name: 'bN'
						},
						{
							id: 'bR1',
							square: 'h8',
							name: 'bR'
						},
						{
							id: 'bP0',
							square: 'a7',
							name: 'bP'
						},
						{
							id: 'bP1',
							square: 'b7',
							name: 'bP'
						},
						{
							id: 'bP2',
							square: 'c7',
							name: 'bP'
						},
						{
							id: 'bP3',
							square: 'd7',
							name: 'bP'
						},
						{
							id: 'bP4',
							square: 'e7',
							name: 'bP'
						},
						{
							id: 'bP5',
							square: 'f7',
							name: 'bP'
						},
						{
							id: 'bP6',
							square: 'g7',
							name: 'bP'
						},
						{
							id: 'bP7',
							square: 'h7',
							name: 'bP'
						},
						{
							id: 'wP0',
							square: 'a2',
							name: 'wP'
						},
						{
							id: 'wP1',
							square: 'b2',
							name: 'wP'
						},
						{
							id: 'wP2',
							square: 'c2',
							name: 'wP'
						},
						{
							id: 'wP3',
							square: 'd2',
							name: 'wP'
						},
						{
							id: 'wP4',
							square: 'e2',
							name: 'wP'
						},
						{
							id: 'wP5',
							square: 'f2',
							name: 'wP'
						},
						{
							id: 'wP6',
							square: 'g2',
							name: 'wP'
						},
						{
							id: 'wP7',
							square: 'h2',
							name: 'wP'
						},
						{
							id: 'wR0',
							square: 'a1',
							name: 'wR'
						},
						{
							id: 'wN0',
							square: 'b1',
							name: 'wN'
						},
						{
							id: 'wB0',
							square: 'c1',
							name: 'wB'
						},
						{
							id: 'wQ0',
							square: 'd1',
							name: 'wQ'
						},
						{
							id: 'wK0',
							square: 'e1',
							name: 'wK'
						},
						{
							id: 'wB1',
							square: 'f1',
							name: 'wB'
						},
						{
							id: 'wN1',
							square: 'g1',
							name: 'wN'
						},
						{
							id: 'wR1',
							square: 'h1',
							name: 'wR'
						}
					]);
				}}
			>
				set default fen
			</button>
			<!-- <div class="row-start-2 relative">
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
					<Prism source={code} language="svelte" />
				</div>
			</div> -->
		</div>
	</div>
</div>

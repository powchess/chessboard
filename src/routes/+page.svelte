<script lang="ts">
	import Prism from 'svelte-prism';
	import { onMount } from 'svelte';
	import Chessboard from '$lib/Chessboard.svelte';
	import { State } from '$lib/state/index';
	import type { ChessboardConfig } from '$lib/boardConfig';
	import { browser } from '$app/environment';
	import Board from '$lib/components/Board.svelte';
	import Movable from '$lib/components/Movable.svelte';
	import Draggable from '$lib/components/Draggable.svelte';
	import Section from '$lib/components/Section.svelte';
	import Legal from '$lib/components/Legal.svelte';
	import Highlight from '$lib/components/Highlight.svelte';
	import DrawTools from '$lib/components/DrawTools.svelte';
	import Sounds from '$lib/components/Sounds.svelte';
	import CopyButton from '$lib/components/CopyButton.svelte';

	const config: ChessboardConfig = {
		board: {
			shadow: true
		},
		resizible: true
	};

	let chessboard: Chessboard;
	let state = new State(config);
	let mounted = false;
	let tsEnabled = true;
	let code = '';

	onMount(() => {
		mounted = true;
		state = chessboard.getState();
	});

	const getConfigString = (newState: State, ts: boolean) => {
		const cfg = newState.getConfig();

		const typescript = `\n\timport type { ChessboardConfig } from '@powchess/chessboard/boardConfig';`;

		if (browser && mounted) {
			chessboard.setState(newState);
		}

		let configString = JSON.stringify(cfg, null, 4)
			.replace(/"([^"]+)":/g, '$1:')
			.replaceAll('\n', '\n\t');

		const importColor = "\n\timport { Color } from '@powchess/chessboard/enums';";

		if (ts) {
			configString = configString
				.replaceAll('movable: 0', 'movable: Color.WHITE')
				.replaceAll('movable: 1', 'movable: Color.BLACK')
				.replaceAll('movable: 2', 'movable: Color.BOTH');
		}

		function needColorImport() {
			return (
				configString.includes('movable: Color.WHITE') ||
				configString.includes('movable: Color.BLACK') ||
				configString.includes('movable: Color.BOTH')
			);
		}

		/* eslint-disable no-useless-escape */
		const resultString = `\
<script${ts ? ' lang="ts"' : ''}>
	import Chessboard from '@powchess/chessboard';${ts ? typescript : ''}${needColorImport() && ts ? importColor : ''}

	const config${ts ? ': ChessboardConfig' : ''} = ${configString};
<\/script>

<Chessboard {config} />`;

		return resultString;
	};

	$: code = getConfigString(state, tsEnabled);
</script>

<svelte:head>
	<title>Chessboard • PowChess.com</title>
	<link rel="stylesheet" href="prism-one-dark.css" />
</svelte:head>

<div class="mt-10 grid grid-cols-center">
	<div class="col-start-2 gap-10 grid grid-cols-[auto_auto]">
		<div class="col-start-1 flex flex-col gap-2 w-60 text-gray-300 text-sm">
			<Board
				bind:boardTheme={state.board.boardTheme}
				bind:notation={state.board.notation}
				bind:flipped={state.board.flipped}
				bind:shadow={state.board.shadow}
			/>
			<Movable bind:enabled={state.movable.enabled} bind:color={state.movable.color} />
			<Draggable
				bind:enabled={state.draggable.enabled}
				bind:ghostPiece={state.draggable.ghostPiece.enabled}
				bind:transition={state.draggable.transition.enabled}
				bind:duration={state.draggable.transition.settings.duration}
				bind:easing={state.draggable.transition.settings.easing}
			/>
			<Section name={'Selectable'} bind:enabled={state.selectable.enabled} showExpand={false} />
			<Legal bind:enabled={state.legal.enabled} bind:preMovesEnabled={state.legal.preMoves.enabled} />
			<Highlight bind:enabled={state.highlight.enabled} bind:settings={state.highlight.settings} />
			<DrawTools
				bind:enabled={state.drawTools.enabled}
				bind:LshapeKnightMove={state.drawTools.settings.LshapeKnightMove}
				bind:onlyChessMove={state.drawTools.settings.onlyChessMove}
			/>
			<Sounds bind:enabled={state.sounds.enabled} bind:settings={state.sounds.settings} />
			<Section name={'Resizible'} bind:enabled={state.resizible.enabled} showExpand={false} />
		</div>
		<div class="grid grid-rows-[min-content_auto] gap-10">
			<div class="w-[var(--boardSize,40rem)]">
				<Chessboard bind:this={chessboard} {config} />
			</div>
			<div class="row-start-2 relative">
				<div class="shadow-lg rounded ">
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
			</div>
		</div>
	</div>
</div>

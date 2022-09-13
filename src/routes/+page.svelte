<script lang="ts">
	import Prism from 'svelte-prism';
	import { onMount } from 'svelte';
	import Chessboard from '$lib/Chessboard.svelte';
	import { State } from '$lib/state/index';
	import { BoardThemes, EasingFuncsArray, type ChessboardConfig } from '$lib/boardConfig';
	import { browser } from '$app/environment';
	import { Color } from '$lib/enums';

	const config: ChessboardConfig = {
		resizible: true
	};

	let chessboard: Chessboard;
	let state = new State(config);
	let mounted = false;
	let tsEnabled = true;
	let copied = false;
	let button: HTMLButtonElement;
	let code = '';

	onMount(() => {
		mounted = true;
		state = chessboard.getState();
	});

	const getConfigString = (newState: State, ts: boolean) => {
		const cfg = newState.getConfig();

		const typescript = `\n	import type { ChessboardConfig } from '@powchess/chessboard/boardConfig';`;

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

		/* eslint-disable prefer-template */
		/* eslint-disable no-useless-escape */
		const resultString =
			`<script${ts ? ' lang="ts"' : ''}>\n` +
			`	import Chessboard from '@powchess/chessboard';` +
			(ts ? typescript : '') +
			((configString.includes('movable: Color.WHITE') ||
				configString.includes('movable: Color.BLACK') ||
				configString.includes('movable: Color.BOTH')) &&
			ts
				? importColor
				: '') +
			'\n\n' +
			`	const config${ts ? ': ChessboardConfig' : ''} = ${configString};\n` +
			`<\/script>\n\n` +
			`<Chessboard {config} />`;

		return resultString;
	};

	function copyToClipboard() {
		navigator.clipboard.writeText(code);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 2000);
		button.setAttribute('data-cooltipz-dir', 'top');
		button.setAttribute('aria-label', 'Copied!');
		setTimeout(() => {
			button.removeAttribute('aria-label');
			button.removeAttribute('data-cooltipz-dir');
		}, 2000);
	}

	const highlightNames = ['select', 'legal', 'move', 'preMove', 'nextMove', 'check'] as const;
	const soundsNames = ['MOVE', 'CAPTURE', 'CASTLE', 'UNDO'] as const;

	$: code = getConfigString(state, tsEnabled);
</script>

<svelte:head>
	<title>Chessboard • PowChess.com</title>
	<link rel="stylesheet" href="prism-one-dark.css" />
</svelte:head>

<div class="mt-10 grid grid-cols-center">
	<div class="col-start-2 gap-10 grid grid-cols-[auto_auto]">
		<div class="col-start-1 flex flex-col gap-2 w-60 text-gray-300 text-sm">
			<div class="bg-slate-900/20 rounded shadow-lg p-2 pl-4 flex flex-col">
				board
				<div class="p-2 pl-4">
					<div>
						<label for="boardTheme" class="select-none">board theme</label>
						<select bind:value={state.board.boardTheme}>
							{#each BoardThemes as theme}
								<option value={theme}>{theme}</option>
							{/each}
						</select>
					</div>

					<div>
						<input id="notation" type="checkbox" bind:checked={state.board.notation} />
						<label for="notation" class="select-none">notation</label>
					</div>

					<div>
						<input id="flipped" type="checkbox" bind:checked={state.board.flipped} />
						<label for="flipped" class="select-none">flipped</label>
					</div>

					<div>
						<input id="shadow" type="checkbox" bind:checked={state.board.shadow} />
						<label for="shadow" class="select-none">shadow</label>
					</div>
				</div>
			</div>
			<div class="bg-slate-900/20 rounded shadow-lg p-2 pl-4 flex flex-col">
				movable
				<div class="p-2 pl-4">
					<div>
						<input id="movableEnabled" type="checkbox" bind:checked={state.movable.enabled} />
						<label for="movableEnabled" class="select-none">enabled</label>
					</div>
					{#if state.movable.enabled}
						<div>
							<select bind:value={state.movable.color}>
								<option value={Color.BOTH}>Both</option>
								<option value={Color.WHITE}>White</option>
								<option value={Color.BLACK}>Black</option>
							</select>
						</div>
					{/if}
				</div>
			</div>
			<div class="bg-slate-900/20 rounded shadow-lg p-2 pl-4 flex flex-col">
				draggable
				<div class="p-2 pl-4">
					<div>
						<input id="draggableEnabled" type="checkbox" bind:checked={state.draggable.enabled} />
						<label for="draggableEnabled" class="select-none">enabled</label>
					</div>
					{#if state.draggable.enabled}
						<div>
							<input id="ghostPiece" type="checkbox" bind:checked={state.draggable.ghostPiece.enabled} />
							<label for="ghostPiece" class="select-none">ghost piece</label>
						</div>
						<div>
							<input id="draggableEnabled" type="checkbox" bind:checked={state.draggable.transition.enabled} />
							<label for="draggableEnabled" class="select-none">transition enabled</label>
						</div>
						{#if state.draggable.transition.enabled}
							<div>
								<input id="transitionDuration" type="number" bind:value={state.draggable.transition.settings.duration} />
								<label for="transitionDuration" class="select-none">duration</label>
							</div>
							<div>
								<label for="easingFuncs" class="select-none">easing func</label>
								<select id="easingFuncs" bind:value={state.draggable.transition.settings.easing}>
									{#each EasingFuncsArray as easingFunc}
										<option value={easingFunc}>{easingFunc}</option>
									{/each}
								</select>
							</div>
						{/if}
					{/if}
				</div>
			</div>
			<div class="bg-slate-900/20 rounded shadow-lg p-2 pl-4 flex flex-col">
				selectable
				<div class="p-2 pl-4">
					<div>
						<input id="selectableEnabled" type="checkbox" bind:checked={state.selectable.enabled} />
						<label for="selectableEnabled" class="select-none">enabled</label>
					</div>
				</div>
			</div>
			<div class="bg-slate-900/20 rounded shadow-lg p-2 pl-4 flex flex-col">
				legal
				<div class="p-2 pl-4">
					<div>
						<input id="legalEnabled" type="checkbox" bind:checked={state.legal.enabled} />
						<label for="legalEnabled" class="select-none">enabled</label>
					</div>
					{#if state.legal.enabled}
						<div>
							<input id="preMovesEnabled" type="checkbox" bind:checked={state.legal.preMoves.enabled} />
							<label for="preMovesEnabled" class="select-none">preMoves enabled</label>
						</div>
					{/if}
				</div>
			</div>
			<div class="bg-slate-900/20 rounded shadow-lg p-2 pl-4 flex flex-col">
				highlight
				<div class="p-2 pl-4">
					<div>
						<input id="highlightEnabled" type="checkbox" bind:checked={state.highlight.enabled} />
						<label for="highlightEnabled" class="select-none">enabled</label>
					</div>
					{#if state.highlight.enabled}
						{#each highlightNames as highlight}
							<div>
								<input id="{highlight}Enabled" type="checkbox" bind:checked={state.highlight.settings[highlight]} />
								<label for="{highlight}Enabled" class="select-none">{highlight}</label>
							</div>
						{/each}
					{/if}
				</div>
			</div>
			<div class="bg-slate-900/20 rounded shadow-lg p-2 pl-4 flex flex-col">
				drawTools
				<div class="p-2 pl-4">
					<div>
						<input id="drawToolsEnabled" type="checkbox" bind:checked={state.drawTools.enabled} />
						<label for="drawToolsEnabled" class="select-none">enabled</label>
					</div>
					{#if state.drawTools.enabled}
						<div>
							<input id="LshapeKnightMoveEnabled" type="checkbox" bind:checked={state.drawTools.settings.LshapeKnightMove} />
							<label for="LshapeKnightMoveEnabled" class="select-none">L shape knight move</label>
						</div>
						<div>
							<input id="onlyChessMoveEnabled" type="checkbox" bind:checked={state.drawTools.settings.onlyChessMove} />
							<label for="onlyChessMoveEnabled" class="select-none">only chess move</label>
						</div>
					{/if}
				</div>
			</div>
			<div class="bg-slate-900/20 rounded shadow-lg p-2 pl-4 flex flex-col">
				sounds
				<div class="p-2 pl-4">
					<div>
						<input id="soundsEnabled" type="checkbox" bind:checked={state.sounds.enabled} />
						<label for="soundsEnabled" class="select-none">enabled</label>
					</div>
					{#if state.sounds.enabled}
						{#each soundsNames as sound}
							<div>
								<input id="{sound}Enabled" type="checkbox" bind:checked={state.sounds.settings[sound]} />
								<label for="{sound}Enabled" class="select-none">{sound}</label>
							</div>
						{/each}
					{/if}
				</div>
			</div>
			<div class="bg-slate-900/20 rounded shadow-lg p-2 pl-4 flex flex-col">
				resizible
				<div class="p-2 pl-4">
					<div>
						<input id="resizibleEnabled" type="checkbox" bind:checked={state.resizible.enabled} />
						<label for="resizibleEnabled" class="select-none">enabled</label>
					</div>
				</div>
			</div>
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
						<button
							type="button"
							bind:this={button}
							on:click={copyToClipboard}
							class="box-border rounded-sm bg-slate-800 bg-opacity-40 text-gray-500 transition hover:text-gray-300 focus:z-10 focus:ring-1 focus:ring-blue-600 p-1"
						>
							{#if copied}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 text-green-500"
									fill="none"
									viewBox="0 0 24 24"
									aria-hidden="true"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
									/>
								</svg>
							{:else}
								<svg
									style="transform: translate(1px, 0px);"
									xmlns="http://www.w3.org/2000/svg"
									class="h-5"
									fill="none"
									viewBox="0 0 24 24"
									aria-hidden="true"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
									/>
								</svg>
							{/if}
						</button>
					</div>
					<Prism source={code} language="svelte" />
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	input {
		color: black;
	}

	select {
		color: black;
	}
</style>

<script lang="ts">
	import Prism from 'prismjs';
	import 'prism-svelte';
	import packageJson from '../../package.json' with { type: 'json' };
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
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
	const packageVersion = packageJson.version;

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
			scale: 90
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
	let activePanel: 'controls' | 'code' | null = null;

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

		return resultString
			.trim()
			.split('\n')
			.map((line) => (line.startsWith('    ') ? line.slice(4) : line))
			.join('\n');
	};

	$: code = getConfigString(state, tsEnabled);

	function togglePanel(panel: 'controls' | 'code') {
		activePanel = activePanel === panel ? null : panel;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') activePanel = null;
	}
</script>

<svelte:head>
	<title>Universal Chessboard for Svelte</title>
	<link rel="stylesheet" href="prism-one-dark.css" />
</svelte:head>

<svelte:window on:keydown={handleKeydown} />

<main class="showcase-shell">
	<header class="topbar">
		<p class="library-description">A universal chessboard library for Svelte</p>
		<span class="package-version" aria-label="Chessboard package version">v{packageVersion}</span>

		<nav class="toolbar" aria-label="Chessboard tools">
			<button
				type="button"
				class:active={activePanel === 'controls'}
				on:click={() => togglePanel('controls')}
				aria-pressed={activePanel === 'controls'}
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
					<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
					<path
						d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.42 1.42-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.04 1.56V20h-2v-.48a1.7 1.7 0 0 0-1.04-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06L9 16.94l.06-.06A1.7 1.7 0 0 0 9.4 15a1.7 1.7 0 0 0-1.56-1.04H7.4v-2h.44A1.7 1.7 0 0 0 9.4 10.9a1.7 1.7 0 0 0-.34-1.88L9 8.96l1.42-1.42.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 13.4 6.4V6h2v.4a1.7 1.7 0 0 0 1.04 1.54 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.42 1.42-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.56 1.06h.44v2h-.44A1.7 1.7 0 0 0 19.4 15Z"
					/>
				</svg>
				<span>Customize</span>
			</button>
			<button
				type="button"
				class:active={activePanel === 'code'}
				on:click={() => togglePanel('code')}
				aria-pressed={activePanel === 'code'}
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
					<path d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4M13.5 5l-3 14" />
				</svg>
				<span>Code</span>
			</button>
		</nav>
	</header>

	<section class="board-stage" aria-label="Interactive chessboard">
		<div class="board-glow" aria-hidden="true"></div>
		<div class="board-frame">
			<Chessboard bind:this={chessboard} {config} class="rounded-md" />
		</div>
	</section>
</main>

{#if activePanel}
	<button
		type="button"
		class="panel-backdrop"
		on:click={() => (activePanel = null)}
		aria-label="Close panel"
		transition:fade={{ duration: 140 }}
	></button>

	<aside
		class="studio-panel"
		aria-label="Chessboard customization"
		transition:fly={{ x: 28, duration: 190 }}
	>
		<header class="panel-header">
			<div class="panel-tabs" role="tablist" aria-label="Panel view">
				<button
					type="button"
					class:active={activePanel === 'controls'}
					on:click={() => (activePanel = 'controls')}
					role="tab"
					aria-selected={activePanel === 'controls'}>Customize</button
				>
				<button
					type="button"
					class:active={activePanel === 'code'}
					on:click={() => (activePanel = 'code')}
					role="tab"
					aria-selected={activePanel === 'code'}>Code</button
				>
			</div>
			<button
				type="button"
				class="close-button"
				on:click={() => (activePanel = null)}
				aria-label="Close panel"
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
					<path d="m7 7 10 10M17 7 7 17" />
				</svg>
			</button>
		</header>

		{#if activePanel === 'controls'}
			<div class="panel-content settings-content">
				<div class="panel-intro">
					<p>Board settings</p>
					<span>Changes appear instantly.</span>
				</div>
				<div class="control-list">
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
								chess.reset();
								if (browser && mounted)
									chessboard.setPieces?.(state.board.startFen, {
										deselectPiece: true,
										sound: false
									});
							}
						}}
						bind:allowCastling={state.legal.settings.allowCastling}
						bind:allowEnPassant={state.legal.settings.allowEnPassant}
						bind:enabled={state.legal.enabled}
					/>
					<Highlight
						bind:enabled={state.highlight.enabled}
						bind:settings={state.highlight.settings}
					/>
					<DrawTools
						bind:enabled={state.drawTools.enabled}
						bind:knightLShape={state.drawTools.settings.knightLShape}
						bind:onlyChessMove={state.drawTools.settings.onlyChessMove}
					/>
					<Sounds bind:enabled={state.sounds.enabled} bind:settings={state.sounds.settings} />
				</div>
			</div>
		{:else}
			<div class="panel-content code-content">
				<div class="code-toolbar">
					<div class="language-switch" aria-label="Code language">
						<button type="button" class:active={tsEnabled} on:click={() => (tsEnabled = true)}
							>TS</button
						>
						<button type="button" class:active={!tsEnabled} on:click={() => (tsEnabled = false)}
							>JS</button
						>
					</div>
					<CopyButton copyText={code} />
				</div>
				<!-- eslint-disable svelte/no-at-html-tags -->
				<pre><code>{@html Prism.highlight(code, Prism.languages.svelte, 'svelte')}</code></pre>
				<!-- eslint-enable svelte/no-at-html-tags -->
			</div>
		{/if}
	</aside>
{/if}

<style>
	.showcase-shell {
		position: relative;
		display: grid;
		grid-template-rows: auto 1fr;
		min-height: 100svh;
		padding: 1.25rem clamp(1rem, 3vw, 2.5rem) 2rem;
		overflow: hidden;
	}

	.topbar {
		position: relative;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		max-width: 88rem;
		margin: 0 auto;
	}

	.library-description {
		margin: 0;
		color: #8290a3;
		font-size: 0.8rem;
		font-weight: 550;
		letter-spacing: 0.015em;
	}

	.package-version {
		margin-left: auto;
		margin-right: 0.8rem;
		padding: 0.22rem 0.48rem;
		border: 1px solid rgba(148, 163, 184, 0.16);
		border-radius: 999px;
		color: #aab5c4;
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
		font-size: 0.7rem;
		font-weight: 650;
		line-height: 1;
	}

	.toolbar {
		display: flex;
		gap: 0.4rem;
		padding: 0.3rem;
		border: 1px solid rgba(148, 163, 184, 0.11);
		border-radius: 0.85rem;
		background: rgba(13, 19, 29, 0.68);
		box-shadow:
			0 12px 34px rgba(0, 0, 0, 0.16),
			inset 0 1px 0 rgba(255, 255, 255, 0.035);
		backdrop-filter: blur(18px);
	}

	.toolbar button {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.52rem 0.72rem;
		border-radius: 0.58rem;
		color: #8f9bad;
		font-size: 0.77rem;
		font-weight: 600;
		transition:
			color 150ms ease,
			background 150ms ease,
			transform 150ms ease;
	}

	.toolbar button:hover,
	.toolbar button.active {
		background: rgba(255, 255, 255, 0.07);
		color: #e5eaf1;
	}

	.toolbar button:active {
		transform: scale(0.97);
	}
	.toolbar svg {
		width: 1rem;
		height: 1rem;
		stroke-width: 1.75;
	}

	.board-stage {
		position: relative;
		display: grid;
		place-items: center;
		min-height: 0;
		padding: 1.5rem 0 0;
	}

	.board-glow {
		position: absolute;
		left: 50%;
		top: 50%;
		width: min(80vw, 60rem);
		aspect-ratio: 1;
		transform: translate(-50%, -50%);
		border-radius: 50%;
		background: radial-gradient(
			circle,
			rgba(57, 93, 111, 0.14) 0%,
			rgba(27, 45, 58, 0.055) 42%,
			transparent 70%
		);
		filter: blur(12px);
		pointer-events: none;
	}

	.board-frame {
		position: relative;
		z-index: 1;
		width: min(
			calc((100svh - 6.5rem) * (var(--boardScale, 90) / 100 * 0.7 + 0.3)),
			calc(100vw - 2rem),
			58rem
		);
		filter: drop-shadow(0 28px 50px rgba(0, 0, 0, 0.27));
	}

	.panel-backdrop {
		position: fixed;
		z-index: 40;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
		background: rgba(3, 7, 13, 0.42);
		backdrop-filter: blur(2px);
		cursor: default;
	}

	.studio-panel {
		position: fixed;
		z-index: 50;
		top: 0.75rem;
		right: 0.75rem;
		bottom: 0.75rem;
		display: flex;
		flex-direction: column;
		width: min(36rem, calc(100vw - 1.5rem));
		border: 1px solid rgba(148, 163, 184, 0.15);
		border-radius: 1.25rem;
		background: rgba(13, 19, 29, 0.96);
		box-shadow:
			-16px 0 60px rgba(0, 0, 0, 0.34),
			inset 0 1px 0 rgba(255, 255, 255, 0.045);
		backdrop-filter: blur(24px);
		overflow: hidden;
	}

	.panel-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem;
		border-bottom: 1px solid rgba(148, 163, 184, 0.1);
	}

	.panel-tabs {
		display: flex;
		gap: 0.25rem;
		padding: 0.22rem;
		border-radius: 0.7rem;
		background: rgba(255, 255, 255, 0.035);
	}

	.panel-tabs button {
		padding: 0.48rem 0.8rem;
		border-radius: 0.5rem;
		color: #778396;
		font-size: 0.78rem;
		font-weight: 650;
		transition:
			background 150ms ease,
			color 150ms ease,
			box-shadow 150ms ease;
	}

	.panel-tabs button.active {
		background: rgba(255, 255, 255, 0.085);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
		color: #edf2f7;
	}

	.close-button {
		display: grid;
		place-items: center;
		width: 2.2rem;
		height: 2.2rem;
		border-radius: 0.65rem;
		color: #718096;
		transition:
			background 150ms ease,
			color 150ms ease;
	}

	.close-button:hover {
		background: rgba(255, 255, 255, 0.06);
		color: #e5e7eb;
	}
	.close-button svg {
		width: 1.15rem;
		height: 1.15rem;
		stroke-width: 1.8;
	}

	.panel-content {
		min-height: 0;
		overflow: auto;
	}

	.settings-content {
		padding: 1.2rem;
	}

	.panel-intro {
		margin: 0 0 1rem 0.15rem;
	}
	.panel-intro p {
		margin: 0;
		color: #f1f5f9;
		font-size: 1rem;
		font-weight: 650;
	}
	.panel-intro span {
		display: block;
		margin-top: 0.18rem;
		color: #64748b;
		font-size: 0.75rem;
	}

	.control-list {
		display: grid;
		gap: 0.55rem;
	}

	.settings-content :global(label) {
		color: #aeb8c7;
	}

	.settings-content :global(select),
	.settings-content :global(input[type='number']) {
		min-height: 1.85rem;
		padding: 0.2rem 0.48rem;
		border: 1px solid rgba(148, 163, 184, 0.18);
		border-radius: 0.48rem;
		background: #171f2b;
		color: #dce3ec;
		font-size: 0.76rem;
		transition:
			border-color 150ms ease,
			background 150ms ease;
	}

	.settings-content :global(select:hover),
	.settings-content :global(input[type='number']:hover) {
		border-color: rgba(148, 163, 184, 0.32);
		background: #1a2431;
	}

	.settings-content :global(select:focus-visible),
	.settings-content :global(input:focus-visible) {
		outline: 2px solid rgba(56, 189, 248, 0.65);
		outline-offset: 2px;
	}

	.code-content {
		display: flex;
		flex: 1;
		flex-direction: column;
		padding: 1rem;
	}

	.code-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.75rem;
	}

	.language-switch {
		display: flex;
		gap: 0.2rem;
		padding: 0.2rem;
		border-radius: 0.6rem;
		background: rgba(255, 255, 255, 0.04);
	}

	.language-switch button {
		padding: 0.35rem 0.55rem;
		border-radius: 0.43rem;
		color: #64748b;
		font:
			650 0.68rem/1 ui-monospace,
			SFMono-Regular,
			Menlo,
			monospace;
		transition:
			color 150ms ease,
			background 150ms ease;
	}

	.language-switch button.active {
		background: rgba(250, 204, 21, 0.1);
		color: #facc15;
	}

	.code-content pre {
		flex: 1;
		min-height: 0;
		margin: 0;
		padding: 1rem;
		border: 1px solid rgba(148, 163, 184, 0.1);
		border-radius: 0.85rem;
		background: #0b1018;
		overflow: auto;
		font-size: 0.76rem;
		line-height: 1.65;
	}

	@media (max-width: 640px) {
		.showcase-shell {
			padding: 0.8rem 0.75rem 1rem;
		}
		.library-description {
			max-width: 10rem;
			font-size: 0.7rem;
			line-height: 1.3;
		}
		.toolbar button span {
			display: none;
		}
		.toolbar button {
			padding: 0.58rem;
		}
		.toolbar svg {
			width: 1.1rem;
			height: 1.1rem;
		}
		.board-stage {
			padding-top: 0.75rem;
		}
		.board-frame {
			width: min(
				calc((100svh - 5.5rem) * (var(--boardScale, 90) / 100 * 0.7 + 0.3)),
				calc(100vw - 1.5rem)
			);
		}
		.studio-panel {
			top: 0.4rem;
			right: 0.4rem;
			bottom: 0.4rem;
			width: calc(100vw - 0.8rem);
			border-radius: 1rem;
		}
	}
</style>

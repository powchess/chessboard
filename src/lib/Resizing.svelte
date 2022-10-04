<script lang="ts">
	import resizing from './boardResizing';
	import boardThemesStyles from './boardThemes/boardThemes';
	import type Chessboard from './chessboard';

	export let chessboard: Chessboard;
	export let setSize: (size: number) => void;
	export let mouseEvents = true;
</script>

<div
	on:pointerdown|stopPropagation
	use:resizing={{
		mouseEvents,
		minWidth: chessboard.state.board.resizible.min,
		maxWidth: chessboard.state.board.resizible.max,
		curWidth: chessboard.state.board.size
	}}
	on:resizing={(e) => setSize(e.detail.size)}
	on:endResizing={(e) => setSize(e.detail.size)}
	style="color: {boardThemesStyles.colors[chessboard.state.board.boardTheme].black};"
	class={mouseEvents ? 'cursor-nwse-resize' : ''}
>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
		<path d="M 5 1 Q 6 0 6 2 L 6 4 Q 6 6 4 6 L 2 6 Q 0 6 1 5 Z" />
	</svg>
</div>

<style>
	div {
		display: none;
		position: absolute;
		bottom: 0;
		right: 0;
		transform: translate(50%, 50%);
		width: 3.125%;
		height: 3.125%;
		z-index: 4;
	}

	@media (min-width: 1024px) {
		div {
			display: inline;
		}
	}
</style>

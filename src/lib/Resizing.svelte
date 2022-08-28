<script lang="ts">
	import resizing from './boardResizing';
	import { boardThemesStyles } from './boardThemes/boardThemes';
	import type Chessboard from './chessboard';

	export let chessboard: Chessboard;
	export let setSize: (size: number) => void;
</script>

<div
	on:pointerdown|stopPropagation
	use:resizing={{
		minWidth: chessboard.state.resizible.settings.min,
		maxWidth: chessboard.state.resizible.settings.max,
		curWidth: chessboard.state.board.size
	}}
	on:resizing={(e) => setSize(e.detail.size)}
	on:endResizing={(e) => setSize(e.detail.size)}
	style="width: 3.125%;
			height: 3.125%; color: {boardThemesStyles.colors[chessboard.state.board.boardTheme].black};"
	class="absolute bottom-0 right-0 z-30 hidden translate-x-1/2 translate-y-1/2 cursor-nwse-resize lg:inline"
>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
		<path d="M 5 1 Q 6 0 6 2 L 6 4 Q 6 6 4 6 L 2 6 Q 0 6 1 5 Z" />
	</svg>
</div>

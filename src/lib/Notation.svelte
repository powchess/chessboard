<script lang="ts">
	import type { BoardTheme } from './boardConfig';
	import boardThemesStyles from './boardThemes/boardThemes';

	export let theme: BoardTheme;
	export let flipped: boolean;

	const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

	let totalHeight: number;
	$: fontSize = Math.floor(Math.log(totalHeight / 8) * 3);
</script>

<div class="files noselect">
	{#each files as file, i}
		<span
			data-file={file}
			style="--font-size: {fontSize}px; color: {i % 2 === 0
				? boardThemesStyles.colors[theme].white
				: boardThemesStyles.colors[theme].black};"
		>
			{files[flipped ? Math.abs(i - 7) : i]}
		</span>
	{/each}
</div>
<div bind:clientHeight={totalHeight} class="ranks noselect">
	{#each files as file, i}
		<span
			data-file={file}
			style="--font-size: {fontSize}px; color: {i % 2 === 0
				? boardThemesStyles.colors[theme].white
				: boardThemesStyles.colors[theme].black};{flipped ? ' text-align: right;' : ''}"
		>
			{flipped ? i + 1 : Math.abs(i - 8)}
		</span>
	{/each}
</div>

<style>
	div {
		position: absolute;
		display: flex;
		overflow: hidden;
	}

	.files {
		bottom: 0;
		left: 0;
		width: 100%;
		height: max-content;
	}

	.ranks {
		top: 0;
		right: 0;
		height: 100%;
		width: max-content;
		flex-direction: column;
	}

	.files span {
		width: 12.5%;
		padding-left: calc(var(--font-size) / 4);
		padding-bottom: calc(var(--font-size) / 6);
	}

	.ranks span {
		height: 12.5%;
		padding-top: calc(var(--font-size) / 4);
		padding-right: calc(var(--font-size) / 10);
	}

	span {
		font-size: var(--font-size);
		line-height: var(--font-size);
	}
</style>

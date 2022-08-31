<script lang="ts">
	import type { BoardThemes } from './boardConfig';
	import { boardThemesStyles } from './boardThemes/boardThemes';

	export let theme: BoardThemes;
	export let flipped: boolean;

	const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
</script>

<div class="files noselect">
	{#each files as _, i}
		<span style="color: {i % 2 === 0 ? boardThemesStyles.colors[theme].white : boardThemesStyles.colors[theme].black};">
			{files[flipped ? Math.abs(i - 7) : i]}
		</span>
	{/each}
</div>
<div class="ranks noselect">
	{#each files as _, i}
		<span
			style="color: {i % 2 === 0 ? boardThemesStyles.colors[theme].white : boardThemesStyles.colors[theme].black};"
			class={flipped ? '' : 'text-right'}
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
		padding-left: 3px;
		width: 12.5%;
	}

	.ranks span {
		padding-top: 2px;
		padding-right: 2px;
		height: 12.5%;
	}
</style>

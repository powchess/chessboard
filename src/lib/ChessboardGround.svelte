<script lang="ts">
	export let white: string;
	export let black: string;
</script>

<svg id="test" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" shape-rendering="crispEdges" class="rounded">
	<g id="a">
		<g id="b">
			<g id="c">
				<g id="d">
					<rect width="1" height="1" fill={white} id="e" />
					<rect y="1" width="1" height="1" fill={black} id="f" />
					<use x="1" y="1" href="#e" />
					<use x="1" y="-1" href="#f" />
				</g>
				<use x="2" href="#d" />
			</g>
			<use x="4" href="#c" />
		</g>
		<use y="2" href="#b" />
	</g>
	<use y="4" href="#a" />
</svg>

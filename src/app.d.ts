declare namespace App {
	// interface Locals {}
	// interface PageData {}
	// interface Platform {}
	// interface PrivateEnv {}
	// interface PublicEnv {}
}

declare namespace svelte.JSX {
	// eslint-disable-next-line
	interface HTMLProps<T> {
		onstartMoving?: (e: CustomEvent) => void;
		onsquareover?: (e: CustomEvent) => void;
		onanimationEnded?: (e: CustomEvent) => void;
		oncaptured?: (e: CustomEvent) => void;
		ondropped?: (e: CustomEvent) => void;
		onclicked?: (e: CustomEvent) => void;
		oncanceled?: (e: CustomEvent) => void;
		onmovemadeUndo?: (e: CustomEvent) => void;
		onpieceCaptured?: (e: CustomEvent) => void;
		onmovemadeSilent?: (e: CustomEvent) => void;
		onnewPreMove?: (e: CustomEvent) => void;
		onerror?: (e: ErrorEvent) => void;
		onresizing?: (e: CustomEvent) => void;
		onendResizing?: (e: CustomEvent) => void;
		ondrawCircle?: (e: CustomEvent) => void;
		ondrawArrow?: (e: CustomEvent) => void;
	}
}

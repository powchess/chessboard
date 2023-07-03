declare namespace App {
	// interface Locals {}
	// interface PageData {}
	// interface Platform {}
	// interface PrivateEnv {}
	// interface PublicEnv {}
}

declare namespace svelteHTML {
	interface HTMLAttributes {
		'on:startMoving'?: (e: CustomEvent) => void;
		'on:squareover'?: (e: CustomEvent) => void;
		oncaptured?: (e: CustomEvent) => void;
		'on:dropped'?: (e: CustomEvent) => void;
		'on:clicked'?: (e: CustomEvent) => void;
		oncanceled?: (e: CustomEvent) => void;
		onmovemadeUndo?: (e: CustomEvent) => void;
		onpieceCaptured?: (e: CustomEvent) => void;
		onmovemadeSilent?: (e: CustomEvent) => void;
		onnewPreMove?: (e: CustomEvent) => void;
		onerror?: (e: ErrorEvent) => void;
		'on:resizing'?: (e: CustomEvent) => void;
		'on:endResizing'?: (e: CustomEvent) => void;
		'on:drawCircle'?: (e: CustomEvent) => void;
		'on:drawArrow'?: (e: CustomEvent) => void;
	}
}

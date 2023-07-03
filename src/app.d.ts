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
		'on:captured'?: (e: CustomEvent<void>) => void;
		'on:dropped'?: (e: CustomEvent) => void;
		'on:clicked'?: (e: CustomEvent) => void;
		'on:canceled'?: (e: CustomEvent<void>) => void;
		'on:resizing'?: (e: CustomEvent) => void;
		'on:endResizing'?: (e: CustomEvent) => void;
		'on:drawCircle'?: (e: CustomEvent) => void;
		'on:drawArrow'?: (e: CustomEvent) => void;
	}
}

declare namespace App {
	// interface Locals {}
	// interface PageData {}
	// interface Platform {}
	// interface PrivateEnv {}
	// interface PublicEnv {}
}

declare namespace svelte.JSX {
	interface HTMLProps<T> {
		onmovemade?: (e: CustomEvent) => void;
		onstartMoving?: (e: CustomEvent) => void;
		onmoving?: (e: CustomEvent) => void;
		onanimationEnded?: (e: CustomEvent) => void;
		ondropped?: (e: CustomEvent) => void;
		onclicked?: (e: CustomEvent) => void;
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

type TupleToUnion<T extends any[]> = T[number];
type IndicesTo<T extends number, I extends number[] = []> = I['length'] extends T
	? I
	: IndicesTo<T, [...I, I['length']]>;

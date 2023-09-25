import type { ChessboardConfig } from '$lib/boardConfig.js';
import type { Piece } from '$lib/state/index.js';

export default class SelectableState {
	public enabled: boolean;

	public selectedPiece: Piece | undefined;

	public defaultState = {
		enabled: true,
		selectedPiece: undefined
	} as const;

	constructor(config?: ChessboardConfig['selectable']) {
		this.enabled = this.defaultState.enabled;
		this.selectedPiece = this.defaultState.selectedPiece;

		this.setConfigSettings(config);
	}

	public setConfigSettings = (config?: ChessboardConfig['selectable']) => {
		if (config !== undefined) this.enabled = config;
	};

	public getConfig = () => {
		if (this.enabled !== this.defaultState.enabled) return this.enabled;
		return undefined;
	};
}

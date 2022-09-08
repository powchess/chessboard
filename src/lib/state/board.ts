import type { BoardTheme, ChessboardConfig, PiecesTheme } from '$lib/boardConfig';
import { defaultFEN } from '$lib/state/index';

export default class BoardState {
	public boardTheme: BoardTheme;

	public piecesTheme: PiecesTheme;

	public flipped: boolean;

	public notation: boolean;

	public shadow: boolean;

	public startFen: string;

	public size: number;

	public defaultState = {
		boardTheme: 'standard',
		piecesTheme: 'standard',
		flipped: false,
		notation: true,
		shadow: false,
		startFen: defaultFEN,
		size: 0
	} as const;

	constructor(config?: ChessboardConfig['board']) {
		this.boardTheme = this.defaultState.boardTheme;
		this.piecesTheme = this.defaultState.piecesTheme;
		this.flipped = this.defaultState.flipped;
		this.notation = this.defaultState.notation;
		this.shadow = this.defaultState.shadow;
		this.startFen = this.defaultState.startFen;

		this.size = this.defaultState.size;

		this.setConfigSettings(config);
	}

	public setConfigSettings = (config?: ChessboardConfig['board']) => {
		if (config !== undefined) {
			if (config.boardTheme !== undefined) this.boardTheme = config.boardTheme;
			if (config.piecesTheme !== undefined) this.piecesTheme = config.piecesTheme;
			if (config.notation !== undefined) this.notation = config.notation;
			if (config.shadow !== undefined) this.shadow = config.shadow;
			if (config.flipped !== undefined) this.flipped = config.flipped;
			if (config.startFen !== undefined) this.startFen = config.startFen;
		}
	};

	public getConfig = () => {
		const cfg = {
			...(this.boardTheme !== this.defaultState.boardTheme && { boardTheme: this.boardTheme }),
			...(this.piecesTheme !== this.defaultState.piecesTheme && { piecesTheme: this.piecesTheme }),
			...(this.flipped !== this.defaultState.flipped && { flipped: this.flipped }),
			...(this.notation !== this.defaultState.notation && { notation: this.notation }),
			...(this.shadow !== this.defaultState.shadow && { shadow: this.shadow }),
			...(this.startFen !== this.defaultState.startFen && { startFen: this.startFen })
		};
		if (Object.keys(cfg).length === 0) return undefined;
		return cfg;
	};
}

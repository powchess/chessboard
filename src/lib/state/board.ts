import type { BoardTheme, ChessboardConfig, PiecesTheme } from '$lib/boardConfig';
import { defaultFEN } from '$lib/state/index';

export default class BoardState {
	public boardTheme: BoardTheme;

	public piecesTheme: PiecesTheme;

	public mouseEvents: boolean;

	public flipped: boolean;

	public notation: boolean;

	public style: {
		shadow: boolean;
		borderRadius: `${number}rem` | `${number}px`;
	};

	public startFen: string;

	public size: number;

	public scale: number;

	public resizible: boolean;

	public defaultState = {
		boardTheme: 'standard',
		piecesTheme: 'standard',
		mouseEvents: true,
		flipped: false,
		notation: true,
		shadow: false,
		startFen: defaultFEN,
		size: 0,
		scale: 70,
		style: {
			shadow: false,
			borderRadius: '0rem'
		},
		resizible: false
	} as const;

	constructor(config?: ChessboardConfig['board']) {
		this.boardTheme = this.defaultState.boardTheme;
		this.piecesTheme = this.defaultState.piecesTheme;
		this.mouseEvents = this.defaultState.mouseEvents;
		this.flipped = this.defaultState.flipped;
		this.notation = this.defaultState.notation;
		this.startFen = this.defaultState.startFen;

		this.size = this.defaultState.size;
		this.scale = this.defaultState.scale;
		this.style = { ...this.defaultState.style };
		this.resizible = this.defaultState.resizible;

		this.setConfigSettings(config);
	}

	public setConfigSettings = (config?: ChessboardConfig['board']) => {
		if (config !== undefined) {
			if (config.boardTheme !== undefined) this.boardTheme = config.boardTheme;
			if (config.piecesTheme !== undefined) this.piecesTheme = config.piecesTheme;
			if (config.mouseEvents !== undefined) this.mouseEvents = config.mouseEvents;
			if (config.flipped !== undefined) this.flipped = config.flipped;
			if (config.notation !== undefined) this.notation = config.notation;
			if (config.startFen !== undefined) this.startFen = config.startFen;
			if (config.style !== undefined) {
				if (config.style.shadow !== undefined) this.style.shadow = config.style.shadow;
				if (config.style.borderRadius !== undefined) this.style.borderRadius = config.style.borderRadius;
			}
			if (config.resizible !== undefined) this.resizible = config.resizible;
		}
	};

	public getConfig = () => {
		const cfg = {
			...(this.boardTheme !== this.defaultState.boardTheme && { boardTheme: this.boardTheme }),
			...(this.piecesTheme !== this.defaultState.piecesTheme && { piecesTheme: this.piecesTheme }),
			...(this.mouseEvents !== this.defaultState.mouseEvents && { mouseEvents: this.mouseEvents }),
			...(this.flipped !== this.defaultState.flipped && { flipped: this.flipped }),
			...(this.notation !== this.defaultState.notation && { notation: this.notation }),
			...(this.startFen !== this.defaultState.startFen && { startFen: this.startFen }),
			...((this.style.shadow !== this.defaultState.style.shadow || this.style.borderRadius !== this.defaultState.style.borderRadius) && {
				style: {
					...(this.style.shadow !== this.defaultState.style.shadow && { shadow: this.style.shadow }),
					...(this.style.borderRadius !== this.defaultState.style.borderRadius && { borderRadius: this.style.borderRadius })
				}
			}),
			...(this.resizible !== this.defaultState.resizible && { resizible: this.resizible })
		};
		if (Object.keys(cfg).length === 0) return undefined;
		return cfg;
	};
}
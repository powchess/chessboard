import type { BoardTheme, ChessboardConfig } from '$lib/boardConfig.js';
import { defaultFEN } from '$lib/state/index.js';
import type { Piece, PieceId } from './piece.js';

export type PieceSkins = {
	[K in PieceId]?: string;
};
export default class BoardState {
	public boardTheme: BoardTheme;

	public skins: {
		enabled: boolean;
		urls: PieceSkins;
	};

	public mouseEvents: boolean;

	public flipped: boolean;

	public notation: boolean;

	public startFen: string;

	public startPieces: Piece[];

	public size: number;

	public scale: number;

	public resizible: boolean;

	public defaultState = {
		boardTheme: 'standard',
		skins: {
			enabled: false,
			urls: {}
		},
		mouseEvents: true,
		flipped: false,
		notation: true,
		shadow: false,
		startFen: defaultFEN,
		startPieces: [] as Piece[],
		size: 0,
		scale: 70,
		resizible: false
	} as const;

	constructor(config?: ChessboardConfig['board']) {
		this.boardTheme = this.defaultState.boardTheme;
		this.skins = this.defaultState.skins;
		this.mouseEvents = this.defaultState.mouseEvents;
		this.flipped = this.defaultState.flipped;
		this.notation = this.defaultState.notation;
		this.startFen = this.defaultState.startFen;
		this.startPieces = this.defaultState.startPieces;

		this.size = this.defaultState.size;
		this.scale = this.defaultState.scale;
		this.resizible = this.defaultState.resizible;

		this.setConfigSettings(config);
	}

	public setConfigSettings = (config?: ChessboardConfig['board']) => {
		if (config !== undefined) {
			this.boardTheme = config?.boardTheme ?? this.boardTheme;
			this.skins.enabled = config?.skins?.enabled ?? this.skins.enabled;
			this.skins.urls = config?.skins?.urls ?? this.skins.urls;
			this.mouseEvents = config?.mouseEvents ?? this.mouseEvents;
			this.flipped = config?.flipped ?? this.flipped;
			this.notation = config?.notation ?? this.notation;
			this.startFen = config?.startFen ?? this.startFen;
			this.startPieces = config?.startPieces ?? this.startPieces;
			this.scale = config?.scale ?? this.scale;
			this.resizible = config?.resizible ?? this.resizible;
		}
	};

	public getConfig = () => {
		const cfg = {
			...(this.boardTheme !== this.defaultState.boardTheme && { boardTheme: this.boardTheme }),
			...(this.skins !== this.defaultState.skins && { piecesTheme: this.skins }),
			...(this.mouseEvents !== this.defaultState.mouseEvents && { mouseEvents: this.mouseEvents }),
			...(this.flipped !== this.defaultState.flipped && { flipped: this.flipped }),
			...(this.notation !== this.defaultState.notation && { notation: this.notation }),
			...(this.startFen !== this.defaultState.startFen && { startFen: this.startFen }),
			...(this.scale !== this.defaultState.scale && { scale: this.scale }),
			...(this.resizible !== this.defaultState.resizible && { resizible: this.resizible })
		};
		if (Object.keys(cfg).length === 0) return undefined;
		return cfg;
	};
}

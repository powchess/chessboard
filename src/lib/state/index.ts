import type { ChessPiece } from '../chessTypes';
import type { ChessboardConfig, KingLocations } from '../boardConfig';
import BoardState from './board';
import MovableState from './movable';
import DraggableState from './draggable';
import SelectableState from './selectable';
import LegalState from './legal';
import HighlightState from './highlight';
import DrawToolsState from './drawTools';
import SoundsState from './sounds';
import ResizibleState from './resizible';
import type { Color, SquareColor } from '$lib/enums';

export const defaultFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export type ArrowData = {
	move: string;
	color: string;
	opacity: number;
};

export type Piece = { square: string; name: ChessPiece };
export type Square = { square: string; color: SquareColor };

export class State {
	public pieces: Piece[];

	public markedSquares: Set<Square>;

	public board: BoardState;

	public movable: MovableState;

	public draggable: DraggableState;

	public selectable: SelectableState;

	public legal: LegalState;

	public callbacks: {
		getLegalMoves?: () => string[];
		getPreMoves?: () => string[];
		beforeMove?: (move: string) => void;
		afterMove?: (move: string) => void;
		getLastMove?: () => string;
		getLastMoveSAN?: () => string;
		getKingLocations?: () => KingLocations;
		getInCheck?: () => Color.WHITE | Color.BLACK | undefined;
		getWhiteToMove?: () => boolean;
	};

	public highlight: HighlightState;

	public drawTools: DrawToolsState;

	public sounds: SoundsState;

	public resizible: ResizibleState;

	constructor(cfg?: ChessboardConfig) {
		this.pieces = [];
		this.markedSquares = new Set();

		this.board = new BoardState(cfg?.board);
		this.movable = new MovableState(cfg?.movable);
		this.draggable = new DraggableState(cfg?.draggable);
		this.selectable = new SelectableState(cfg?.selectable);
		this.legal = new LegalState(cfg?.legal);

		this.callbacks = {};

		this.highlight = new HighlightState(cfg?.highlight);
		this.drawTools = new DrawToolsState(cfg?.drawTools);
		this.sounds = new SoundsState(cfg?.sounds);
		this.resizible = new ResizibleState(cfg?.resizible);
	}

	public setConfigSettings(cfg: ChessboardConfig) {
		this.board.setConfigSettings(cfg.board);
		this.movable.setConfigSettings(cfg.movable);
		this.draggable.setConfigSettings(cfg.draggable);
		this.selectable.setConfigSettings(cfg.selectable);
		this.legal.setConfigSettings(cfg.legal);

		// callbacks
		if (cfg.callbacks !== undefined) {
			if (cfg.callbacks.getLegalMoves) this.callbacks.getLegalMoves = cfg.callbacks.getLegalMoves;
			if (cfg.callbacks.getPreMoves) this.callbacks.getPreMoves = cfg.callbacks.getPreMoves;
			if (cfg.callbacks.beforeMove) this.callbacks.beforeMove = cfg.callbacks.beforeMove;
			if (cfg.callbacks.afterMove) this.callbacks.afterMove = cfg.callbacks.afterMove;
			if (cfg.callbacks.getLastMove) this.callbacks.getLastMove = cfg.callbacks.getLastMove;
			if (cfg.callbacks.getLastMoveSAN) this.callbacks.getLastMoveSAN = cfg.callbacks.getLastMoveSAN;
			if (cfg.callbacks.getKingLocations) this.callbacks.getKingLocations = cfg.callbacks.getKingLocations;
			if (cfg.callbacks.getInCheck) this.callbacks.getInCheck = cfg.callbacks.getInCheck;
			if (cfg.callbacks.getWhiteToMove) this.callbacks.getWhiteToMove = cfg.callbacks.getWhiteToMove;
		}

		this.highlight.setConfigSettings(cfg.highlight);
		this.drawTools.setConfigSettings(cfg.drawTools);
		this.sounds.setConfigSettings(cfg.sounds);
		this.resizible.setConfigSettings(cfg.resizible);
	}

	public getConfig = (): ChessboardConfig => ({
		board: this.board.getConfig(),
		movable: this.movable.getConfig(),
		draggable: this.draggable.getConfig(),
		selectable: this.selectable.getConfig(),
		legal: this.legal.getConfig(),
		highlight: this.highlight.getConfig(),
		drawTools: this.drawTools.getConfig(),
		sounds: this.sounds.getConfig(),
		resizible: this.resizible.getConfig()
	});
}

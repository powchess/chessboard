import type { ChessPiece } from '../chessTypes';
import type { ChessboardConfig } from '../boardConfig';
import BoardState from './board';
import MovableState from './movable';
import DraggableState from './draggable';
import SelectableState from './selectable';
import LegalState from './legal';
import HighlightState from './highlight';
import DrawToolsState from './drawTools';
import SoundsState from './sounds';
import type { SquareColor } from '$lib/enums';
import Callbacks from './callbacks';

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

	public callbacks: Callbacks;

	public highlight: HighlightState;

	public drawTools: DrawToolsState;

	public sounds: SoundsState;

	constructor(cfg?: ChessboardConfig) {
		this.pieces = [];
		this.markedSquares = new Set();

		this.board = new BoardState(cfg?.board);
		this.movable = new MovableState(cfg?.movable);
		this.draggable = new DraggableState(cfg?.draggable);
		this.selectable = new SelectableState(cfg?.selectable);
		this.legal = new LegalState(cfg?.legal);

		this.callbacks = new Callbacks(cfg?.callbacks);

		this.highlight = new HighlightState(cfg?.highlight);
		this.drawTools = new DrawToolsState(cfg?.drawTools);
		this.sounds = new SoundsState(cfg?.sounds);
	}

	public setConfigSettings(cfg: ChessboardConfig) {
		this.board.setConfigSettings(cfg.board);
		this.movable.setConfigSettings(cfg.movable);
		this.draggable.setConfigSettings(cfg.draggable);
		this.selectable.setConfigSettings(cfg.selectable);
		this.legal.setConfigSettings(cfg.legal);
		this.callbacks.setConfigSettings(cfg.callbacks);
		this.highlight.setConfigSettings(cfg.highlight);
		this.drawTools.setConfigSettings(cfg.drawTools);
		this.sounds.setConfigSettings(cfg.sounds);
	}

	public getConfig = (): ChessboardConfig => ({
		board: this.board.getConfig(),
		movable: this.movable.getConfig(),
		draggable: this.draggable.getConfig(),
		selectable: this.selectable.getConfig(),
		legal: this.legal.getConfig(),
		...(this.legal.enabled && { callbacks: this.callbacks.getConfig() }),
		highlight: this.highlight.getConfig(),
		drawTools: this.drawTools.getConfig(),
		sounds: this.sounds.getConfig()
	});
}

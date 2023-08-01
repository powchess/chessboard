import type { ChessPiece, ChessSquare } from '../chessTypes';
import type { ChessboardConfig } from '../boardConfig';
import BoardState from './board';
import MovableState from './movable';
import DraggableState from './draggable';
import SelectableState from './selectable';
import LegalState from './legal';
import HighlightState from './highlight';
import DrawToolsState from './drawTools';
import SoundsState from './sounds';
import type { SquareType } from '$lib/enums';
import Callbacks from './callbacks';

export const defaultFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export type ArrowData = {
	move: string;
	color: string;
	opacity: number;
};

export type Piece = { square: ChessSquare; name: ChessPiece };
export type Square = { square: ChessSquare; color: SquareType };

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

	public get legalEnabled() {
		return this.legal.enabled;
	}

	public get preMovesEnabled() {
		return this.legal.enabled && this.legal.preMoves.enabled;
	}

	public get legalMoves() {
		return this.legalEnabled ? this.legal.moves : [];
	}

	public set legalMoves(moves: string[]) {
		if (!this.legalEnabled) return;
		this.legal.moves = moves;
	}

	public get preMoves() {
		return this.preMovesEnabled ? this.legal.preMoves.moves : [];
	}

	public set preMoves(moves: string[]) {
		if (!this.preMovesEnabled) return;
		this.legal.preMoves.moves = moves;
	}

	public get flipped() {
		return this.board.flipped;
	}

	public set flipped(flppd: boolean) {
		this.board.flipped = flppd;
	}

	public get currentPreMove() {
		return this.legal.preMoves.curMove;
	}

	public set currentPreMove(move: string) {
		this.legal.preMoves.curMove = move;
	}

	public get selectableEnabled() {
		return this.selectable.enabled;
	}

	public get draggableEnabled() {
		return this.draggable.enabled;
	}

	public get selectedPiece() {
		return this.selectableEnabled ? this.selectable.selectedPiece : undefined;
	}

	public set selectedPiece(piece: Piece | undefined) {
		if (!this.selectableEnabled) this.selectable.selectedPiece = undefined;
		else this.selectable.selectedPiece = piece;
	}

	public get whiteToMove() {
		return this.legal.whiteToMove;
	}

	public set whiteToMove(wtmv: boolean) {
		if (!this.legalEnabled) return;
		this.legal.whiteToMove = wtmv;
	}

	public get lastMove() {
		return this.legalEnabled ? this.legal.lastMove : '';
	}

	public set lastMove(move: string) {
		if (move.length < 4 && move !== '') return;
		if (!this.legalEnabled) this.legal.lastMove = '';
		else this.legal.lastMove = move;
	}

	public get highlightEnabled() {
		return this.highlight.enabled;
	}

	public get highlightSettings() {
		return this.highlight.settings;
	}

	public get soundsEnabled() {
		return this.sounds.enabled;
	}

	public get ghostPieceEnabled() {
		return this.draggable.ghostPiece.enabled;
	}

	public get ghostPiece() {
		return this.draggable.ghostPiece.piece;
	}

	public set ghostPiece(piece: Piece | undefined) {
		if (!this.ghostPieceEnabled) this.draggable.ghostPiece.piece = undefined;
		this.draggable.ghostPiece.piece = piece;
	}

	public get movableEnabled() {
		return this.movable.enabled;
	}
}

import type { BoardThemes } from './boardThemes/boardThemes';
import type { PiecesThemes } from './piecesThemes/piecesThemes';
import type { ChessPiece } from './types/chess';
import {
	Color,
	type ChessboardConfig,
	type EasingFuncs,
	type KingLocations,
	type SquareColor
} from './types/chessboard';

const defaultFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export type ArrowData = {
	move: string;
	color: string;
	opacity: number;
};

export type piece = { square: string; name: ChessPiece };
export type square = { square: string; color: SquareColor };

export class State {
	public pieces: piece[];
	public markedSquares: Set<square>;

	public board: {
		boardTheme: BoardThemes;
		piecesTheme: PiecesThemes;
		flipped: boolean;
		notation: boolean;
		shadow: boolean;
		startFen: string;
		size: number;
	};

	public movable: {
		enabled: boolean;
		color: 'both' | Color.WHITE | Color.BLACK;
	};

	public draggable: {
		enabled: boolean;
		ghostPiece: {
			enabled: boolean;
			piece: piece | undefined;
		};
		transition: {
			enabled: boolean;
			settings: {
				duration: number;
				easing: EasingFuncs;
			};
		};
	};

	public selectable: {
		enabled: boolean;
		selectedPiece: piece | undefined;
	};

	public legal: {
		enabled: boolean;
		whiteToMove: boolean;
		moves: string[];
		settings: {
			allowPromotion: boolean;
			allowEnPassant: boolean;
			allowCastling: boolean;
		};
		preMoves: {
			enabled: boolean;
			moves: string[];
			curMove: string;
		};
		lastMove: string;
	};

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

	public highlight: {
		enabled: boolean;
		settings: {
			select: boolean;
			legal: boolean;
			move: boolean;
			preMove: boolean;
			nextMove: boolean;
			check: boolean;
		};
	};

	public drawTools: {
		enabled: boolean;
		engineArrows: ArrowData[];
		settings: {
			LshapeKnightMove: boolean;
			onlyChessMove: boolean;
		};
	};

	public sounds: {
		enabled: boolean;
		settings: {
			MOVE: boolean;
			CAPTURE: boolean;
			CASTLE: boolean;
			UNDO: boolean;
		};
	};

	public resizible: {
		enabled: boolean;
		settings: {
			min: number;
			max: number;
		};
	};

	constructor(cfg?: ChessboardConfig) {
		// TODO: Replace default values with config values
		const cbSettings = {
			allowPremoves: true,
			moveSounds: true,
			showCheckSqaure: true,
			showLastMove: true,
			showLegalMoves: true,
			showNotation: true
		};

		this.pieces = [];
		this.markedSquares = new Set();
		
		this.board = {
			boardTheme: 'standard',
			piecesTheme: 'standard',
			flipped: false,
			notation: cbSettings.showNotation,
			shadow: false,
			startFen: defaultFEN,
			size: 0
		};

		this.movable = {
			enabled: true,
			color: 'both'
		};

		this.draggable = {
			enabled: true,
			ghostPiece: {
				enabled: true,
				piece: undefined
			},
			transition: {
				enabled: true,
				settings: {
					duration: 120,
					easing: 'cubicInOut'
				}
			}
		};

		this.selectable = {
			enabled: true,
			selectedPiece: undefined
		};

		this.legal = {
			enabled: false,
			whiteToMove: true,
			moves: [],
			settings: {
				allowPromotion: true,
				allowEnPassant: true,
				allowCastling: true
			},
			preMoves: {
				enabled: cbSettings.allowPremoves,
				moves: [],
				curMove: ''
			},
			lastMove: ''
		};

		this.callbacks = {};

		this.highlight = {
			enabled: true,
			settings: {
				select: true,
				legal: cbSettings.showLegalMoves,
				move: cbSettings.showLastMove,
				preMove: cbSettings.allowPremoves,
				nextMove: cbSettings.allowPremoves,
				check: cbSettings.showCheckSqaure
			}
		};

		this.drawTools = {
			enabled: true,
			engineArrows: [],
			settings: {
				LshapeKnightMove: true,
				onlyChessMove: false
			}
		};

		this.sounds = {
			enabled: cbSettings.moveSounds,
			settings: {
				MOVE: true,
				CAPTURE: true,
				CASTLE: true,
				UNDO: true
			}
		};

		this.resizible = {
			enabled: false,
			settings: {
				min: 100,
				max: 1000
			}
		};

		if (cfg !== undefined) this.setConfigSettings(cfg);
	}

	public setConfigSettings(cfg: ChessboardConfig) {
		//board
		if (cfg.board?.boardTheme !== undefined) this.board.boardTheme = cfg.board.boardTheme;
		if (cfg.board?.piecesTheme !== undefined) this.board.piecesTheme = cfg.board.piecesTheme;
		if (cfg.board?.notation !== undefined) this.board.notation = cfg.board.notation;
		if (cfg.board?.shadow !== undefined) this.board.shadow = cfg.board.shadow;
		if (cfg.board?.flipped !== undefined) this.board.flipped = cfg.board.flipped;
		if (cfg.board?.startFen !== undefined) this.board.startFen = cfg.board.startFen;

		//movable
		switch (cfg.movable) {
			case true:
				this.movable.enabled = true;
				this.movable.color = 'both';
				break;
			case false:
				this.movable.enabled = false;
				break;
			case Color.WHITE:
				this.movable.enabled = true;
				this.movable.color = Color.WHITE;
				break;
			case Color.BLACK:
				this.movable.enabled = true;
				this.movable.color = Color.BLACK;
				break;
			default:
				break;
		}

		//draggable
		if (cfg.draggable !== undefined) {
			if (cfg.draggable === true) this.draggable.enabled = true;
			else if (cfg.draggable === false) this.draggable.enabled = false;
			else {
				this.draggable.enabled = true;
				if (cfg.draggable?.ghostPiece !== undefined)
					this.draggable.ghostPiece.enabled = cfg.draggable.ghostPiece;
				if (cfg.draggable.transition !== undefined) {
					if (cfg.draggable?.transition === true) this.draggable.transition.enabled = true;
					else if (cfg.draggable?.transition === false) this.draggable.transition.enabled = false;
					else {
						this.draggable.transition.enabled = true;
						if (cfg.draggable?.transition?.duration)
							this.draggable.transition.settings.duration = cfg.draggable?.transition?.duration;
						if (cfg.draggable?.transition?.easing)
							this.draggable.transition.settings.easing = cfg.draggable?.transition?.easing;
					}
				}
			}
		}

		//selectable
		if (cfg.selectable !== undefined) this.selectable.enabled = cfg.selectable;

		//legal
		if (cfg.legal !== undefined) {
			if (cfg.legal === true) this.legal.enabled = true;
			else if (cfg.legal === false) this.legal.enabled = false;
			else {
				this.legal.enabled = true;
				if (cfg.legal.settings) {
					if (cfg.legal.settings.allowCastling !== undefined)
						this.legal.settings.allowCastling = cfg.legal.settings.allowCastling;
					if (cfg.legal.settings.allowEnPassant !== undefined)
						this.legal.settings.allowEnPassant = cfg.legal.settings.allowEnPassant;
					if (cfg.legal.settings.allowPromotion !== undefined)
						this.legal.settings.allowPromotion = cfg.legal.settings.allowPromotion;
				}
				if (cfg.legal.preMoves !== undefined) this.legal.preMoves.enabled = cfg.legal.preMoves;
			}
		}

		//callbacks
		if (cfg.callbacks !== undefined) {
			if (cfg.callbacks.getLegalMoves) this.callbacks.getLegalMoves = cfg.callbacks.getLegalMoves;
			if (cfg.callbacks.getPreMoves) this.callbacks.getPreMoves = cfg.callbacks.getPreMoves;
			if (cfg.callbacks.beforeMove) this.callbacks.beforeMove = cfg.callbacks.beforeMove;
			if (cfg.callbacks.afterMove) this.callbacks.afterMove = cfg.callbacks.afterMove;
			if (cfg.callbacks.getLastMove) this.callbacks.getLastMove = cfg.callbacks.getLastMove;
			if (cfg.callbacks.getLastMoveSAN)
				this.callbacks.getLastMoveSAN = cfg.callbacks.getLastMoveSAN;
			if (cfg.callbacks.getKingLocations)
				this.callbacks.getKingLocations = cfg.callbacks.getKingLocations;
			if (cfg.callbacks.getInCheck) this.callbacks.getInCheck = cfg.callbacks.getInCheck;
			if (cfg.callbacks.getWhiteToMove)
				this.callbacks.getWhiteToMove = cfg.callbacks.getWhiteToMove;
		}

		//highlight
		if (cfg.highlight !== undefined) {
			if (cfg.highlight === true) this.highlight.enabled = true;
			else if (cfg.highlight === false) this.highlight.enabled = false;
			else {
				this.highlight.enabled = true;
				if (cfg.highlight.check !== undefined) this.highlight.settings.check = cfg.highlight.check;
				if (cfg.highlight.legal !== undefined) this.highlight.settings.legal = cfg.highlight.legal;
				if (cfg.highlight.move !== undefined) this.highlight.settings.move = cfg.highlight.move;
				if (cfg.highlight.nextMove !== undefined)
					this.highlight.settings.nextMove = cfg.highlight.nextMove;
				if (cfg.highlight.preMove !== undefined)
					this.highlight.settings.preMove = cfg.highlight.preMove;
				if (cfg.highlight.select !== undefined)
					this.highlight.settings.select = cfg.highlight.select;
			}
		}

		//drawTools
		if (cfg.drawTools !== undefined) {
			if (cfg.drawTools === true) this.drawTools.enabled = true;
			else if (cfg.drawTools === false) this.drawTools.enabled = false;
			else {
				this.drawTools.enabled = true;
				if (cfg.drawTools.LshapeKnightMove !== undefined)
					this.drawTools.settings.LshapeKnightMove = cfg.drawTools.LshapeKnightMove;
				if (cfg.drawTools.onlyChessMove !== undefined)
					this.drawTools.settings.onlyChessMove = cfg.drawTools.onlyChessMove;
			}
		}

		//sounds
		if (cfg.sounds !== undefined) {
			if (cfg.sounds === true) this.sounds.enabled = true;
			else if (cfg.sounds === false) this.sounds.enabled = false;
			else {
				this.sounds.enabled = true;
				if (cfg.sounds.CAPTURE !== undefined) this.sounds.settings.CAPTURE = cfg.sounds.CAPTURE;
				if (cfg.sounds.CASTLE !== undefined) this.sounds.settings.CASTLE = cfg.sounds.CASTLE;
				if (cfg.sounds.MOVE !== undefined) this.sounds.settings.MOVE = cfg.sounds.MOVE;
				if (cfg.sounds.UNDO !== undefined) this.sounds.settings.UNDO = cfg.sounds.UNDO;
			}
		}

		//resizible
		if (cfg.resizible !== undefined) {
			if (cfg.resizible === true) this.resizible.enabled = true;
			else if (cfg.resizible === false) this.resizible.enabled = false;
			else {
				this.resizible.enabled = true;
				if (cfg.resizible.min !== undefined) this.resizible.settings.min = cfg.resizible.min;
				if (cfg.resizible.max !== undefined) this.resizible.settings.max = cfg.resizible.max;
			}
		}
	}
}

/* eslint-disable no-param-reassign */
import type { ChessBoard, ChessFile, ChessPiece, ChessRank, ChessSquare } from './chessTypes.js';
import { State, type Square, defaultFEN } from './state/index.js';
import { fileToIndex, getShortFenFromBoard, rankToIndex } from './utils.js';
import type { ChessboardConfig } from './boardConfig.js';
import type { SquareType } from './enums.js';
import { Pieces, type Piece } from './state/piece.js';

const emptyFEN = '8/8/8/8/8/8/8/8 w - - 0 1';

export default class Chessboard {
	public letters: Record<ChessFile, number> = {
		a: 0,
		b: 1,
		c: 2,
		d: 3,
		e: 4,
		f: 5,
		g: 6,
		h: 7
	};

	public state: State;

	constructor(cfg?: ChessboardConfig | undefined) {
		this.state = new State(cfg);
		this.state.pieces.initPieces(this.state.board.startFen ?? defaultFEN);
	}

	private changeLegalHoverIfNeeded = (newSquare: Square) => {
		if (newSquare.color !== 'LEGAL' && newSquare.color !== 'PREMOVE') return;

		const piece = this.state.pieces.squareMap.get(newSquare.square);

		if (piece) newSquare.color = newSquare.color === 'LEGAL' ? 'LEGALHOVER' : 'PREMOVEHOVER';
	};

	public highlightSquare = (square: ChessSquare, mode: SquareType) => {
		const newSquare: Square = {
			square,
			color: mode
		};

		this.state.markedSquares.forEach((element: Square) => {
			if (element.square === square && element.color !== 'MOVE' && element.color !== 'CHECK')
				this.state.markedSquares.delete(element);
		});

		this.changeLegalHoverIfNeeded(newSquare);
		this.state.markedSquares.add(newSquare);
	};

	public legalHover = (sqr: ChessSquare | undefined, color: 'LEGAL' | 'PREMOVE' = 'LEGAL') => {
		if (sqr === undefined) return;
		this.state.markedSquares.forEach((square) => {
			if (square.square === sqr && square.color === color)
				square.color = color === 'LEGAL' ? 'LEGALHOVER' : 'PREMOVEHOVER';
			else if (
				square.square !== sqr &&
				square.color === (color === 'LEGAL' ? 'LEGALHOVER' : 'PREMOVEHOVER') &&
				!this.state.pieces.squareMap.has(square.square)
			) {
				square.color = color;
			}
		});
	};

	public toggleSquareHighlight = (square: ChessSquare, mode: SquareType): boolean => {
		const newSquare: Square = {
			square,
			color: mode
		};

		let existedBefore = false;

		this.state.markedSquares.forEach((element: Square) => {
			if (element.square === square) {
				this.state.markedSquares.delete(element);
				if (element.color === mode) existedBefore = true;
			}
		});

		this.changeLegalHoverIfNeeded(newSquare);
		if (existedBefore) return true;
		this.state.markedSquares.add(newSquare);
		return false;
	};

	public getSelectedSquare = (): string => {
		let selectedSquare = '';

		this.state.markedSquares.forEach((square: Square) => {
			if (square.color === 'SELECT') selectedSquare = square.square;
		});

		return selectedSquare;
	};

	public clearSquare = (square: ChessSquare, mode?: SquareType) => {
		if (square.length !== 2) {
			return;
		}

		this.state.markedSquares.forEach((element) => {
			if (element.square === square && (element.color === mode || mode === undefined))
				this.state.markedSquares.delete(element);
		});
	};

	public clearAllSquares = (mode?: SquareType) => {
		if (mode === undefined) this.state.markedSquares.clear();
		else
			this.state.markedSquares.forEach((square) => {
				if (square.color === mode) this.state.markedSquares.delete(square);
			});
	};

	public setPiece = (square: ChessSquare, name: ChessPiece) => {
		this.state.pieces.setPiece(square, name);
	};

	public removePiece = (square: ChessSquare) => {
		return this.state.pieces.removePieceBySquare(square);
	};

	public clearAllPieces = () => {
		this.state.pieces.clearPieces();
	};

	public getGridCoordsFromSquare = (square: ChessSquare): { x: number; y: number } => {
		if (!Chessboard.isValidThing({ square })) return { x: 0, y: 0 };

		const file = <ChessFile>square[0];
		const rank = <ChessRank>square[1];

		const x = this.state.board.flipped ? Math.abs(this.letters[file] - 7) : this.letters[file];
		const y = this.state.board.flipped ? Math.abs(parseInt(rank, 10) - 8) : parseInt(rank, 10) - 1;

		if (typeof x !== 'number' || y < 0 || y > 7) return { x: 0, y: 0 };

		return { x, y };
	};

	public makeMove = (move: string): void => {
		this.state.pieces.makeMove(move);
	};

	public updatePiecesWithFen = (fen: string): void => {
		if (this.state.board.skins.enabled) throw new Error('Cannot update pieces with skins enabled');

		const newPieces = new Pieces({ startFen: fen });

		const piecesDeleted: Piece[] = [];
		const piecesAdded: Piece[] = [];

		this.state.pieces.idMap.forEach((piece) => {
			const newPiece = newPieces.squareMap.get(piece.square);
			if (!newPiece || newPiece.name !== piece.name) piecesDeleted.push(piece);
		});

		newPieces.idMap.forEach((piece) => {
			const oldPiece = this.state.pieces.squareMap.get(piece.square);
			if (!oldPiece || oldPiece.name !== piece.name) piecesAdded.push(piece);
		});

		for (let i = 0; i < piecesDeleted.length; i++) {
			for (let j = 0; j < piecesAdded.length; j++) {
				if (!piecesAdded[j] || !piecesDeleted[i]) continue;
				if (piecesAdded[j].name === piecesDeleted[i].name) {
					piecesDeleted[i].square = piecesAdded[j].square;
					piecesDeleted.splice(i, 1);
					i--;
					piecesAdded.splice(j, 1);
					j--;
				}
			}
		}

		piecesAdded.forEach((piece) => {
			this.state.pieces.setPiece(piece.square, piece.name);
		});

		piecesDeleted.forEach((piece) => {
			this.state.pieces.removePieceBySquare(piece.square);
		});
	};

	public getWhiteKingSquare(): ChessSquare | undefined {
		return this.state.pieces.idMap.get('wK0')?.square;
	}

	public getBlackKingSquare(): ChessSquare | undefined {
		return this.state.pieces.idMap.get('bK0')?.square;
	}

	public getShortFEN() {
		if (this.state.pieces.size === 0) return emptyFEN;

		const board = [...Array(8)].map(() => Array(8).fill(null)) as ChessBoard;

		this.state.pieces.forEach((piece) => {
			board[rankToIndex(<ChessRank>piece.square[1])][fileToIndex(<ChessFile>piece.square[0])] =
				piece.name;
		});

		return getShortFenFromBoard(board);
	}

	public getPieceFromSquare(square: ChessSquare | undefined): Piece | undefined {
		if (!square) return undefined;
		return this.state.pieces.squareMap.get(square);
	}

	private static isValidThing = (payload: {
		square?: ChessSquare;
		piece?: string;
		move?: string;
	}): boolean => {
		const { square, piece, move } = payload;

		if (square && square.length !== 2) return false;
		if (piece && piece.length !== 2) return false;
		if (move && move.length !== 4 && move.length !== 5) return false;
		return true;
	};

	public setGhostPiece = (piece: Piece) => {
		this.state.draggable.ghostPiece.piece = piece;
	};

	public removeGhostPiece = () => {
		this.state.draggable.ghostPiece.piece = undefined;
	};

	public isCastling = (move: string): boolean => {
		const startSquare = move.slice(0, 2) as ChessSquare;
		const movingPiece = this.getPieceFromSquare(startSquare);
		if (!movingPiece || movingPiece.name[1] !== 'K') return false;
		return move === 'e1g1' || move === 'e1c1' || move === 'e8g8' || move === 'e8c8';
	};

	/**
	 * Returns rook move if the parameter is a castling move
	 * @param move
	 */
	public getRookMoveIfIsCastling = (move: string): 'h1f1' | 'a1d1' | 'h8f8' | 'a8d8' | null => {
		if (!this.isCastling(move)) return null;
		switch (move) {
			case 'e1g1':
				return 'h1f1';
			case 'e1c1':
				return 'a1d1';
			case 'e8g8':
				return 'h8f8';
			case 'e8c8':
				return 'a8d8';
			default:
				return null;
		}
	};

	public isEnPassant = (move: string): boolean => {
		if (move[0] === move[2]) return false;
		if (this.getPieceFromSquare(<ChessSquare>move.substring(2, 4))) return false;
		const pawn = this.getPieceFromSquare(<ChessSquare>move.substring(0, 2));
		if (pawn === undefined || (pawn.name !== 'wP' && pawn.name !== 'bP')) return false;
		return true;
	};

	/**
	 * Returns square of captured pawn if the parameter is a en passant
	 * @param move
	 */
	public getCapturedPawnSquareIfIsEnPassant = (move: string): ChessSquare | undefined => {
		if (move[0] === move[2]) return undefined;
		// check that it is not a regular capture
		if (this.getPieceFromSquare(<ChessSquare>move.substring(2, 4))) return undefined;
		// check that pawn move
		const pawn = this.getPieceFromSquare(<ChessSquare>move.substring(0, 2));
		if (pawn === undefined || (pawn.name !== 'wP' && pawn.name !== 'bP')) return undefined;

		const enPassantTargetSquare = <ChessSquare>(
			`${<ChessFile>move[2]}${<ChessRank>(
				(parseInt(move[3], 10) + (pawn.name === 'wP' ? -1 : 1)).toString()
			)}`
		);
		// check that the last move ends with enPassantTargetSquare
		if (this.state.legal.lastMove.substring(2, 4) !== enPassantTargetSquare) return undefined;
		// check that target pawn exists
		const targetPawn = this.getPieceFromSquare(enPassantTargetSquare);
		if (!targetPawn || targetPawn.name[1] !== 'P') return undefined;
		// check that the last move was the first move for the enpassant target
		if (
			Math.abs(
				parseInt(this.state.legal.lastMove[1], 10) - parseInt(this.state.legal.lastMove[3], 10)
			) !== 2
		)
			return undefined;
		return enPassantTargetSquare;
	};

	public isCapture = (move: string): boolean => {
		if (this.getPieceFromSquare(<ChessSquare>move.substring(2, 4))) return true;
		return false;
	};

	public isPromotion = (move: string): boolean => {
		if ((move[1] !== '7' || move[3] !== '8') && (move[1] !== '2' || move[3] !== '1')) return false;
		const piece = this.getPieceFromSquare(<ChessSquare>move.substring(0, 2));
		if (
			piece &&
			(piece.name[1] !== 'P' ||
				(piece.name[0] === 'w' && move[3] === '1') ||
				(piece.name[0] === 'b' && move[3] === '8'))
		)
			return false;
		return true;
	};

	public callbackExists = (
		callback:
			| 'getLegalMoves'
			| 'getPreMoves'
			| 'beforeMove'
			| 'afterMove'
			| 'getLastMove'
			| 'getInCheck'
			| 'getWhiteToMove'
	) => this.state.callbacks[callback] !== undefined;

	public flipBoard = (flipped?: boolean) => {
		if (flipped !== undefined) this.state.board.flipped = flipped;
		else this.state.board.flipped = !this.state.board.flipped;
	};

	public setConfigSettings = (cfg: ChessboardConfig) => {
		this.state.setConfigSettings(cfg);
	};

	public get legalEnabled() {
		return this.state.legalEnabled;
	}

	public get preMovesEnabled() {
		return this.state.preMovesEnabled;
	}

	public get legalMoves() {
		return this.state.legalMoves;
	}

	public set legalMoves(moves: string[]) {
		this.state.legalMoves = moves;
	}

	public get preMoves() {
		return this.state.preMoves;
	}

	public set preMoves(moves: string[]) {
		this.state.preMoves = moves;
	}

	public get flipped() {
		return this.state.flipped;
	}

	public set flipped(flppd: boolean) {
		this.state.flipped = flppd;
	}

	public get currentPreMove() {
		return this.state.currentPreMove;
	}

	public set currentPreMove(move: string) {
		this.state.currentPreMove = move;
	}

	public get selectableEnabled() {
		return this.state.selectableEnabled;
	}

	public get draggableEnabled() {
		return this.state.draggableEnabled;
	}

	public get selectedPiece() {
		return this.state.selectedPiece;
	}

	public set selectedPiece(piece: Piece | undefined) {
		this.state.selectedPiece = piece;
	}

	public get whiteToMove() {
		return this.state.whiteToMove;
	}

	public set whiteToMove(wtmv: boolean) {
		this.state.whiteToMove = wtmv;
	}

	public get lastMove() {
		return this.state.lastMove;
	}

	public set lastMove(move: string) {
		this.state.lastMove = move;
	}

	public get highlightEnabled() {
		return this.state.highlightEnabled;
	}

	public get highlightSettings() {
		return this.state.highlightSettings;
	}

	public get soundsEnabled() {
		return this.state.soundsEnabled;
	}

	public get ghostPieceEnabled() {
		return this.state.ghostPieceEnabled;
	}

	public get ghostPiece() {
		return this.state.ghostPiece;
	}

	public set ghostPiece(piece: Piece | undefined) {
		this.state.ghostPiece = piece;
	}

	public get movableEnabled() {
		return this.state.movableEnabled;
	}
}

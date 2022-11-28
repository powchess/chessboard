/* eslint-disable no-param-reassign */
import { SquareColor } from './enums';
import type { ChessBoard, ChessFile, ChessPiece, ChessRank, ChessSquare } from './chessTypes';
import { State, type Square, type Piece } from './state/index';
import { fileToIndex, getShortFenFromBoard, rankToIndex } from './utils';
import type { ChessboardConfig } from './boardConfig';

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
		if (this.state.board.startFen) this.updatePiecesWithFen(this.state.board.startFen);
	}

	private changeLegalHoverIfNeeded = (newSquare: Square) => {
		if (newSquare.color !== SquareColor.LEGAL && newSquare.color !== SquareColor.PREMOVE) return;

		this.state.pieces.forEach((piece: Piece) => {
			if (piece.square === newSquare.square)
				newSquare.color =
					newSquare.color === SquareColor.LEGAL ? SquareColor.LEGALHOVER : SquareColor.PREMOVEHOVER;
		});
	};

	public highlightSquare = (square: ChessSquare, mode: SquareColor) => {
		const newSquare: Square = {
			square,
			color: mode
		};

		this.state.markedSquares.forEach((element: Square) => {
			if (
				element.square === square &&
				element.color !== SquareColor.MOVE &&
				element.color !== SquareColor.CHECK
			)
				this.state.markedSquares.delete(element);
		});

		this.changeLegalHoverIfNeeded(newSquare);
		this.state.markedSquares.add(newSquare);
	};

	public legalHover = (
		sqr: ChessSquare | undefined,
		color: SquareColor.LEGAL | SquareColor.PREMOVE = SquareColor.LEGAL
	) => {
		if (sqr === undefined) return;
		this.state.markedSquares.forEach((square) => {
			if (square.square === sqr && square.color === color)
				square.color =
					color === SquareColor.LEGAL ? SquareColor.LEGALHOVER : SquareColor.PREMOVEHOVER;
			else if (
				square.square !== sqr &&
				square.color ===
					(color === SquareColor.LEGAL ? SquareColor.LEGALHOVER : SquareColor.PREMOVEHOVER)
			) {
				let pieceExist = false;
				this.state.pieces.forEach((piece) => {
					if (piece.square === square.square) pieceExist = true;
				});
				if (!pieceExist) {
					square.color = color;
				}
			}
		});
	};

	public toggleSquareHighlight = (square: ChessSquare, mode: SquareColor): boolean => {
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
			if (square.color === SquareColor.SELECT) selectedSquare = square.square;
		});

		return selectedSquare;
	};

	public clearSquare = (square: ChessSquare, mode?: SquareColor) => {
		if (square.length !== 2) {
			return;
		}

		this.state.markedSquares.forEach((element) => {
			if (element.square === square && (element.color === mode || mode === undefined))
				this.state.markedSquares.delete(element);
		});
	};

	public clearAllSquares = (mode?: SquareColor) => {
		if (mode === undefined) this.state.markedSquares.clear();
		else
			this.state.markedSquares.forEach((square) => {
				if (square.color === mode) this.state.markedSquares.delete(square);
			});
	};

	public setPiece = (square: ChessSquare, name: ChessPiece) => {
		if (this.notValidThing({ square, piece: name })) return;
		const piece = this.state.pieces.find((p) => p.square === square);
		if (piece) piece.name = name;
		else this.state.pieces.push({ square, name });
	};

	public removePiece = (square: ChessSquare) => {
		if (this.notValidThing({ square })) return;
		this.state.pieces.forEach((element, i) => {
			if (element.square === square) {
				this.state.pieces.splice(i, 1);
			}
		});
	};

	public clearAllPieces = () => {
		this.state.pieces.length = 0;
	};

	public getGridCoordsFromSquare = (square: ChessSquare): { x: number; y: number } => {
		if (this.notValidThing({ square })) return { x: 0, y: 0 };

		const file = <ChessFile>square[0];
		const rank = <ChessRank>square[1];

		const x = this.state.board.flipped ? Math.abs(this.letters[file] - 7) : this.letters[file];
		const y = this.state.board.flipped ? Math.abs(parseInt(rank, 10) - 8) : parseInt(rank, 10) - 1;

		if (typeof x !== 'number' || y < 0 || y > 7) return { x: 0, y: 0 };

		return { x, y };
	};

	public makeMove = (move: string): void => {
		if (this.notValidThing({ move })) return;

		let moveSuccessful = false;
		let cachedPiece: Piece | undefined;

		const startSQ = <ChessSquare>move.substring(0, 2);
		const endSQ = <ChessSquare>move.substring(2, 4);
		const promPiece = move.substring(4);

		this.state.pieces.forEach((piece: Piece) => {
			if (piece.square === endSQ) {
				cachedPiece = piece;
				this.removePiece(piece.square);
			}
		});

		this.state.pieces.forEach((piece: Piece) => {
			if (piece.square === startSQ) {
				piece.square = endSQ;
				moveSuccessful = true;

				if (promPiece) piece.name = (piece.name[0] + promPiece.toUpperCase()) as ChessPiece;
			}
		});

		if (!moveSuccessful) {
			if (cachedPiece) this.state.pieces.push(cachedPiece);
		} else this.state.legal.lastMove = move;
	};

	private getSquareFromIndices = (x: number, y: number): ChessSquare =>
		`${<ChessFile>Object.keys(this.letters)[x]}${<ChessRank>(y + 1).toString()}`;

	public updatePiecesWithFen = (fen: string): void => {
		const board = [...Array(8)].map(() => Array(8).fill(null)) as ChessBoard;
		const numbers = ['1', '2', '3', '4', '5', '6', '7', '8'];
		let j = 0;
		let m = 0;
		for (let i = 0; i < (fen.includes(' ') ? fen.indexOf(' ') : fen.length); i++) {
			if (fen[i] === '/') {
				j++;
				m = 0;
			} else if (!numbers.includes(fen[i])) {
				if (fen[i] === fen[i].toUpperCase()) {
					board[j][m] = `w${fen[i]}` as ChessPiece;
				} else {
					board[j][m] = `b${fen[i].toUpperCase()}` as ChessPiece;
				}
				m++;
			} else {
				for (let k = 0; k < parseInt(fen[i], 10); k++) {
					board[j][m] = null;
					m++;
				}
			}
		}

		const piecesAdded: Piece[] = [];
		const piecesDeleted: Piece[] = [];

		for (let y = 0; y < board.length; ++y) {
			for (let x = 0; x < board.length; ++x) {
				const piece = board[y][x];
				const oldPiece = this.getPieceFromSquare(this.getSquareFromIndices(x, Math.abs(y - 7)));
				if (piece && !oldPiece) {
					piecesAdded.push({
						square: <ChessSquare>this.getSquareFromIndices(x, Math.abs(y - 7)),
						name: piece
					});
				}
				if (!piece && oldPiece) {
					piecesDeleted.push(oldPiece);
				}
				if (piece && oldPiece && piece !== oldPiece.name) {
					piecesAdded.push({
						square: <ChessSquare>this.getSquareFromIndices(x, Math.abs(y - 7)),
						name: piece
					});
					piecesDeleted.push(oldPiece);
				}
			}
		}

		for (let i = 0; i < piecesDeleted.length; i++) {
			for (let n = 0; n < piecesAdded.length; n++) {
				if (!piecesAdded[n] || !piecesDeleted[i]) continue;
				if (piecesAdded[n].name === piecesDeleted[i].name) {
					piecesDeleted[i].square = piecesAdded[n].square;
					piecesDeleted.splice(i, 1);
					i--;
					piecesAdded.splice(n, 1);
					n--;
				}
			}
		}

		piecesAdded.forEach((piece) => {
			this.state.pieces.push(piece);
		});

		piecesDeleted.forEach((piece) => {
			this.state.pieces.splice(this.state.pieces.indexOf(piece), 1);
		});
	};

	public getWhiteKingSquare(): ChessSquare | undefined {
		const king = this.state.pieces.find((piece) => piece.name === 'wK');
		if (king) return king.square;
		return undefined;
	}

	public getBlackKingSquare(): ChessSquare | undefined {
		const king = this.state.pieces.find((piece) => piece.name === 'bK');
		if (king) return king.square;
		return undefined;
	}

	public getShortFEN() {
		if (this.state.pieces.length === 0) return emptyFEN;

		const board = [...Array(8)].map(() => Array(8).fill(null)) as ChessBoard;

		this.state.pieces.forEach((piece) => {
			board[rankToIndex(<ChessRank>piece.square[1])][fileToIndex(<ChessFile>piece.square[0])] =
				piece.name;
		});

		return getShortFenFromBoard(board);
	}

	public getPieceFromSquare(square: ChessSquare | undefined): Piece | undefined {
		if (!square) return undefined;
		return this.state.pieces.find((piece) => piece.square === square);
	}

	// eslint-disable-next-line class-methods-use-this
	private notValidThing = (payload: {
		square?: ChessSquare;
		piece?: string;
		move?: string;
	}): boolean => {
		const { square, piece, move } = payload;

		if (square && square.length !== 2) return true;
		if (piece && piece.length !== 2) return true;
		if (move && move.length !== 4 && move.length !== 5) return true;
		return false;
	};

	public setGhostPiece = (piece: Piece) => {
		this.state.draggable.ghostPiece.piece = piece;
	};

	public removeGhostPiece = () => {
		this.state.draggable.ghostPiece.piece = undefined;
	};

	// eslint-disable-next-line class-methods-use-this
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
	// eslint-disable-next-line class-methods-use-this
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
		if (this.getPieceFromSquare(<ChessSquare>move.substring(2, 4))) return undefined;
		const pawn = this.getPieceFromSquare(<ChessSquare>move.substring(0, 2));
		if (pawn === undefined || (pawn.name !== 'wP' && pawn.name !== 'bP')) return undefined;

		const capturedPawn = this.getPieceFromSquare(
			`${<ChessFile>move[2]}${<ChessRank>(
				(parseInt(move[3], 10) + (pawn.name === 'wP' ? -1 : 1)).toString()
			)}`
		);
		return capturedPawn?.square;
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

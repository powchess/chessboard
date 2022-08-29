import { State, type square, type piece } from './state';
import type { ChessBoard, ChessFile, ChessPiece } from './types/chess';
import { SquareColor, type ChessboardConfig } from './types/chessboard';
import { getShortFenFromBoard } from './utils';

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

	// Public
	public state: State;

	constructor(cfg?: ChessboardConfig) {
		this.state = new State(cfg);
		if (this.state.board.startFen) this.updatePiecesWithFen(this.state.board.startFen);
	}

	private changeLegalHoverIfNeeded = (newSquare: square) => {
		if (newSquare.color !== SquareColor.LEGAL && newSquare.color !== SquareColor.PREMOVE) return;

		this.state.pieces.forEach((piece: piece) => {
			if (piece.square === newSquare.square)
				newSquare.color =
					newSquare.color === SquareColor.LEGAL ? SquareColor.LEGALHOVER : SquareColor.PREMOVEHOVER;
		});
	};

	public highlightSquare = (square: string, mode: SquareColor) => {
		const newSquare: square = {
			square,
			color: mode
		};

		this.state.markedSquares.forEach((element: square) => {
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

	public legalHover = (sqr: string) => {
		this.state.markedSquares.forEach((square) => {
			if (square.square === sqr && square.color === SquareColor.LEGAL)
				square.color = SquareColor.LEGALHOVER;
			else if (square.square !== sqr && square.color === SquareColor.LEGALHOVER) {
				let pieceExist: boolean = false;
				this.state.pieces.forEach((piece) => {
					if (piece.square === square.square) {
						pieceExist = true;
						return;
					}
				});
				if (!pieceExist) {
					square.color = SquareColor.LEGAL;
				}
			}
		});
	};

	public preMoveHover = (sqr: string) => {
		this.state.markedSquares.forEach((square) => {
			if (square.square === sqr && square.color === SquareColor.PREMOVE)
				square.color = SquareColor.PREMOVEHOVER;
			else if (square.square !== sqr && square.color === SquareColor.PREMOVEHOVER) {
				let pieceExist: boolean = false;
				this.state.pieces.forEach((piece) => {
					if (piece.square === square.square) {
						pieceExist = true;
						return;
					}
				});
				if (!pieceExist) {
					square.color = SquareColor.PREMOVE;
				}
			}
		});
	};

	public toggleSquareHighlight = (square: string, mode: SquareColor): boolean => {
		const newSquare: square = {
			square,
			color: mode
		};

		let existedBefore = false;

		this.state.markedSquares.forEach((element: square) => {
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

		this.state.markedSquares.forEach((square: square) => {
			if (square.color === SquareColor.SELECT) selectedSquare = square.square;
		});

		return selectedSquare;
	};

	public clearSquare = (square: string, mode?: SquareColor) => {
		if (square.length !== 2) {
			console.log(`${square} is not a valid square`);
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

	public setPiece = (square: string, name: ChessPiece) => {
		if (this.notValidThing({ square, piece: name })) return;
		const piece = this.state.pieces.find((piece) => piece.square === square);
		if (piece) piece.name = name;
		else this.state.pieces.push({ square, name });
	};

	public removePiece = (square: string) => {
		if (this.notValidThing({ square })) return;
		this.state.pieces.forEach((element, i) => {
			if (element.square === square) {
				this.state.pieces.splice(i, 1);
				return;
			}
		});
	};

	public clearAllPieces = () => {
		this.state.pieces.length = 0;
	};

	public getGridCoordsFromSquare = (square: string): { x: number; y: number } => {
		if (this.notValidThing({ square })) return { x: 0, y: 0 };

		const file = <ChessFile>square[0];
		const rank = square[1];

		const x = this.state.board.flipped ? Math.abs(this.letters[file] - 7) : this.letters[file];
		const y = this.state.board.flipped ? Math.abs(parseInt(rank) - 8) : parseInt(rank) - 1;

		if (typeof x !== 'number' || y < 0 || y > 7) return { x: 0, y: 0 };

		return { x, y };
	};

	public makeMove = (move: string): void => {
		if (this.notValidThing({ move })) return;

		let moveSuccessful = false;
		let cachedPiece: piece | undefined;

		const startSQ = move.substring(0, 2);
		const endSQ = move.substring(2, 4);
		const promPiece = move.substring(4);

		this.state.pieces.forEach((piece: piece) => {
			if (piece.square === endSQ) {
				cachedPiece = piece;
				this.removePiece(piece.square);
				return;
			}
		});

		this.state.pieces.forEach((piece: piece) => {
			if (piece.square === startSQ) {
				piece.square = endSQ;
				moveSuccessful = true;

				if (promPiece) piece.name = (piece.name[0] + promPiece.toUpperCase()) as ChessPiece;
				return;
			}
		});

		if (!moveSuccessful) {
			console.error(`${move} is not possible`);
			if (cachedPiece) this.state.pieces.push(cachedPiece);
		} else this.state.legal.lastMove = move;
	};

	private getSquareFromIndices = (x: number, y: number): string => {
		return Object.keys(this.letters)[x] + (y + 1).toString();
	};

	public updatePiecesWithFen = (fen: string): void => {
		const board = [...Array(8)].map((_: string[]) => Array(8).fill(null)) as ChessBoard;
		const numbers = ['1', '2', '3', '4', '5', '6', '7', '8'];
		let j = 0;
		let m = 0;
		for (let i = 0; i < (fen.includes(' ') ? fen.indexOf(' ') : fen.length); i++) {
			if (fen[i] == '/') {
				j++;
				m = 0;
			} else if (!numbers.includes(fen[i])) {
				if (fen[i] == fen[i].toUpperCase()) {
					board[j][m] = ('w' + fen[i]) as ChessPiece;
				} else {
					board[j][m] = ('b' + fen[i].toUpperCase()) as ChessPiece;
				}
				m++;
			} else {
				for (var k = 0; k < parseInt(fen[i]); k++) {
					board[j][m] = null;
					m++;
				}
			}
		}

		const piecesAdded: piece[] = [];
		const piecesDeleted: piece[] = [];

		for (let y = 0; y < board.length; ++y) {
			for (let x = 0; x < board.length; ++x) {
				const piece = board[y][x];
				const oldPiece = this.getPieceFromSquare(this.getSquareFromIndices(x, Math.abs(y - 7)));
				if (piece && !oldPiece) {
					piecesAdded.push({
						square: this.getSquareFromIndices(x, Math.abs(y - 7)),
						name: piece
					});
				}
				if (!piece && oldPiece) {
					piecesDeleted.push(oldPiece);
				}
				if (piece && oldPiece && piece !== oldPiece.name) {
					piecesAdded.push({
						square: this.getSquareFromIndices(x, Math.abs(y - 7)),
						name: piece
					});
					piecesDeleted.push(oldPiece);
				}
			}
		}

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
			this.state.pieces.push(piece);
		});

		piecesDeleted.forEach((piece) => {
			this.state.pieces.splice(this.state.pieces.indexOf(piece), 1);
		});
	};

	public getShortFEN() {
		if (this.state.pieces.length === 0) return emptyFEN;

		const board = [...Array(8)].map((_: string[]) => Array(8).fill(null)) as ChessBoard;

		this.state.pieces.forEach((piece) => {
			//@ts-ignore
			board[rankToIndex(piece.square[1])][fileToIndex(piece.square[0])] = piece.name;
		});

		return getShortFenFromBoard(board);
	}

	public getPieceFromSquare(square: string): piece | undefined {
		let piece: piece | undefined = undefined;
		this.state.pieces.forEach((element) => {
			if (element.square === square) piece = element;
		});
		return piece;
	}

	private notValidThing = (payload: {
		square?: string;
		piece?: string;
		move?: string;
	}): boolean => {
		const { square, piece, move } = payload;

		if (square && square.length !== 2) return true;
		if (piece && piece.length !== 2) return true;
		if (move && move.length !== 4 && move.length !== 5) return true;
		return false;
	};

	public setGhostPiece = (piece: piece) => {
		this.state.draggable.ghostPiece.piece = piece;
	};

	public removeGhostPiece = () => {
		this.state.draggable.ghostPiece.piece = undefined;
	};

	public isCastling = (move: string): boolean => {
		switch (move) {
			case 'e1g1':
			case 'e1c1':
			case 'e8g8':
			case 'e8c8':
				return true;
			default:
				return false;
		}
	};

	/**
	 * Returns rook move if the parameter is a castling move
	 * @param move
	 */
	public getRookMoveIfIsCastling = (
		move: string
	): 'h1f1' | 'a1d1' | 'h8f8' | 'a8d8' | undefined => {
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
				return undefined;
		}
	};

	public isEnPassant = (move: string): boolean => {
		if (move[0] === move[2]) return false;
		if (this.getPieceFromSquare(move.substring(2, 4))) return false;
		let pawn = this.getPieceFromSquare(move.substring(0, 2));
		if (pawn == undefined || (pawn.name !== 'wP' && pawn.name !== 'bP')) return false;
		return true;
	};

	/**
	 * Returns square of captured pawn if the parameter is a en passant
	 * @param move
	 */
	public getCapturedPawnSquareIfIsEnPassant = (move: string): string | undefined => {
		if (move[0] === move[2]) return undefined;
		if (this.getPieceFromSquare(move.substring(2, 4))) return undefined;
		let pawn = this.getPieceFromSquare(move.substring(0, 2));
		if (pawn == undefined || (pawn.name !== 'wP' && pawn.name !== 'bP')) return undefined;

		let capturedPawn = this.getPieceFromSquare(
			move[2] + `${parseInt(move[3]) + (pawn.name === 'wP' ? -1 : 1)}`
		);
		return capturedPawn?.square;
	};

	public isCapture = (move: string): boolean => {
		if (this.getPieceFromSquare(move.substring(2, 4))) return true;
		return false;
	};

	public isPromotion = (move: string): boolean => {
		if ((move[1] != '7' || move[3] != '8') && (move[1] != '2' || move[3] != '1')) return false;
		let piece = this.getPieceFromSquare(move.substring(0, 2));
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
			| 'getLastMoveSAN'
			| 'getKingLocations'
			| 'getInCheck'
			| 'getWhiteToMove'
	) => {
		return this.state.callbacks[callback] !== undefined;
	};

	public flipBoard = (flipped?: boolean) => {
		if (flipped !== undefined) this.state.board.flipped = flipped;
		else this.state.board.flipped = !this.state.board.flipped;
	};
}

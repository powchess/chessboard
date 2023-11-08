import type { ChessPiece, ChessSquare } from '$lib/chessTypes.js';
import type { IntRange } from '$lib/utils.js';
import { defaultFEN } from './index.js';

export type IdCount = IntRange<64>;
export type PieceId = `${ChessPiece}${IdCount}`;

export type Piece = {
	id: PieceId;
	square: ChessSquare;
	name: ChessPiece;
};

export class Pieces {
	public idMap = new Map<PieceId, Piece>();

	public squareMap = new Map<ChessSquare, Piece | undefined>();

	public nameMap = new Map<ChessPiece, Piece[]>();

	private emptyIdMap = new Map<ChessPiece, IdCount[]>();

	constructor(fen?: string);
	constructor(pieces?: Piece[]);
	constructor(fenOrPieces?: string | Piece[]) {
		if (fenOrPieces) {
			if (typeof fenOrPieces === 'string') {
				this.initPieces(fenOrPieces);
			} else {
				this.clearPieces();

				for (const piece of fenOrPieces) {
					this.idMap.set(piece.id, piece);
					this.squareMap.set(piece.square, piece);
				}
			}
		} else this.initPieces(defaultFEN);
	}

	public initPieces(fen: string) {
		this.clearPieces();

		this.initFromFen(fen);
	}

	public clearPieces(name?: string) {
		if (name) {
			this.idMap.forEach((piece) => {
				if (piece.name === name) this.removePieceById(piece.id);
			});
		} else {
			this.idMap.clear();
			this.squareMap.clear();
			this.emptyIdMap.clear();
		}
	}

	public setPiece(square: ChessSquare, name: ChessPiece): void;
	public setPiece(piece: Piece): void;
	public setPiece(squareOrPiece: ChessSquare | Piece, name?: ChessPiece) {
		let newPiece: Piece;
		if (typeof squareOrPiece === 'string') {
			if (!name) return;
			const square = squareOrPiece;

			const id = this.getEmptyId(name);
			newPiece = { id, square, name };
		} else newPiece = squareOrPiece;

		this.removePieceById(newPiece.id);
		this.removePieceBySquare(newPiece.square);

		this.idMap.set(newPiece.id, newPiece);
		this.squareMap.set(newPiece.square, newPiece);
		if (!this.nameMap.has(newPiece.name)) this.nameMap.set(newPiece.name, []);

		const pieces = this.nameMap.get(newPiece.name);
		if (!pieces) throw new Error('pieces is undefined');

		pieces.push(newPiece);
	}

	public removePieceById(id: PieceId): Piece | undefined {
		const piece = this.idMap.get(id);
		if (!piece) return undefined;

		this.idMap.delete(id);
		this.squareMap.delete(piece.square);

		const pieces = this.nameMap.get(piece.name);
		if (!pieces) throw new Error('pieces is undefined');

		pieces.splice(pieces.indexOf(piece), 1);
		this.clearId(id);

		return piece;
	}

	public removePieceBySquare(square: ChessSquare): Piece | undefined {
		const piece = this.squareMap.get(square);
		if (!piece) return undefined;

		this.idMap.delete(piece.id);
		this.squareMap.delete(piece.square);

		const pieces = this.nameMap.get(piece.name);
		if (!pieces) throw new Error('pieces is undefined');

		pieces.splice(pieces.indexOf(piece), 1);
		this.clearId(piece.id);

		return piece;
	}

	public makeMove(move: string): ChessPiece | undefined {
		const from = <ChessSquare>move.substring(0, 2);
		const to = <ChessSquare>move.substring(2, 4);
		const prom = move.substring(4) as 'q' | 'r' | 'b' | 'n' | '';
		if (from === to) return;

		const piece = this.squareMap.get(from);
		if (!piece) return;

		const endPiece = this.squareMap.get(to);
		if (endPiece) this.removePieceById(endPiece.id);

		this.squareMap.delete(piece.square);

		piece.square = to;
		this.squareMap.set(to, piece);

		if (!prom) return;

		this.idMap.delete(piece.id);
		piece.name = `${piece.name[0]}${prom.toUpperCase()}` as ChessPiece;
		piece.id = this.getEmptyId(piece.name);
		this.idMap.set(piece.id, piece);
	}

	private initFromFen(fen: string) {
		const shortFen = fen.split(' ')[0];
		const rows = shortFen.split('/');

		for (let row = 0; row < 8; row++) {
			let col = 0;
			const rowStr = rows[row];

			for (let i = 0; i < rowStr.length; i++) {
				const char = rowStr[i];

				if (Number.isNaN(+char)) {
					const square = `${String.fromCharCode(97 + col)}${8 - row}` as ChessSquare;
					const name = (
						char === char.toUpperCase() ? `w${char.toUpperCase()}` : `b${char.toUpperCase()}`
					) as ChessPiece;

					this.setPiece(square, name);
					col++;
				} else {
					col += +char;
				}
			}
		}
	}

	private getEmptyId = (name: ChessPiece): PieceId => {
		if (!this.emptyIdMap.has(name)) this.emptyIdMap.set(name, Pieces.getFilledStackWithIds());

		const ids = this.emptyIdMap.get(name);
		if (!ids) throw new Error('ids is undefined');

		const id = ids.pop();
		if (id === undefined) throw new Error('id is undefined');

		return `${name}${id}`;
	};

	private clearId = (id: PieceId) => {
		const name = id.substring(0, 2) as ChessPiece;
		const ids = this.emptyIdMap.get(name);

		if (!ids) throw new Error(`emptyIdMap has no name ${name}`);

		ids.push(parseInt(id.substring(2, id.length), 10) as IdCount);
	};

	private static getFilledStackWithIds = (): IdCount[] => {
		return Array(64)
			.fill(0)
			.map((_, i) => (63 - i) as IdCount);
	};

	public getPieceArray(): Piece[] {
		return Array.from(this.idMap.values());
	}

	public get size(): number {
		return this.idMap.size;
	}

	public forEach: typeof this.idMap.forEach = (...props) => {
		this.idMap.forEach(...props);
	};
}

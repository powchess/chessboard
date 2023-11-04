import type { ChessBoard, ChessFile, ChessIndex, ChessRank, ChessSquare } from './chessTypes.js';

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'] as const;

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
	? Acc[number]
	: Enumerate<N, [...Acc, Acc['length']]>;

export type IntRange<T extends number> = Exclude<Enumerate<T>, Enumerate<0>>;

export function squareToSQXY(square: ChessSquare) {
	return { x: files.indexOf(square[0] as ChessFile), y: ranks.indexOf(square[1] as ChessRank) };
}

export function fileToIndex(file: ChessFile) {
	const aAsciiCode = 97;
	return (file.charCodeAt(0) - aAsciiCode) as ChessIndex;
}

export function rankToIndex(rank: ChessRank) {
	return (8 - parseInt(rank, 10)) as ChessIndex;
}

export const getShortFenFromBoard = (board: ChessBoard): string => {
	let fen = '';
	let x = 0;
	for (let i = 0; i < board.length; i++) {
		if (i !== 0) {
			fen += '/';
		}
		for (let j = 0; j < board[i].length; j++) {
			const square = board[i][j];
			if (square != null && x === 0) {
				if (square[0] === 'w') {
					fen += square[1];
				} else {
					fen += square[1].toLowerCase();
				}
			} else if (square != null && x !== 0) {
				fen += x.toString();
				x = 0;
				if (square[0] === 'w') {
					fen += square[1];
				} else {
					fen += square[1].toLowerCase();
				}
			} else {
				x++;
			}
		}
		if (x !== 0) {
			fen += x.toString();
			x = 0;
		}
	}
	return fen;
};

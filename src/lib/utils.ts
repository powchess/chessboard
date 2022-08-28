import type { ChessBoard, ChessFile, ChessIndex, ChessRank } from './types/chess';

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'] as const;

export function squareToSQXY(square: string) {
	return { x: files.indexOf(square[0] as ChessFile), y: ranks.indexOf(square[1] as ChessRank) };
}

export function fileToIndex(file: string) {
	let aAsciiCode = 97;
	return (file.charCodeAt(0) - aAsciiCode) as ChessIndex;
}

export const getShortFenFromBoard = (board: ChessBoard): string => {
	let fen = '';
	let x = 0;
	for (let i = 0; i < board.length; i++) {
		if (i != 0) {
			fen += '/';
		}
		for (let j = 0; j < board[i].length; j++) {
			const square = board[i][j];
			if (square != null && x == 0) {
				if (square[0] == 'w') {
					fen += square[1];
				} else {
					fen += square[1].toLowerCase();
				}
			} else if (square != null && x != 0) {
				fen += x.toString();
				x = 0;
				if (square[0] == 'w') {
					fen += square[1];
				} else {
					fen += square[1].toLowerCase();
				}
			} else {
				x++;
			}
		}
		if (x != 0) {
			fen += x.toString();
			x = 0;
		}
	}
	return fen;
};

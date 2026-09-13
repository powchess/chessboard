import { describe, expect, it } from 'vitest';
import Chessboard from './chessboard.js';

describe('Chessboard state', () => {
	it('preserves piece, move, highlight, and orientation behavior', () => {
		const board = new Chessboard();

		expect(board.state.pieces.size).toBe(32);
		expect(board.getPieceFromSquare('e2')?.name).toBe('wP');

		board.makeMove('e2e4');
		expect(board.getPieceFromSquare('e2')).toBeUndefined();
		expect(board.getPieceFromSquare('e4')?.name).toBe('wP');

		board.highlightSquare('e4', 'SELECT');
		expect([...board.state.markedSquares]).toContainEqual({ square: 'e4', color: 'SELECT' });
		board.clearSquare('e4', 'SELECT');
		expect(board.state.markedSquares.size).toBe(0);

		expect(board.getGridCoordsFromSquare('a1')).toEqual({ x: 0, y: 0 });
		board.flipBoard(true);
		expect(board.getGridCoordsFromSquare('a1')).toEqual({ x: 7, y: 7 });
	});

	it('updates a FEN while retaining matching piece identities', () => {
		const board = new Chessboard();
		const pawn = board.getPieceFromSquare('e2');

		board.updatePieces('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR');

		expect(board.getPieceFromSquare('e4')?.id).toBe(pawn?.id);
		expect(board.getShortFEN()).toBe('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR');
	});
});

import { SquareColor } from '../types/chessboard';

/**
 * Use SquareColor enum to get value
 */
export const squareStyles: { [key in SquareColor]: string } = {
	[SquareColor.LEGAL]: 'legalSQ_new cursor-pointer',
	[SquareColor.LEGALHOVER]: 'legalSQ_hover_new cursor-pointer',
	[SquareColor.SELECT]: 'selectedSQ',
	[SquareColor.MOVE]: 'highlightMove',
	[SquareColor.NEXTMOVE]: 'nextMoveSQ',
	[SquareColor.PREMOVE]: 'preMoveSQ_new cursor-pointer',
	[SquareColor.PREMOVEHOVER]: 'preMoveSQ_hover_new cursor-pointer',
	[SquareColor.CHECK]: 'checkSQ'
};

export const colors = { white: '#f0d9b5', black: '#b58863' };

export const imageName = 'standard.svg';

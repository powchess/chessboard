import { SquareColor } from '../types/chessboard';

/**
 * Use SquareColor enum to get value
 */
export const squareStyles: { [key in SquareColor]: string } = {
	[SquareColor.LEGAL]: 'legalSQ_new cursor-pointer',
	[SquareColor.LEGALHOVER]: 'legalSQ_hover_new cursor-pointer',
	[SquareColor.SELECT]: 'selectedSQ-darkBlue',
	[SquareColor.MOVE]: 'highlightMove-darkBlue',
	[SquareColor.NEXTMOVE]: 'nextMoveSQ',
	[SquareColor.PREMOVE]: 'preMoveSQ_new cursor-pointer',
	[SquareColor.PREMOVEHOVER]: 'preMoveSQ_hover_new cursor-pointer',
	[SquareColor.CHECK]: 'checkSQ'
};

export const colors = { white: '#94A3B8', black: '#475569' };

export const imageName = 'darkBlue.svg';

import { SquareColor } from '$lib/enums';

export const squareStyles: Record<SquareColor, string> = {
	[SquareColor.LEGAL]: 'legalSQ cursor-pointer',
	[SquareColor.LEGALHOVER]: 'legalSQ_hover cursor-pointer',
	[SquareColor.SELECT]: 'selectedSQ-darkBlue',
	[SquareColor.MOVE]: 'highlightMove-darkBlue',
	[SquareColor.NEXTMOVE]: 'nextMoveSQ',
	[SquareColor.PREMOVE]: 'preMoveSQ cursor-pointer',
	[SquareColor.PREMOVEHOVER]: 'preMoveSQ_hover cursor-pointer',
	[SquareColor.CHECK]: 'checkSQ'
};

export const colors = { white: '#94A3B8', black: '#475569' };
export const imageName = 'darkBlue.svg';

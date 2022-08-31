import { SquareColor } from '$lib/enums';

export const squareStyles: Record<SquareColor, string> = {
	[SquareColor.LEGAL]: 'legalSQ cursor-pointer',
	[SquareColor.LEGALHOVER]: 'legalSQ_hover cursor-pointer',
	[SquareColor.SELECT]: 'selectedSQ',
	[SquareColor.MOVE]: 'highlightMove',
	[SquareColor.NEXTMOVE]: 'nextMoveSQ',
	[SquareColor.PREMOVE]: 'preMoveSQ cursor-pointer',
	[SquareColor.PREMOVEHOVER]: 'preMoveSQ_hover cursor-pointer',
	[SquareColor.CHECK]: 'checkSQ'
};

export const colors = { white: '#f0d9b5', black: '#b58863' };

export const imageName = 'standard.svg';

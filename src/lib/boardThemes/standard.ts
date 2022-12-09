import { SquareColor } from '$lib/enums';

export const squareStyles: Record<SquareColor, string> = {
	[SquareColor.LEGAL]: 'legal cursor-pointer',
	[SquareColor.LEGALHOVER]: 'legal-h cursor-pointer',
	[SquareColor.SELECT]: 'select',
	[SquareColor.MOVE]: 'move',
	[SquareColor.NEXTMOVE]: 'nextMove',
	[SquareColor.PREMOVE]: 'preMove cursor-pointer',
	[SquareColor.PREMOVEHOVER]: 'preMove-h cursor-pointer',
	[SquareColor.CHECK]: 'check'
};

export const colors = { white: '#f0d9b5', black: '#b58863' };
export const imageName = 'standard.svg';

import { SquareColor } from '$lib/enums';

export const squareStyles: Record<SquareColor, string> = {
	[SquareColor.LEGAL]: 'legal cursor-pointer',
	[SquareColor.LEGALHOVER]: 'legal-h cursor-pointer',
	[SquareColor.SELECT]: 'select-db',
	[SquareColor.MOVE]: 'move-db',
	[SquareColor.NEXTMOVE]: 'nextMove',
	[SquareColor.PREMOVE]: 'preMove cursor-pointer',
	[SquareColor.PREMOVEHOVER]: 'preMove-h cursor-pointer',
	[SquareColor.CHECK]: 'check'
};

export const colors = { white: '#94A3B8', black: '#475569' };
export const imageName = 'darkBlue.svg';

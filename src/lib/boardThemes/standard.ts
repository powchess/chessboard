import type { SquareType } from '$lib/enums';

export const squareStyles: Record<SquareType, string> = {
	LEGAL: 'legal cursor-pointer',
	LEGALHOVER: 'legal-h cursor-pointer',
	SELECT: 'select',
	MOVE: 'move',
	NEXTMOVE: 'nextMove',
	PREMOVE: 'preMove cursor-pointer',
	PREMOVEHOVER: 'preMove-h cursor-pointer',
	CHECK: 'check'
};

export const colors = { white: '#f0d9b5', black: '#b58863' };
export const imageName = 'standard.svg';

import type { SquareType } from '$lib/enums.js';

export const squareStyles: Record<SquareType, string> = {
	LEGAL: 'legal cursor-pointer',
	LEGALHOVER: 'legal-h cursor-pointer',
	SELECT: 'select-db',
	MOVE: 'move-db',
	NEXTMOVE: 'nextMove',
	PREMOVE: 'preMove cursor-pointer',
	PREMOVEHOVER: 'preMove-h cursor-pointer',
	CHECK: 'check'
};

export const colors = { white: '#94A3B8', black: '#475569' };
export const imageName = 'darkBlue.svg';

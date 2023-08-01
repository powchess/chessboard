import type HighlightState from './state/highlight';

export type Color = 'WHITE' | 'BLACK' | 'BOTH';

export type SquareType =
	| 'LEGAL'
	| 'LEGALHOVER'
	| 'CHECK'
	| 'MOVE'
	| 'NEXTMOVE'
	| 'PREMOVE'
	| 'PREMOVEHOVER'
	| 'SELECT';

export const squareColorToString = (
	color: SquareType | keyof HighlightState['settings']
): keyof HighlightState['settings'] => {
	if (color[0] === color[0].toLowerCase()) return color as keyof HighlightState['settings'];
	switch (color) {
		case 'LEGAL':
		case 'LEGALHOVER':
			return 'legal';
		case 'CHECK':
			return 'check';
		case 'MOVE':
			return 'move';
		case 'NEXTMOVE':
			return 'nextMove';
		case 'PREMOVE':
		case 'PREMOVEHOVER':
			return 'preMove';
		case 'SELECT':
			return 'select';
		default:
			return 'check';
	}
};

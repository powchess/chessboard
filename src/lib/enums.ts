export enum Color {
	WHITE,
	BLACK,
	BOTH,
	SPECTATOR,
	SERVER
}

export enum SquareColor {
	LEGAL,
	LEGALHOVER,
	CHECK,
	MOVE,
	NEXTMOVE,
	PREMOVE,
	PREMOVEHOVER,
	SELECT
}

export const squareColorToString = (
	color: SquareColor | 'legal' | 'check' | 'move' | 'nextMove' | 'preMove' | 'select'
): 'legal' | 'check' | 'move' | 'nextMove' | 'preMove' | 'select' => {
	if (typeof color === 'string') return color;
	switch (color) {
		case SquareColor.LEGAL:
		case SquareColor.LEGALHOVER:
			return 'legal';
		case SquareColor.CHECK:
			return 'check';
		case SquareColor.MOVE:
			return 'move';
		case SquareColor.NEXTMOVE:
			return 'nextMove';
		case SquareColor.PREMOVE:
		case SquareColor.PREMOVEHOVER:
			return 'preMove';
		case SquareColor.SELECT:
			return 'select';
		default:
			return 'check';
	}
};

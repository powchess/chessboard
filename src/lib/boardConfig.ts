import type { Color } from './enums';

type TupleToUnion<T extends unknown[]> = T[number];
export const BoardThemes = ['standard', 'darkBlue'] as const;
export type BoardTheme = 'standard' | 'darkBlue';
export type PiecesThemes = 'standard';
export type MoveTypeSound = 'MOVE' | 'CAPTURE' | 'CASTLE' | 'UNDO';
// prettier-ignore
type EasingTuple = ['backIn','backInOut','backOut','bounceIn','bounceInOut','bounceOut','circIn','circInOut','circOut','cubicIn','cubicInOut','cubicOut','elasticIn','elasticInOut','elasticOut','expoIn','expoInOut','expoOut','linear','quadIn','quadInOut','quadOut','quartIn','quartInOut','quartOut','quintIn','quintInOut','quintOut','sineIn','sineInOut','sineOut'];
// prettier-ignore
export const EasingFuncsArray = ['backIn','backInOut','backOut','bounceIn','bounceInOut','bounceOut','circIn','circInOut','circOut','cubicIn','cubicInOut','cubicOut','elasticIn','elasticInOut','elasticOut','expoIn','expoInOut','expoOut','linear','quadIn','quadInOut','quadOut','quartIn','quartInOut','quartOut','quintIn','quintInOut','quintOut','sineIn','sineInOut','sineOut'] as const;

export type EasingFuncs = TupleToUnion<EasingTuple>;
export type KingLocations = { [Color.WHITE]: string; [Color.BLACK]: string };

export type ChessboardConfig = {
	board?: {
		boardTheme?: BoardTheme;
		piecesTheme?: PiecesThemes;
		flipped?: boolean;
		notation?: boolean;
		shadow?: boolean;
		startFen?: string;
		startSize?: number;
	};

	/**
	 * Allow to move pieces + color of allowed to move pieces
	 * @value true - moving is allowed for both colors
	 * @value 'both - same as for true
	 * @value Color.WHITE - allowed to move only white
	 * @value Color.BLACK - allowed to move only black
	 * @value false - moving is not allowed
	 */
	movable?: boolean | Color.WHITE | Color.BLACK | Color.BOTH;

	draggable?:
		| boolean
		| {
				ghostPiece?: boolean;
				transition?:
					| boolean
					| {
							duration?: number;
							easing?: EasingFuncs;
					  };
		  };

	selectable?: boolean;

	legal?:
		| boolean
		| {
				settings?: {
					allowPromotion: boolean;
					allowEnPassant: boolean;
					allowCastling: boolean;
				};
				preMoves?: boolean;
		  };

	callbacks?: {
		getLegalMoves?: () => string[];
		getPreMoves?: () => string[];
		beforeMove?: (move: string) => void;
		afterMove?: (move: string) => void;
		getLastMove?: () => string;
		getLastMoveSAN?: () => string;
		getKingLocations?: () => KingLocations;
		getInCheck?: () => Color.WHITE | Color.BLACK | undefined;
		getWhiteToMove?: () => boolean;
	};

	highlight?:
		| boolean
		| {
				select?: boolean;
				legal?: boolean;
				move?: boolean;
				preMove?: boolean;
				nextMove?: boolean;
				check?: boolean;
		  };

	drawTools?:
		| boolean
		| {
				LshapeKnightMove?: boolean;
				onlyChessMove?: boolean;
		  };

	sounds?:
		| boolean
		| {
				MOVE?: boolean;
				CAPTURE?: boolean;
				CASTLE?: boolean;
				UNDO?: boolean;
		  };

	resizible?:
		| boolean
		| {
				min?: number;
				max?: number;
		  };
};

import type { Piece, PieceId } from './state/piece.js';

type TupleToUnion<T extends unknown[]> = T[number];
export const BoardThemes = ['standard', 'darkBlue'] as const;
export type BoardTheme = 'standard' | 'darkBlue';
export type MoveTypeSound = 'MOVE' | 'CAPTURE' | 'CASTLE' | 'UNDO';
// prettier-ignore
type EasingTuple = ['backIn','backInOut','backOut','bounceIn','bounceInOut','bounceOut','circIn','circInOut','circOut','cubicIn','cubicInOut','cubicOut','elasticIn','elasticInOut','elasticOut','expoIn','expoInOut','expoOut','linear','quadIn','quadInOut','quadOut','quartIn','quartInOut','quartOut','quintIn','quintInOut','quintOut','sineIn','sineInOut','sineOut'];
// prettier-ignore
export const EasingFuncsArray = ['backIn','backInOut','backOut','bounceIn','bounceInOut','bounceOut','circIn','circInOut','circOut','cubicIn','cubicInOut','cubicOut','elasticIn','elasticInOut','elasticOut','expoIn','expoInOut','expoOut','linear','quadIn','quadInOut','quadOut','quartIn','quartInOut','quartOut','quintIn','quintInOut','quintOut','sineIn','sineInOut','sineOut'] as const;

export type EasingFuncs = TupleToUnion<EasingTuple>;

export type ChessboardConfig = {
	board?: {
		boardTheme?: BoardTheme;
		skins?: {
			enabled?: boolean;
			urls?: {
				[K in PieceId]?: string;
			};
		};
		mouseEvents?: boolean;
		flipped?: boolean;
		notation?: boolean;
		startFen?: string;
		startPieces?: Piece[];
		scale?: number;
		resizible?: boolean;
	};

	/**
	 * Allow to move pieces + color of allowed to move pieces
	 * @value true - moving is allowed for both colors
	 * @value 'both - same as for true
	 * @value Color.WHITE - allowed to move only white
	 * @value Color.BLACK - allowed to move only black
	 * @value false - moving is not allowed
	 */
	movable?: boolean | 'WHITE' | 'BLACK' | 'BOTH';

	draggable?:
		| boolean
		| {
				ghostPiece?: boolean;
				transition?:
					| boolean
					| {
							duration?: number;
							easing?: EasingFuncs;
							clickMoveAnimation?: boolean;
					  };
		  };

	selectable?: boolean;

	legal?:
		| boolean
		| {
				enabled?: boolean;
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
		getInCheck?: () => boolean;
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
				knightLShape?: boolean;
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
};

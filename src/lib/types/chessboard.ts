import type { BoardThemes } from '../boardThemes/boardThemes';
import type { PiecesThemes } from '../piecesThemes/piecesThemes';

export enum Color {
	WHITE,
	BLACK,
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

export type MoveTypeSound = 'MOVE' | 'CAPTURE' | 'CASTLE' | 'UNDO';
// prettier-ignore
export type EasingTuple = ['backIn','backInOut','backOut','bounceIn','bounceInOut','bounceOut','circIn','circInOut','circOut','cubicIn','cubicInOut','cubicOut','elasticIn','elasticInOut','elasticOut','expoIn','expoInOut','expoOut','linear','quadIn','quadInOut','quadOut','quartIn','quartInOut','quartOut','quintIn','quintInOut','quintOut','sineIn','sineInOut','sineOut'];

export type EasingFuncs = TupleToUnion<EasingTuple>;

export type KingLocations = { [Color.WHITE]: string; [Color.BLACK]: string };

export type ChessboardConfig = {
	board?: {
		boardTheme?: BoardThemes;
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
	movable?: boolean | Color.WHITE | Color.BLACK | 'both';

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

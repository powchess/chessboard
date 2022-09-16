import type { ChessboardConfig, KingLocations } from '$lib/boardConfig';
import type { Color } from '$lib/enums';

export default class Callbacks {
	public getLegalMoves: (() => string[]) | undefined;

	public getPreMoves: (() => string[]) | undefined;

	public beforeMove: ((move: string) => void) | undefined;

	public afterMove: ((move: string) => void) | undefined;

	public getLastMove: (() => string) | undefined;

	public getLastMoveSAN: (() => string) | undefined;

	public getKingLocations: (() => KingLocations) | undefined;

	public getInCheck: (() => Color.WHITE | Color.BLACK | undefined) | undefined;

	public getWhiteToMove: (() => boolean) | undefined;

	public defaultState = {
		getLegalMoves: undefined,
		getPreMoves: undefined,
		beforeMove: undefined,
		afterMove: undefined,
		getLastMove: undefined,
		getLastMoveSAN: undefined,
		getKingLocations: undefined,
		getInCheck: undefined,
		getWhiteToMove: undefined
	} as const;

	constructor(config?: ChessboardConfig['callbacks']) {
		this.getLegalMoves = this.defaultState.getLegalMoves;
		this.getPreMoves = this.defaultState.getPreMoves;
		this.beforeMove = this.defaultState.beforeMove;
		this.afterMove = this.defaultState.afterMove;
		this.getLastMove = this.defaultState.getLastMove;
		this.getLastMoveSAN = this.defaultState.getLastMoveSAN;
		this.getKingLocations = this.defaultState.getKingLocations;
		this.getInCheck = this.defaultState.getInCheck;
		this.getWhiteToMove = this.defaultState.getWhiteToMove;

		this.setConfigSettings(config);
	}

	public setConfigSettings = (config?: ChessboardConfig['callbacks']) => {
		if (config !== undefined) {
			if (config.getLegalMoves) this.getLegalMoves = config.getLegalMoves;
			if (config.getPreMoves) this.getPreMoves = config.getPreMoves;
			if (config.beforeMove) this.beforeMove = config.beforeMove;
			if (config.afterMove) this.afterMove = config.afterMove;
			if (config.getLastMove) this.getLastMove = config.getLastMove;
			if (config.getLastMoveSAN) this.getLastMoveSAN = config.getLastMoveSAN;
			if (config.getKingLocations) this.getKingLocations = config.getKingLocations;
			if (config.getInCheck) this.getInCheck = config.getInCheck;
			if (config.getWhiteToMove) this.getWhiteToMove = config.getWhiteToMove;
		}
	};

	public getConfig = () => {
		const callbacks = {
			...(this.getLegalMoves && { getLegalMoves: this.getLegalMoves }),
			...(this.getPreMoves && { getPreMoves: this.getPreMoves }),
			...(this.beforeMove && { beforeMove: this.beforeMove }),
			...(this.afterMove && { afterMove: this.afterMove }),
			...(this.getLastMove && { getLastMove: this.getLastMove }),
			...(this.getLastMoveSAN && { getLastMoveSAN: this.getLastMoveSAN }),
			...(this.getKingLocations && { getKingLocations: this.getKingLocations }),
			...(this.getInCheck && { getInCheck: this.getInCheck }),
			...(this.getWhiteToMove && { getWhiteToMove: this.getWhiteToMove })
		};

		return Object.keys(callbacks).length > 0 ? callbacks : undefined;
	};
}

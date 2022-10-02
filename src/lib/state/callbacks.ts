import type { ChessboardConfig } from '$lib/boardConfig';

export default class Callbacks {
	public getLegalMoves: (() => string[]) | undefined;

	public getPreMoves: (() => string[]) | undefined;

	public beforeMove: ((move: string) => void) | undefined;

	public afterMove: ((move: string) => void) | undefined;

	public getLastMove: (() => string) | undefined;

	public getInCheck: (() => boolean) | undefined;

	public getWhiteToMove: (() => boolean) | undefined;

	public defaultState = {
		getLegalMoves: undefined,
		getPreMoves: undefined,
		beforeMove: undefined,
		afterMove: undefined,
		getLastMove: undefined,
		getInCheck: undefined,
		getWhiteToMove: undefined
	} as const;

	constructor(config?: ChessboardConfig['callbacks']) {
		this.getLegalMoves = this.defaultState.getLegalMoves;
		this.getPreMoves = this.defaultState.getPreMoves;
		this.beforeMove = this.defaultState.beforeMove;
		this.afterMove = this.defaultState.afterMove;
		this.getLastMove = this.defaultState.getLastMove;
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
			...(this.getInCheck && { getInCheck: this.getInCheck }),
			...(this.getWhiteToMove && { getWhiteToMove: this.getWhiteToMove })
		};

		return Object.keys(callbacks).length > 0 ? callbacks : undefined;
	};
}

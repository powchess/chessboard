import type { ChessboardConfig } from '$lib/boardConfig';

export default class LegalState {
	public enabled: boolean;

	public whiteToMove: boolean;

	public moves: string[];

	public settings: {
		allowPromotion: boolean;
		allowEnPassant: boolean;
		allowCastling: boolean;
	};

	public preMoves: {
		enabled: boolean;
		moves: string[];
		curMove: string;
	};

	public lastMove: string;

	public defaultState = {
		enabled: false,
		whiteToMove: true,
		moves: [],
		settings: {
			allowPromotion: true,
			allowEnPassant: true,
			allowCastling: true
		},
		preMoves: {
			enabled: false,
			moves: [],
			curMove: ''
		},
		lastMove: ''
	} as const;

	constructor(config?: ChessboardConfig['legal']) {
		this.enabled = this.defaultState.enabled;
		this.whiteToMove = this.defaultState.whiteToMove;
		this.moves = JSON.parse(JSON.stringify(this.defaultState.moves));
		this.settings = { ...this.defaultState.settings };

		this.preMoves = {
			enabled: this.defaultState.preMoves.enabled,
			moves: [...this.defaultState.preMoves.moves],
			curMove: this.defaultState.preMoves.curMove
		};

		this.lastMove = this.defaultState.lastMove;

		this.setConfigSettings(config);
	}

	public setConfigSettings = (config?: ChessboardConfig['legal']) => {
		if (config !== undefined) {
			if (config === true) this.enabled = true;
			else if (config === false) this.enabled = false;
			else {
				this.enabled = true;
				if (config.settings) {
					if (config.settings.allowCastling !== undefined) this.settings.allowCastling = config.settings.allowCastling;
					if (config.settings.allowEnPassant !== undefined) this.settings.allowEnPassant = config.settings.allowEnPassant;
					if (config.settings.allowPromotion !== undefined) this.settings.allowPromotion = config.settings.allowPromotion;
				}
				if (config.preMoves !== undefined) this.preMoves.enabled = config.preMoves;
			}
		}
	};

	public getConfig = () => {
		if (this.enabled && this.defaultState.enabled) {
			if (this.preMoves.enabled !== this.defaultState.preMoves.enabled) return { preMoves: this.preMoves.enabled };
		}
		if (this.enabled !== this.defaultState.enabled) {
			if (this.preMoves.enabled !== this.defaultState.preMoves.enabled) return { preMoves: this.preMoves.enabled };
			return this.enabled;
		}
		return undefined;
	};
}

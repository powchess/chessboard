import type { ChessboardConfig } from '$lib/boardConfig';
import type { ArrowData } from '$lib/state/index';

export default class DrawToolsState {
	public enabled: boolean;

	public engineArrows: ArrowData[];

	public settings: {
		LshapeKnightMove: boolean;
		onlyChessMove: boolean;
	};

	public defaultState = {
		enabled: true,
		engineArrows: [],
		settings: {
			LshapeKnightMove: true,
			onlyChessMove: false
		}
	} as const;

	constructor(config?: ChessboardConfig['drawTools']) {
		this.enabled = this.defaultState.enabled;

		this.engineArrows = JSON.parse(JSON.stringify(this.defaultState.engineArrows));

		this.settings = {
			LshapeKnightMove: this.defaultState.settings.LshapeKnightMove,
			onlyChessMove: this.defaultState.settings.onlyChessMove
		};

		this.setConfigSettings(config);
	}

	public setConfigSettings = (config?: ChessboardConfig['drawTools']) => {
		if (config !== undefined) {
			if (config === true) this.enabled = true;
			else if (config === false) this.enabled = false;
			else {
				this.enabled = true;
				if (config.LshapeKnightMove !== undefined) this.settings.LshapeKnightMove = config.LshapeKnightMove;
				if (config.onlyChessMove !== undefined) this.settings.onlyChessMove = config.onlyChessMove;
			}
		}
	};

	public getConfig = () => {
		const drawTools: {
			LshapeKnightMove?: boolean;
			onlyChessMove?: boolean;
		} = {};

		if (this.enabled && this.defaultState.enabled) {
			if (this.settings.LshapeKnightMove !== this.defaultState.settings.LshapeKnightMove)
				drawTools.LshapeKnightMove = this.settings.LshapeKnightMove;
			if (this.settings.onlyChessMove !== this.defaultState.settings.onlyChessMove) drawTools.onlyChessMove = this.settings.onlyChessMove;

			if (Object.keys(drawTools).length !== 0) return drawTools;
		}
		if (this.enabled !== this.defaultState.enabled) return this.enabled;
		return undefined;
	};
}

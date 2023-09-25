import type { ChessboardConfig } from '$lib/boardConfig.js';

export default class HighlightState {
	public enabled: boolean;

	public settings: {
		select: boolean;
		legal: boolean;
		move: boolean;
		preMove: boolean;
		nextMove: boolean;
		check: boolean;
	};

	public defaultState = {
		enabled: true,
		settings: {
			select: true,
			legal: true,
			move: true,
			preMove: false,
			nextMove: false,
			check: true
		}
	} as const;

	constructor(config?: ChessboardConfig['highlight']) {
		this.enabled = this.defaultState.enabled;
		this.settings = { ...this.defaultState.settings };

		this.setConfigSettings(config);
	}

	public setConfigSettings = (config?: ChessboardConfig['highlight']) => {
		if (config !== undefined) {
			if (config === true) this.enabled = true;
			else if (config === false) this.enabled = false;
			else {
				this.enabled = true;
				if (config.check !== undefined) this.settings.check = config.check;
				if (config.legal !== undefined) this.settings.legal = config.legal;
				if (config.move !== undefined) this.settings.move = config.move;
				if (config.nextMove !== undefined) this.settings.nextMove = config.nextMove;
				if (config.preMove !== undefined) this.settings.preMove = config.preMove;
				if (config.select !== undefined) this.settings.select = config.select;
			}
		}
	};

	public getConfig = () => {
		const highlight: {
			select?: boolean;
			legal?: boolean;
			move?: boolean;
			preMove?: boolean;
			nextMove?: boolean;
			check?: boolean;
		} = {};

		const highlightKeys = ['select', 'legal', 'move', 'preMove', 'nextMove', 'check'] as const;

		if (this.enabled && this.defaultState.enabled) {
			highlightKeys.forEach((key) => {
				if (this.settings[key] !== this.defaultState.settings[key])
					highlight[key] = this.settings[key];
			});

			if (Object.keys(highlight).length !== 0) return highlight;
		}
		if (this.enabled !== this.defaultState.enabled) return this.enabled;
		return undefined;
	};
}

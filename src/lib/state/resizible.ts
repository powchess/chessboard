import type { ChessboardConfig } from '$lib/boardConfig';

export default class ResizibleState {
	public enabled: boolean;

	public settings: {
		min: number;
		max: number;
	};

	public defaultState = {
		enabled: false,
		settings: {
			min: 100,
			max: 1000
		}
	} as const;

	constructor(config?: ChessboardConfig['resizible']) {
		this.enabled = this.defaultState.enabled;
		this.settings = { ...this.defaultState.settings };

		this.setConfigSettings(config);
	}

	public setConfigSettings = (config?: ChessboardConfig['resizible']) => {
		if (config !== undefined) {
			if (config === true) this.enabled = true;
			else if (config === false) this.enabled = false;
			else {
				this.enabled = true;
				if (config.min !== undefined) this.settings.min = config.min;
				if (config.max !== undefined) this.settings.max = config.max;
			}
		}
	};

	public getConfig = () => {
		if (this.enabled !== this.defaultState.enabled) return this.enabled;
		return undefined;
	};
}

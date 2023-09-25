import type { ChessboardConfig } from '$lib/boardConfig.js';
import type { Color } from '$lib/enums.js';

export default class MovableState {
	public enabled: boolean;

	public color: Color;

	public defaultState = {
		enabled: true,
		color: 'BOTH'
	} as const;

	constructor(config?: ChessboardConfig['movable']) {
		this.enabled = this.defaultState.enabled;
		this.color = this.defaultState.color;

		this.setConfigSettings(config);
	}

	public setConfigSettings = (config?: ChessboardConfig['movable']) => {
		switch (config) {
			case true:
				this.enabled = true;
				this.color = 'BOTH';
				break;
			case false:
				this.enabled = false;
				break;
			case 'WHITE':
				this.enabled = true;
				this.color = 'WHITE';
				break;
			case 'BLACK':
				this.enabled = true;
				this.color = 'BLACK';
				break;
			default:
				break;
		}
	};

	public getConfig = (): undefined | Color | boolean => {
		if (this.enabled && this.defaultState.enabled && this.color !== this.defaultState.color)
			return this.color;
		if (this.enabled && !this.defaultState.enabled) return this.color;
		if (!this.enabled && this.defaultState.enabled) return false;
		return undefined;
	};
}

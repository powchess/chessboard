import type { ChessboardConfig } from '$lib/boardConfig';
import { Color } from '$lib/enums';

export default class MovableState {
	public enabled: boolean;

	public color: Color.WHITE | Color.BLACK | Color.BOTH;

	public defaultState = {
		enabled: true,
		color: Color.BOTH
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
				this.color = Color.BOTH;
				break;
			case false:
				this.enabled = false;
				break;
			case Color.WHITE:
				this.enabled = true;
				this.color = Color.WHITE;
				break;
			case Color.BLACK:
				this.enabled = true;
				this.color = Color.BLACK;
				break;
			default:
				break;
		}
	};

	public getConfig = (): undefined | Color.WHITE | Color.BLACK | Color.BOTH | boolean => {
		if (this.enabled && this.defaultState.enabled && this.color !== this.defaultState.color)
			return this.color;
		if (this.enabled && !this.defaultState.enabled) return this.color;
		if (!this.enabled && this.defaultState.enabled) return false;
		return undefined;
	};
}

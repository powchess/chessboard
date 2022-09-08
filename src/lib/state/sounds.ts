import type { ChessboardConfig } from '$lib/boardConfig';

export default class SoundsState {
	public enabled: boolean;

	public settings: {
		MOVE: boolean;
		CAPTURE: boolean;
		CASTLE: boolean;
		UNDO: boolean;
	};

	public defaultState = {
		enabled: true,
		settings: {
			MOVE: true,
			CAPTURE: true,
			CASTLE: true,
			UNDO: true
		}
	} as const;

	constructor(config?: ChessboardConfig['sounds']) {
		this.enabled = this.defaultState.enabled;

		this.settings = { ...this.defaultState.settings };

		if (config !== undefined) {
			if (config === true) this.enabled = true;
			else if (config === false) this.enabled = false;
			else {
				this.enabled = true;
				if (config.CAPTURE !== undefined) this.settings.CAPTURE = config.CAPTURE;
				if (config.CASTLE !== undefined) this.settings.CASTLE = config.CASTLE;
				if (config.MOVE !== undefined) this.settings.MOVE = config.MOVE;
				if (config.UNDO !== undefined) this.settings.UNDO = config.UNDO;
			}
		}
	}

	public setConfigSettings = (config?: ChessboardConfig['sounds']) => {
		if (config !== undefined) {
			if (config === true) this.enabled = true;
			else if (config === false) this.enabled = false;
			else {
				this.enabled = true;
				if (config.CAPTURE !== undefined) this.settings.CAPTURE = config.CAPTURE;
				if (config.CASTLE !== undefined) this.settings.CASTLE = config.CASTLE;
				if (config.MOVE !== undefined) this.settings.MOVE = config.MOVE;
				if (config.UNDO !== undefined) this.settings.UNDO = config.UNDO;
			}
		}
	};

	public getConfig = () => {
		const sounds: {
			MOVE?: boolean;
			CAPTURE?: boolean;
			CASTLE?: boolean;
			UNDO?: boolean;
		} = {};

		if (this.enabled && this.defaultState.enabled) {
			if (this.settings.MOVE !== this.defaultState.settings.MOVE) sounds.MOVE = this.settings.MOVE;
			if (this.settings.CAPTURE !== this.defaultState.settings.CAPTURE) sounds.CAPTURE = this.settings.CAPTURE;
			if (this.settings.CASTLE !== this.defaultState.settings.CASTLE) sounds.CASTLE = this.settings.CASTLE;
			if (this.settings.UNDO !== this.defaultState.settings.UNDO) sounds.UNDO = this.settings.UNDO;

			if (Object.keys(sounds).length !== 0) return sounds;
		}
		if (this.enabled !== this.defaultState.enabled) return this.enabled;
		return undefined;
	};
}

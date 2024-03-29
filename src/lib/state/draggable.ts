import type { ChessboardConfig, EasingFuncs } from '$lib/boardConfig.js';
import type { Piece } from './piece.js';

export default class DraggableState {
	public enabled: boolean;

	public ghostPiece: {
		enabled: boolean;
		piece: Piece | undefined;
	};

	public transition: {
		enabled: boolean;
		settings: {
			duration: number;
			easing: EasingFuncs;
			clickMoveAnimation: boolean;
		};
	};

	public defaultState = {
		enabled: true,
		ghostPiece: {
			enabled: true,
			piece: undefined
		},
		transition: {
			enabled: true,
			settings: {
				duration: 120,
				easing: 'cubicInOut',
				clickMoveAnimation: true
			}
		}
	} as const;

	constructor(config?: ChessboardConfig['draggable']) {
		this.enabled = this.defaultState.enabled;

		this.ghostPiece = { ...this.defaultState.ghostPiece };

		this.transition = {
			enabled: this.defaultState.transition.enabled,
			settings: { ...this.defaultState.transition.settings }
		};

		this.setConfigSettings(config);
	}

	public setConfigSettings = (config?: ChessboardConfig['draggable']) => {
		if (config !== undefined) {
			if (config === true) this.enabled = true;
			else if (config === false) this.enabled = false;
			else {
				this.enabled = true;
				if (config?.ghostPiece !== undefined) this.ghostPiece.enabled = config.ghostPiece;
				if (config.transition !== undefined) {
					if (config?.transition === true) this.transition.enabled = true;
					else if (config?.transition === false) this.transition.enabled = false;
					else {
						this.transition.enabled = true;
						if (config?.transition?.duration !== undefined)
							this.transition.settings.duration = config.transition.duration;
						if (config?.transition?.easing !== undefined)
							this.transition.settings.easing = config.transition.easing;
						if (config?.transition?.clickMoveAnimation !== undefined)
							this.transition.settings.clickMoveAnimation = config.transition.clickMoveAnimation;
					}
				}
			}
		}
	};

	public getConfig = () => {
		const draggable: ChessboardConfig['draggable'] = {};

		const transition: {
			duration?: number;
			easing?: EasingFuncs;
			clickMoveAnimation?: boolean;
		} = {};

		if (this.enabled && this.defaultState.enabled) {
			if (this.ghostPiece.enabled !== this.defaultState.ghostPiece.enabled)
				draggable.ghostPiece = this.ghostPiece.enabled;
			if (this.transition.enabled && this.defaultState.transition.enabled) {
				if (this.transition.settings.duration !== this.defaultState.transition.settings.duration)
					transition.duration = this.transition.settings.duration;
				if (this.transition.settings.easing !== this.defaultState.transition.settings.easing)
					transition.easing = this.transition.settings.easing;
				if (
					this.transition.settings.clickMoveAnimation !==
					this.defaultState.transition.settings.clickMoveAnimation
				)
					transition.clickMoveAnimation = this.transition.settings.clickMoveAnimation;

				if (Object.keys(transition).length !== 0) draggable.transition = transition;
			}
			if (!this.transition.enabled && this.defaultState.transition.enabled)
				draggable.transition = false;

			if (Object.keys(draggable).length !== 0) return draggable;
		}
		if (!this.enabled && this.defaultState.enabled) return false;
		return undefined;
	};
}

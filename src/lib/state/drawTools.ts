import type { ChessboardConfig } from '$lib/boardConfig';
import type { ArrowTool, CircleTool } from '$lib/drawArrows';

export default class DrawToolsState {
	public enabled: boolean;

	public tools: (CircleTool | ArrowTool)[];

	public settings: {
		knightLShape: boolean;
		onlyChessMove: boolean;
	};

	public defaultState = {
		enabled: true,
		tools: [],
		settings: {
			knightLShape: false,
			onlyChessMove: false
		}
	} as const;

	constructor(config?: ChessboardConfig['drawTools']) {
		this.enabled = this.defaultState.enabled;

		this.tools = <(CircleTool | ArrowTool)[]>JSON.parse(JSON.stringify(this.defaultState.tools));

		this.settings = {
			knightLShape: this.defaultState.settings.knightLShape,
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
				if (config.knightLShape !== undefined) this.settings.knightLShape = config.knightLShape;
				if (config.onlyChessMove !== undefined) this.settings.onlyChessMove = config.onlyChessMove;
			}
		}
	};

	public getConfig = () => {
		const drawTools: {
			knightLShape?: boolean;
			onlyChessMove?: boolean;
		} = {};

		if (this.enabled && this.defaultState.enabled) {
			if (this.settings.knightLShape !== this.defaultState.settings.knightLShape) drawTools.knightLShape = this.settings.knightLShape;
			if (this.settings.onlyChessMove !== this.defaultState.settings.onlyChessMove) drawTools.onlyChessMove = this.settings.onlyChessMove;

			if (Object.keys(drawTools).length !== 0) return drawTools;
		}
		if (this.enabled !== this.defaultState.enabled) return this.enabled;
		return undefined;
	};
}

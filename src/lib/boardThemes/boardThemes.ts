import {
	squareStyles as standardSquareStyles,
	colors as standardColors,
	imageName as standardImageName
} from './standard';
import {
	squareStyles as darkBlueSquareStyles,
	colors as darkBlueColors,
	imageName as darkBlueImageName
} from './darkBlue';

const boardThemesStyles = {
	squareStyles: {
		standard: standardSquareStyles,
		darkBlue: darkBlueSquareStyles
	},
	colors: {
		standard: standardColors,
		darkBlue: darkBlueColors
	},
	imageName: {
		standard: standardImageName,
		darkBlue: darkBlueImageName
	}
} as const;

export default boardThemesStyles;

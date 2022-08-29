import wP from './assets/images/wP.svg';
import wR from './assets/images/wR.svg';
import wN from './assets/images/wN.svg';
import wB from './assets/images/wB.svg';
import wQ from './assets/images/wQ.svg';
import wK from './assets/images/wK.svg';
import bP from './assets/images/bP.svg';
import bR from './assets/images/bR.svg';
import bN from './assets/images/bN.svg';
import bB from './assets/images/bB.svg';
import bQ from './assets/images/bQ.svg';
import bK from './assets/images/bK.svg';
import type { ChessPiece } from './types/chess';

export const getChessPieceImage = (piece: ChessPiece) => {
	switch (piece) {
		case 'wP':
			return wP;
		case 'wR':
			return wR;
		case 'wN':
			return wN;
		case 'wB':
			return wB;
		case 'wQ':
			return wQ;
		case 'wK':
			return wK;
		case 'bP':
			return bP;
		case 'bR':
			return bR;
		case 'bN':
			return bN;
		case 'bB':
			return bB;
		case 'bQ':
			return bQ;
		case 'bK':
			return bK;
		default:
			return wP;
	}
};

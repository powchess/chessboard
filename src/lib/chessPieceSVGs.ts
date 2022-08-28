import wP from '../assets/wP.svg';
import wR from '../assets/wR.svg';
import wN from '../assets/wN.svg';
import wB from '../assets/wB.svg';
import wQ from '../assets/wQ.svg';
import wK from '../assets/wK.svg';
import bP from '../assets/bP.svg';
import bR from '../assets/bR.svg';
import bN from '../assets/bN.svg';
import bB from '../assets/bB.svg';
import bQ from '../assets/bQ.svg';
import bK from '../assets/bK.svg';
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

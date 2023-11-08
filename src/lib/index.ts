import Chessboard from './Chessboard.svelte';
import type { ChessboardConfig } from './boardConfig.js';
import ShowcasePiece from './ShowcasePiece.svelte';
import { Pieces } from './state/piece.js';

export { type ChessboardConfig, ShowcasePiece, Pieces };
export default Chessboard;

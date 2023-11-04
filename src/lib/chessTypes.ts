type IndicesTo<T extends number, I extends number[] = []> = I['length'] extends T
	? I
	: IndicesTo<T, [...I, I['length']]>;
type TupleToUnion<T extends unknown[]> = T[number];

export type ChessFile = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
export type ChessRank = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
export type ChessSquare = `${ChessFile}${ChessRank}`;
export type ChessIndex = TupleToUnion<IndicesTo<8>>;
type Piece = 'K' | 'Q' | 'R' | 'B' | 'N' | 'P';
export type ChessWhitePiece = `w${Piece}`;
export type ChessBlackPiece = `b${Piece}`;
export type ChessPiece = ChessWhitePiece | ChessBlackPiece;

type BoardRank<
	T extends number = 8,
	Rank extends (ChessPiece | null)[] = []
> = Rank['length'] extends T ? Rank : BoardRank<T, [...Rank, ChessPiece | null]>;

export type ChessBoard<
	T extends number = 8,
	Board extends BoardRank[] = []
> = Board['length'] extends T ? Board : ChessBoard<T, [...Board, BoardRank]>;

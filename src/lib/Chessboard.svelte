<script context="module" lang="ts">
	export type ChessboardConfig = Config;
</script>

<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount, tick } from 'svelte';
	import type { ChessboardConfig as Config, KingLocations, MoveTypeSound } from './boardConfig';
	import Chessboard from './chessboard';
	import Notation from './Notation.svelte';
	import Piece from './Piece.svelte';
	import Square from './Square.svelte';
	import drawArrows, { type ArrowData } from './drawArrows';
	import Arrows from './Arrows.svelte';
	import PromotionModal from './PromotionModal.svelte';
	import Sounds from './Sounds.svelte';
	import standardBoard from './assets/boards/standard.svg';
	import darkBlueBoard from './assets/boards/darkBlue.svg';
	import Resizing from './Resizing.svelte';
	import type { ChessPiece } from './chessTypes';
	import { Color, SquareColor } from './enums';
	import { browser } from '$app/environment';
	import type { State, Piece as StatePiece } from './state/index';

	export let config: ChessboardConfig;
	export let className = '';

	const chessboard = new Chessboard(config);
	const dispatch = createEventDispatcher();

	let boardDiv: HTMLDivElement;
	let arrowsSvg: SVGGElement;
	let sounds: Sounds;

	let promotionModal: PromotionModal;
	let promotionLastMove = '';

	onDestroy(() => {
		if (browser && document.documentElement.hasAttribute('style') && chessboard.state.board.resizible.enabled)
			document.documentElement.removeAttribute('style');
	});

	let computerArrows: ArrowData[] = [];
	let kingLocations: KingLocations = { [Color.WHITE]: '', [Color.BLACK]: '' };

	export const clearAllSquares = (mode?: SquareColor) => {
		chessboard.clearAllSquares(mode);
		if (mode === SquareColor.LEGAL) chessboard.clearAllSquares(SquareColor.LEGALHOVER);
		if (mode === SquareColor.PREMOVE) chessboard.clearAllSquares(SquareColor.PREMOVEHOVER);
		chessboard.state.markedSquares = chessboard.state.markedSquares;
	};

	export const highlightSquare = (square: string, mode: SquareColor): void => {
		chessboard.highlightSquare(square, mode);
		chessboard.state.markedSquares = chessboard.state.markedSquares;
	};

	const allowDrawHighlightSquares = (color?: 'legal' | 'move' | 'select' | 'check' | 'preMove' | 'nextMove') =>
		chessboard.state.highlight.enabled && (color === undefined || chessboard.state.highlight.settings[color]);

	export const selectPiece = (square: string) => {
		if (!chessboard.state.selectable.enabled) return;
		const piece = chessboard.getPieceFromSquare(square);
		if (piece === undefined) return;
		clearAllSquares(SquareColor.SELECT);
		chessboard.state.selectable.selectedPiece = piece;
		if (allowDrawHighlightSquares('select')) highlightSquare(square, SquareColor.SELECT);
	};

	export const deselect = () => {
		clearAllSquares(SquareColor.SELECT);
		clearAllSquares(SquareColor.LEGAL);
		clearAllSquares(SquareColor.PREMOVE);
		chessboard.state.selectable.selectedPiece = undefined;
		chessboard.state.legal.preMoves.curMove = '';
	};

	const setCheckSquare = (clr: Color.WHITE | Color.BLACK | undefined) => {
		clearAllSquares(SquareColor.CHECK);
		if (clr !== undefined && allowDrawHighlightSquares('check')) highlightSquare(kingLocations[clr], SquareColor.CHECK);
		chessboard.state.markedSquares = chessboard.state.markedSquares;
	};

	export const flipBoard = (flipped?: boolean) => {
		chessboard.flipBoard(flipped);
		chessboard.state.board.flipped = chessboard.state.board.flipped;
	};

	export const highlightManySquares = (squares: string[], mode: SquareColor): void => {
		squares.forEach((square) => chessboard.highlightSquare(square, mode));
		chessboard.state.markedSquares = chessboard.state.markedSquares;
	};

	export const highlightMove = (move: string, color: SquareColor = SquareColor.MOVE) => {
		if (move.length < 4) return;
		highlightManySquares([move.substring(0, 2), move.substring(2, 4)], color);
	};

	export const highlightMoves = (moves: string[], color: SquareColor = SquareColor.MOVE) => {
		const squares: string[] = [];

		moves.forEach((move) => {
			if (move.length < 4) return;
			squares.push(move.substring(0, 2));
			squares.push(move.substring(2, 4));
		});

		highlightManySquares(squares, color);
	};

	export const highlightLegalMove = (legalMove: string) => {
		highlightSquare(legalMove.substring(2, 4), SquareColor.LEGAL);
	};

	export const highlightLegalMoves = (legalMoves: string[], mode: SquareColor.LEGAL | SquareColor.PREMOVE = SquareColor.LEGAL) => {
		clearAllSquares(mode);

		legalMoves.forEach((move) => {
			if (move.length < 4) return;
			chessboard.highlightSquare(move.substring(2, 4), mode);
		});

		chessboard.state.markedSquares = chessboard.state.markedSquares;
	};

	export const movePiece = (move: string, highlight = true) => {
		chessboard.makeMove(move);
		if (highlight) {
			clearAllSquares(SquareColor.MOVE);
			if (allowDrawHighlightSquares('move')) highlightMove(move);
		}
		chessboard.state.pieces = chessboard.state.pieces;
	};

	export const removePiece = (square: string): void => {
		chessboard.removePiece(square);
		chessboard.state.pieces = chessboard.state.pieces;
	};

	const getColorFromString = (name: string) => (name[0] === 'w' ? Color.WHITE : Color.BLACK);

	const canMove = () =>
		chessboard.state.movable.enabled &&
		(chessboard.state.movable.color === Color.BOTH ||
			(chessboard.state.legal.whiteToMove && chessboard.state.movable.color === getColorFromString('w')) ||
			(!chessboard.state.legal.whiteToMove && chessboard.state.movable.color === getColorFromString('b')));

	const updateLegalStateIfNeeded = () => {
		if (!chessboard.state.legal.enabled) return;

		if (chessboard.state.callbacks.getWhiteToMove) chessboard.state.legal.whiteToMove = chessboard.state.callbacks.getWhiteToMove();

		if (chessboard.state.callbacks.getPreMoves && !canMove() && chessboard.state.legal.preMoves.enabled)
			chessboard.state.legal.preMoves.moves = chessboard.state.callbacks.getPreMoves();
		else chessboard.state.legal.preMoves.moves.length = 0;

		if (chessboard.state.callbacks.getLegalMoves && canMove()) chessboard.state.legal.moves = chessboard.state.callbacks.getLegalMoves();
		else chessboard.state.legal.moves.length = 0;

		// change preMoves to legalMoves
		if (canMove() && chessboard.state.selectable.selectedPiece !== undefined && chessboard.state.legal.preMoves.enabled) {
			clearAllSquares(SquareColor.PREMOVE);
			clearAllSquares(SquareColor.LEGAL);
			if (allowDrawHighlightSquares('legal')) {
				chessboard.state.legal.moves.forEach((move) => {
					if (chessboard.state.selectable.selectedPiece && move.substring(0, 2) === chessboard.state.selectable.selectedPiece.square)
						highlightSquare(move.substring(2, 4), SquareColor.LEGAL);
				});
			}
		}

		if (chessboard.state.callbacks.getKingLocations) kingLocations = chessboard.state.callbacks.getKingLocations();
		if (chessboard.state.callbacks.getInCheck) setCheckSquare(chessboard.state.callbacks.getInCheck());
	};

	export const playMoveSound = (moveType: MoveTypeSound) => {
		if (chessboard.state.sounds.enabled) sounds.playMoveSound(moveType);
	};

	const setGhostPiece = (piece: StatePiece) => {
		chessboard.setGhostPiece(piece);
		chessboard.state.draggable.ghostPiece.piece = chessboard.state.draggable.ghostPiece.piece;
	};

	const removeGhostPiece = () => {
		chessboard.removeGhostPiece();
		chessboard.state.draggable.ghostPiece.piece = chessboard.state.draggable.ghostPiece.piece;
	};

	export const makeMove = (move: string): void => {
		if (move.substring(0, 2) === move.substring(2, 4)) return;
		if (chessboard.state.callbacks.beforeMove) chessboard.state.callbacks.beforeMove(move);

		deselect();

		const rookMove = chessboard.getRookMoveIfIsCastling(move);
		const capturedPawnSquare = chessboard.getCapturedPawnSquareIfIsEnPassant(move);

		if (rookMove && chessboard.state.legal.enabled && chessboard.state.legal.settings.allowCastling) {
			movePiece(rookMove, false);
			playMoveSound('CASTLE');
		} else if (capturedPawnSquare && chessboard.state.legal.enabled && chessboard.state.legal.settings.allowEnPassant) {
			removePiece(capturedPawnSquare);
			playMoveSound('CAPTURE');
		} else if (chessboard.isCapture(move)) {
			playMoveSound('CAPTURE');
		} else playMoveSound('MOVE');

		removeGhostPiece();
		movePiece(move);

		if (chessboard.state.callbacks.afterMove) chessboard.state.callbacks.afterMove(move);
		updateLegalStateIfNeeded();

		if (chessboard.state.legal.enabled && chessboard.state.legal.preMoves.enabled && chessboard.state.legal.preMoves.curMove !== '') {
			if (
				chessboard.state.legal.moves.includes(chessboard.state.legal.preMoves.curMove) ||
				chessboard.state.legal.moves.includes(`${chessboard.state.legal.preMoves.curMove}q`)
			) {
				const tmp = chessboard.state.legal.preMoves.curMove;
				chessboard.state.legal.preMoves.curMove = '';
				tick().then(() => {
					makeMove(tmp);
				});
			}
			clearAllSquares(SquareColor.NEXTMOVE);
		}
	};

	export const makeNextMove = (move: string): void => {
		if (!chessboard.state.legal.enabled || !chessboard.state.legal.preMoves.enabled || !chessboard.state.movable.enabled) return;

		clearAllSquares(SquareColor.PREMOVE);
		clearAllSquares(SquareColor.NEXTMOVE);
		if (chessboard.state.highlight.enabled && chessboard.state.highlight.settings.nextMove) highlightMove(move, SquareColor.NEXTMOVE);
		chessboard.state.legal.preMoves.curMove = move;
		dispatch('nextMove', { move });
	};

	export const makeMovePromotion = (move: string): void => {
		promotionModal.openPromotionModal(true);
		promotionLastMove = move;
		chessboard.makeMove(move);
		clearAllSquares(SquareColor.LEGAL);
		clearAllSquares(SquareColor.SELECT);
		clearAllSquares(SquareColor.MOVE);
		highlightMove(move);
	};

	export const removeSquareHighlight = (square: string, mode?: SquareColor): void => {
		chessboard.clearSquare(square, mode);
		chessboard.state.markedSquares = chessboard.state.markedSquares;
	};

	export const removeAllPiece = (): void => {
		chessboard.clearAllPieces();
		chessboard.state.pieces = chessboard.state.pieces;
	};

	export const createPiece = (square: string, piece: ChessPiece): void => {
		chessboard.setPiece(square, piece);
		chessboard.state.pieces = chessboard.state.pieces;
	};

	export const changeColorOfPiece = (square: string, color?: Color.WHITE | Color.BLACK) => {
		const piece = chessboard.getPieceFromSquare(square)?.name;
		if (!piece) return;
		if (color !== undefined) chessboard.setPiece(square, `${color === Color.WHITE ? 'w' : 'b'}${piece[1]}` as ChessPiece);
		else chessboard.setPiece(square, `${piece[0] === 'w' ? 'b' : 'w'}${piece[1]}` as ChessPiece);
		chessboard.state.pieces = chessboard.state.pieces;
	};

	export const getSquareFromCoords = (x: number, y: number): string => {
		const coordX = Math.floor((x / chessboard.state.board.size) * 8);
		const coordY = Math.floor((y / chessboard.state.board.size) * 8);

		const adjX = chessboard.state.board.flipped ? Math.abs(coordX - 7) : coordX;
		const adjY = chessboard.state.board.flipped ? coordY : Math.abs(coordY - 7);

		const square = Object.keys(chessboard.letters)[adjX] + (adjY + 1).toString();
		return square;
	};

	const pieceIsMovable = (color: string) => {
		if (!chessboard.state.movable.enabled) return false;

		if (chessboard.state.legal.enabled) {
			if (
				chessboard.state.legal.preMoves.enabled &&
				((chessboard.state.movable.color === getColorFromString(color) &&
					chessboard.state.legal.whiteToMove === true &&
					getColorFromString(color) === Color.WHITE) ||
					(chessboard.state.legal.whiteToMove === false && getColorFromString(color) === Color.BLACK))
			)
				return true;

			if (
				!chessboard.state.legal.preMoves.enabled &&
				((chessboard.state.legal.whiteToMove === true && getColorFromString(color) === Color.WHITE) ||
					(chessboard.state.legal.whiteToMove === false && getColorFromString(color) === Color.BLACK))
			)
				return true;
		} else if (chessboard.state.movable.color === Color.BOTH || chessboard.state.movable.color === getColorFromString(color)) return true;

		return false;
	};

	const boardClick = (e: PointerEvent): void => {
		if (e.button === 2) {
			deselect();
			return;
		}
		const boundingRect = boardDiv.getBoundingClientRect();
		const x = e.clientX - boundingRect.left;
		const y = e.clientY - boundingRect.top;

		const square = getSquareFromCoords(x, y);
		const piece = chessboard.getPieceFromSquare(square);
		dispatch('squareClick', { square, piece: piece ? piece.name : undefined });

		if (!chessboard.state.selectable.enabled) {
			deselect();
			return;
		}

		if (
			chessboard.state.selectable.selectedPiece !== undefined &&
			chessboard.state.selectable.selectedPiece.square !== square &&
			!chessboard.state.legal.enabled
		) {
			makeMove(chessboard.state.selectable.selectedPiece.square + square);
			deselect();
			return;
		}

		if (
			chessboard.state.selectable.selectedPiece !== undefined &&
			chessboard.state.selectable.selectedPiece.square !== square &&
			(piece === undefined || piece.name[0] !== chessboard.state.selectable.selectedPiece.name[0])
		) {
			if (
				chessboard.isPromotion(chessboard.state.selectable.selectedPiece.square + square) &&
				chessboard.state.legal.moves.includes(`${chessboard.state.selectable.selectedPiece.square + square}q`)
			)
				makeMovePromotion(chessboard.state.selectable.selectedPiece.square + square);
			else if (chessboard.state.legal.moves.includes(chessboard.state.selectable.selectedPiece.square + square))
				makeMove(chessboard.state.selectable.selectedPiece.square + square);
			else if (
				chessboard.state.legal.preMoves.enabled &&
				chessboard.state.legal.preMoves.moves.includes(chessboard.state.selectable.selectedPiece.square + square)
			) {
				makeNextMove(chessboard.state.selectable.selectedPiece.square + square);
			}
			deselect();
			return;
		}

		if (
			chessboard.state.selectable.selectedPiece !== piece &&
			piece !== undefined &&
			chessboard.state.movable.enabled &&
			(chessboard.state.movable.color === Color.BOTH || chessboard.state.movable.color === getColorFromString(piece.name))
		) {
			if (allowDrawHighlightSquares('legal') && chessboard.state.legal.enabled && canMove()) {
				clearAllSquares(SquareColor.LEGAL);
				chessboard.state.legal.moves.forEach((move) => {
					if (move.substring(0, 2) === square) highlightSquare(move.substring(2, 4), SquareColor.LEGAL);
				});
			}

			if (
				allowDrawHighlightSquares('preMove') &&
				chessboard.state.legal.enabled &&
				chessboard.state.legal.preMoves.enabled &&
				chessboard.state.movable.color !== Color.BOTH &&
				!canMove()
			) {
				clearAllSquares(SquareColor.PREMOVE);
				chessboard.state.legal.preMoves.moves.forEach((move) => {
					if (move.substring(0, 2) === square) highlightSquare(move.substring(2, 4), SquareColor.PREMOVE);
				});
			}

			if ((chessboard.state.legal.enabled && pieceIsMovable(piece.name[0])) || !chessboard.state.legal.enabled) {
				selectPiece(piece.square);
			}
		}
	};

	const moveMadeFromPiece = (e: CustomEvent) => {
		const move = e.detail;

		if (chessboard.state.legal.enabled) {
			if (chessboard.isPromotion(move) && chessboard.state.legal.moves.includes(`${move}q`)) makeMovePromotion(move);
			else if (chessboard.state.legal.moves.includes(move)) makeMove(move);
			else if (chessboard.state.legal.preMoves.enabled && chessboard.state.legal.preMoves.moves.includes(move)) makeNextMove(move);
			else deselect();
		} else makeMove(move);

		clearAllSquares(SquareColor.LEGAL);
		clearAllSquares(SquareColor.PREMOVE);
		chessboard.state.markedSquares = chessboard.state.markedSquares;
	};

	export const setFEN = (fen: string, sound: MoveTypeSound | false = 'MOVE') => {
		chessboard.updatePiecesWithFen(fen);

		clearAllSquares();
		removeGhostPiece();

		updateLegalStateIfNeeded();

		if (chessboard.state.callbacks.getLastMove) {
			const lastMove = chessboard.state.callbacks.getLastMove();

			if (sound !== false) {
				if (sound !== 'MOVE') playMoveSound(sound);
				else if (chessboard.isCastling(lastMove)) playMoveSound('CASTLE');
				else playMoveSound(sound);
			}

			highlightMove(lastMove);
		} else if (sound !== false) playMoveSound(sound);

		chessboard.state.pieces = chessboard.state.pieces;
	};

	export const getShortFEN = () => chessboard.getShortFEN();

	export const setSize = (size: number) => {
		if (!size || chessboard.state.board.size === size) return;
		chessboard.state.board.size = size;
		if (browser && chessboard.state.board.resizible.enabled)
			document.documentElement.style.setProperty('--boardSize', `${chessboard.state.board.size}px`);
	};

	export const getPieceFromSquare = (square: string) => chessboard.getPieceFromSquare(square)?.name;

	export const setComputerArrows = (arrows: ArrowData[]) => {
		computerArrows = arrows;
	};

	export const removeComputerArrows = () => {
		computerArrows.length = 0;
	};

	export const updateLegalState = () => {
		updateLegalStateIfNeeded();
	};

	export const setMovableColor = (color: Color.WHITE | Color.BLACK | boolean) => {
		if (color === false) chessboard.state.movable.enabled = false;
		else {
			chessboard.state.movable.enabled = true;
			chessboard.state.movable.color = color === true ? Color.BOTH : color;
		}
	};

	export const setConfigSettings = (cfg?: ChessboardConfig | undefined) => {
		if (cfg === undefined) return;
		chessboard.setConfigSettings(cfg);
		chessboard.state = chessboard.state;
	};

	export const getState = () => chessboard.state;

	export const setState = (state: State) => {
		chessboard.state = state;

		clearAllSquares();
		updateLegalStateIfNeeded();

		if (chessboard.state.legal.enabled && chessboard.state.legal.lastMove !== '' && allowDrawHighlightSquares('move'))
			highlightMove(chessboard.state.legal.lastMove);
		if (
			chessboard.state.legal.enabled &&
			chessboard.state.legal.preMoves.enabled &&
			chessboard.state.legal.preMoves.curMove !== '' &&
			allowDrawHighlightSquares('nextMove')
		) {
			highlightMove(chessboard.state.legal.preMoves.curMove, SquareColor.NEXTMOVE);
		}
		if (chessboard.state.selectable.enabled && chessboard.state.selectable.selectedPiece !== undefined) {
			if (allowDrawHighlightSquares('select') && pieceIsMovable(chessboard.state.selectable.selectedPiece.name))
				highlightSquare(chessboard.state.selectable.selectedPiece.square, SquareColor.SELECT);
			if (chessboard.state.legal.enabled && chessboard.state.legal.moves.length > 0 && allowDrawHighlightSquares('legal'))
				chessboard.state.legal.moves.forEach((move) => {
					if (move.substring(0, 2) === chessboard.state.selectable.selectedPiece?.square)
						highlightSquare(move.substring(2, 4), SquareColor.LEGAL);
				});
			if (
				chessboard.state.legal.enabled &&
				chessboard.state.legal.preMoves.enabled &&
				chessboard.state.legal.preMoves.moves.length > 0 &&
				allowDrawHighlightSquares('preMove')
			)
				chessboard.state.legal.preMoves.moves.forEach((move) => {
					if (move.substring(0, 2) === chessboard.state.selectable.selectedPiece?.square)
						highlightSquare(move.substring(2, 4), SquareColor.PREMOVE);
				});
		}
	};

	export const getConfigFromState = (state: State) => state.getConfig();

	const handlePieceMoving = (e: CustomEvent) => {
		const bounding = boardDiv.getBoundingClientRect();
		if (chessboard.state.legal.enabled) {
			if (canMove()) chessboard.legalHover(getSquareFromCoords(e.detail.x - bounding.x, e.detail.y - bounding.y));
			if (!canMove() && chessboard.state.legal.preMoves.enabled)
				chessboard.preMoveHover(getSquareFromCoords(e.detail.x - bounding.x, e.detail.y - bounding.y));
		}
		chessboard.state.markedSquares = chessboard.state.markedSquares;
	};

	const startDragging = (piece: StatePiece) => {
		if (chessboard.state.draggable.ghostPiece) setGhostPiece(piece);
		clearAllSquares(SquareColor.SELECT);

		if (chessboard.state.selectable.selectedPiece === undefined) {
			if (allowDrawHighlightSquares('legal') && chessboard.state.legal.enabled)
				chessboard.state.legal.moves.forEach((move) => {
					if (move.substring(0, 2) === piece.square) highlightSquare(move.substring(2, 4), SquareColor.LEGAL);
				});
			if (allowDrawHighlightSquares('preMove') && chessboard.state.legal.preMoves.enabled)
				chessboard.state.legal.preMoves.moves.forEach((move) => {
					if (move.substring(0, 2) === piece.square) highlightSquare(move.substring(2, 4), SquareColor.PREMOVE);
				});
		}
	};

	const handlePromotion = (e: CustomEvent) => {
		const piece = chessboard.getPieceFromSquare(promotionLastMove.substring(2, 4));
		if (!piece) return;

		const newPiece = (piece.name[0] + e.detail.toUpperCase()) as ChessPiece;
		const newMove = promotionLastMove + e.detail;

		if (chessboard.state.callbacks.beforeMove) chessboard.state.callbacks.beforeMove(newMove);

		chessboard.setPiece(piece.square, newPiece);
		chessboard.state.pieces = chessboard.state.pieces;
		playMoveSound('MOVE');

		if (chessboard.state.callbacks.afterMove) chessboard.state.callbacks.afterMove(newMove);
		updateLegalStateIfNeeded();
	};

	// const handleEndDragging = (e: CustomEvent) => {
	// 	dispatch('endDragging');
	// 	const move = <string>e.detail;
	// 	if (move.substring(0, 2) === move.substring(2, 4) && chessboard.state.selectable.selectedPiece === undefined)
	// 		selectPiece(move.substring(0, 2));
	// 	else deselect();
	// };

	$: setSize(chessboard.state.board.size - (chessboard.state.board.size % 8));

	onMount(() => {
		updateLegalStateIfNeeded();
		if (chessboard.state.callbacks.getLastMove) highlightMove(chessboard.state.callbacks.getLastMove());
		if (chessboard.state.board.resizible) setSize(chessboard.state.board.size - (chessboard.state.board.size % 8));
	});
</script>

<div
	on:pointerdown={boardClick}
	on:contextmenu|preventDefault
	on:drag|preventDefault
	use:drawArrows={{
		svg: arrowsSvg,
		flipped: chessboard.state.board.flipped,
		enabled: chessboard.state.drawTools.enabled,
		settings: chessboard.state.drawTools.settings
	}}
	on:drawCircle={(e) => dispatch('drawCircle', { square: e.detail.square, color: e.detail.color })}
	on:drawArrow={(e) => dispatch('drawArrow', { move: e.detail.move, color: e.detail.color })}
	bind:this={boardDiv}
	bind:clientWidth={chessboard.state.board.size}
	class="noselect board {chessboard.state.board.style.shadow ? 'shadow' : ''} text-sm {className}"
	style="
	--boardTheme: url({chessboard.state.board.boardTheme === 'standard' ? standardBoard : darkBlueBoard});
	{chessboard.state.board.style.borderRadius !== '0rem' && chessboard.state.board.style.borderRadius !== '0px'
		? `border-radius: ${chessboard.state.board.style.borderRadius};`
		: ''}"
>
	<div style="width: 100%; height: 100%" class="noselect">
		{#if chessboard.state.board.startFen}
			{#each chessboard.state.pieces as piece (piece)}
				<Piece
					square={piece.square}
					name={piece.name}
					legalState={chessboard.state.legal}
					draggableState={chessboard.state.draggable}
					selectedPiece={chessboard.state.selectable.selectedPiece}
					movableState={chessboard.state.movable}
					getGridCoordsFromSquare={chessboard.getGridCoordsFromSquare}
					flipped={chessboard.state.board.flipped}
					on:move={moveMadeFromPiece}
					on:clicked={() => {
						dispatch('piececlick', { piece });
					}}
					on:startMoving={() => {
						dispatch('startDragging', { piece });
						startDragging(piece);
					}}
					on:moving={handlePieceMoving}
					on:endDragging
					on:select={() => selectPiece(piece.square)}
					on:deselect={() => deselect()}
				/>
			{/each}
		{/if}
	</div>
	{#if chessboard.state.draggable.ghostPiece.enabled && chessboard.state.draggable.ghostPiece.piece !== undefined}
		<Piece
			isGhost={true}
			square={chessboard.state.draggable.ghostPiece.piece.square}
			name={chessboard.state.draggable.ghostPiece.piece.name}
			getGridCoordsFromSquare={chessboard.getGridCoordsFromSquare}
			flipped={chessboard.state.board.flipped}
		/>
	{/if}
	{#if allowDrawHighlightSquares()}
		{#each [...chessboard.state.markedSquares] as square (square)}
			<Square
				on:dragenter={(e) => {
					highlightSquare(e.detail.square, SquareColor.LEGALHOVER);
				}}
				theme={chessboard.state.board.boardTheme}
				square={square.square}
				color={square.color}
				getGridCoordsFromSquare={chessboard.getGridCoordsFromSquare}
				flipped={chessboard.state.board.flipped}
			/>
		{/each}
	{/if}
	{#if chessboard.state.board.notation}
		<Notation theme={chessboard.state.board.boardTheme} flipped={chessboard.state.board.flipped} />
	{/if}
	{#if chessboard.state.board.resizible.enabled}
		<Resizing {chessboard} {setSize} />
	{/if}
	{#if chessboard.state.drawTools.enabled}
		<Arrows
			flipped={chessboard.state.board.flipped}
			bind:svg={arrowsSvg}
			{computerArrows}
			knightLShape={chessboard.state.drawTools.settings.knightLShape}
		/>
	{/if}
	{#if chessboard.state.legal.enabled}
		<PromotionModal bind:this={promotionModal} on:newPromotion={handlePromotion} />
	{/if}
</div>

{#if chessboard.state.sounds.enabled}
	<Sounds bind:this={sounds} settings={chessboard.state.sounds.settings} />
{/if}

<style>
	@import './boardThemes/themes.css';
	.board {
		position: relative;
		aspect-ratio: 1;
		width: 100%;
		max-width: 100%;
		max-height: 100%;
		background-image: var(--boardTheme);
		font-size: 0.75rem;
		line-height: 1rem;
	}

	.shadow {
		box-shadow: 0 0 #0000, 0 0 #0000, 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
	}

	@media (min-width: 640px) {
		.text-sm {
			font-size: 0.875rem;
			line-height: 1.25rem;
		}
	}
</style>

<script context="module" lang="ts">
	import type { ChessboardConfig as Config, KingLocations, MoveTypeSound } from './boardConfig';
	export type ChessboardConfig = Config;
</script>

<script lang="ts">
	import Chessboard from './chessboard';
	import type { piece } from './state';
	import Notation from './Notation.svelte';
	import Piece from './Piece.svelte';
	import Square from './Square.svelte';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import drawArrows, { type ArrowData } from './drawArrows';
	import Arrows from './Arrows.svelte';
	import { browser } from '$app/environment';
	import { tick } from 'svelte';
	import PromotionModal from './PromotionModal.svelte';
	import Sounds from './Sounds.svelte';
	import standardBoard from './assets/boards/standard.svg';
	import darkBlueBoard from './assets/boards/darkBlue.svg';
	import Resizing from './Resizing.svelte';
	import type { ChessPiece } from './chessTypes';
	import { Color, SquareColor } from './enums';

	export let config: ChessboardConfig | undefined = undefined;

	const chessboard = new Chessboard(config);
	const dispatch = createEventDispatcher();

	let boardDiv: HTMLDivElement;
	let arrowsSvg: SVGGElement;
	let sounds: Sounds;

	let promotionModal: PromotionModal;
	let promotionLastMove = '';

	$: setSize(chessboard.state.board.size - (chessboard.state.board.size % 8));
	$: setConfigSettings(config);

	$: onMount(() => {
		updateLegalStateIfNeeded();
		if (chessboard.state.callbacks.getLastMove) highlightMove(chessboard.state.callbacks.getLastMove());
		if (chessboard.state.resizible) setSize(chessboard.state.board.size - (chessboard.state.board.size % 8));
	});

	onDestroy(() => {
		if (browser && document.documentElement.hasAttribute('style') && chessboard.state.resizible.enabled)
			document.documentElement.removeAttribute('style');
	});

	let computerArrows: ArrowData[] = [];
	let kingLocations: KingLocations = { [Color.WHITE]: '', [Color.BLACK]: '' };

	const setCheckSquare = (clr: Color.WHITE | Color.BLACK | undefined) => {
		clearAllSquares(SquareColor.CHECK);
		if (clr !== undefined && allowDrawHighlightSquares('check')) highlightSquare(kingLocations[clr], SquareColor.CHECK);
		chessboard.state.markedSquares = chessboard.state.markedSquares;
	};

	export const flipBoard = (flipped?: boolean) => {
		chessboard.flipBoard(flipped);
		chessboard.state.board.flipped = chessboard.state.board.flipped;
	};

	export const highlightSquare = (square: string, mode: SquareColor): void => {
		chessboard.highlightSquare(square, mode);
		chessboard.state.markedSquares = chessboard.state.markedSquares;
	};

	export const highlightManySquares = (square: string[], mode: SquareColor): void => {
		square.forEach((square) => chessboard.highlightSquare(square, mode));
		chessboard.state.markedSquares = chessboard.state.markedSquares;
	};

	export const highlightMove = (move: string, color: SquareColor = SquareColor.MOVE) => {
		if (move.length < 4) return;
		highlightManySquares([move.substring(0, 2), move.substring(2, 4)], color);
	};

	export const highlightManyMoves = (moves: string[], color: SquareColor = SquareColor.MOVE) => {
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

	export const highlightLegalMoves = (legalMoves: string[]) => {
		clearAllSquares(SquareColor.LEGAL);
		highlightManyMoves(legalMoves, SquareColor.LEGAL);
	};

	export const makeMove = (move: string): void => {
		if (move.substring(0, 2) === move.substring(2, 4)) return;
		if (chessboard.state.callbacks.beforeMove) chessboard.state.callbacks.beforeMove(move);

		clearAllSquares(SquareColor.LEGAL);
		clearAllSquares(SquareColor.SELECT);

		let rookMove = chessboard.getRookMoveIfIsCastling(move);
		let capturedPawnSquare = chessboard.getCapturedPawnSquareIfIsEnPassant(move);

		if (rookMove && chessboard.state.legal.enabled && chessboard.state.legal.settings.allowCastling) {
			movePiece(rookMove, false);
			sounds.playMoveSound('CASTLE');
		} else if (capturedPawnSquare && chessboard.state.legal.enabled && chessboard.state.legal.settings.allowEnPassant) {
			removePiece(capturedPawnSquare);
			sounds.playMoveSound('CAPTURE');
		} else if (chessboard.isCapture(move)) {
			sounds.playMoveSound('CAPTURE');
		} else sounds.playMoveSound('MOVE');

		chessboard.removeGhostPiece();
		chessboard.state.draggable.ghostPiece.piece = chessboard.state.draggable.ghostPiece.piece;
		movePiece(move);

		if (chessboard.state.callbacks.afterMove) chessboard.state.callbacks.afterMove(move);
		updateLegalStateIfNeeded();

		if (chessboard.state.legal.enabled && chessboard.state.legal.preMoves.enabled && chessboard.state.legal.preMoves.curMove !== '') {
			if (
				chessboard.state.legal.moves.includes(chessboard.state.legal.preMoves.curMove) ||
				chessboard.state.legal.moves.includes(chessboard.state.legal.preMoves.curMove + 'q')
			) {
				let tmp = chessboard.state.legal.preMoves.curMove;
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

	export const movePiece = (move: string, highlight: boolean = true) => {
		chessboard.makeMove(move);
		if (highlight) {
			clearAllSquares(SquareColor.MOVE);
			if (allowDrawHighlightSquares('move')) highlightMove(move);
		}
		chessboard.state.pieces = chessboard.state.pieces;
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

	export const clearAllSquares = (mode?: SquareColor) => {
		chessboard.clearAllSquares(mode);
		if (mode === SquareColor.LEGAL) chessboard.clearAllSquares(SquareColor.LEGALHOVER);
		if (mode === SquareColor.PREMOVE) chessboard.clearAllSquares(SquareColor.PREMOVEHOVER);
		chessboard.state.markedSquares = chessboard.state.markedSquares;
	};

	export const removePiece = (square: string): void => {
		chessboard.removePiece(square);
		chessboard.state.pieces = chessboard.state.pieces;
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
		let piece = chessboard.getPieceFromSquare(square)?.name;
		if (!piece) return;
		if (color !== undefined) chessboard.setPiece(square, `${color === Color.WHITE ? 'w' : 'b'}${piece[1]}` as ChessPiece);
		else chessboard.setPiece(square, `${piece[0] === 'w' ? 'b' : 'w'}${piece[1]}` as ChessPiece);
		chessboard.state.pieces = chessboard.state.pieces;
	};

	const getColorFromString = (name: string) => {
		return name[0] === 'w' ? Color.WHITE : Color.BLACK;
	};

	const boardClick = (e: PointerEvent): void => {
		if (e.button === 2) {
			clearAllSquares();
			chessboard.state.selectable.selectedPiece = undefined;
			return;
		}
		const boundingRect = boardDiv.getBoundingClientRect();
		const x = e.clientX - boundingRect.left;
		const y = e.clientY - boundingRect.top;

		const square = getSquareFromCoords(x, y);
		const piece = chessboard.getPieceFromSquare(square);
		dispatch('squareClick', { square, piece: piece ? piece.name : undefined });

		if (!chessboard.state.legal.enabled || !chessboard.state.selectable.enabled) {
			chessboard.state.selectable.selectedPiece = undefined;
			return;
		}

		if (
			chessboard.state.selectable.selectedPiece !== undefined &&
			chessboard.state.selectable.selectedPiece.square !== square &&
			!chessboard.state.legal.enabled
		) {
			makeMove(chessboard.state.selectable.selectedPiece.square + square);
			chessboard.state.selectable.selectedPiece = undefined;
			return;
		}

		if (
			chessboard.state.selectable.selectedPiece !== undefined &&
			chessboard.state.selectable.selectedPiece.square !== square &&
			(piece === undefined || piece.name[0] !== chessboard.state.selectable.selectedPiece.name[0])
		) {
			if (
				chessboard.isPromotion(chessboard.state.selectable.selectedPiece.square + square) &&
				chessboard.state.legal.moves.includes(chessboard.state.selectable.selectedPiece.square + square + 'q')
			)
				makeMovePromotion(chessboard.state.selectable.selectedPiece.square + square);
			else if (chessboard.state.legal.moves.includes(chessboard.state.selectable.selectedPiece.square + square))
				makeMove(chessboard.state.selectable.selectedPiece.square + square);
			else if (
				chessboard.state.legal.preMoves.enabled &&
				chessboard.state.legal.preMoves.moves.includes(chessboard.state.selectable.selectedPiece.square + square)
			) {
				makeNextMove(chessboard.state.selectable.selectedPiece.square + square);
			} else {
				clearAllSquares(SquareColor.LEGAL);
				clearAllSquares(SquareColor.PREMOVE);
				clearAllSquares(SquareColor.SELECT);
			}
			chessboard.state.selectable.selectedPiece = undefined;
			return;
		}

		if (
			chessboard.state.selectable.selectedPiece !== piece &&
			piece !== undefined &&
			chessboard.state.movable.enabled &&
			(chessboard.state.movable.color === Color.BOTH || chessboard.state.movable.color === getColorFromString(piece.name))
		) {
			if (allowDrawHighlightSquares('legal') && chessboard.state.legal && canMove()) {
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
				if (chessboard.state.highlight.enabled && chessboard.state.highlight.settings.preMove)
					chessboard.state.legal.preMoves.moves.forEach((move) => {
						if (move.substring(0, 2) === square) highlightSquare(move.substring(2, 4), SquareColor.PREMOVE);
					});
			}
			if (
				allowDrawHighlightSquares('select') &&
				((chessboard.state.legal.enabled && allowDragPiece(piece.name[0])) || !chessboard.state.legal.enabled)
			) {
				clearAllSquares(SquareColor.SELECT);
				highlightSquare(square, SquareColor.SELECT);
			}
			if ((chessboard.state.legal.enabled && allowDragPiece(piece.name[0])) || !chessboard.state.legal.enabled)
				chessboard.state.selectable.selectedPiece = piece;
			return;
		}

		if (chessboard.state.selectable.selectedPiece !== undefined && chessboard.state.selectable.selectedPiece === piece) {
			clearAllSquares(SquareColor.LEGAL);
			clearAllSquares(SquareColor.PREMOVE);
			clearAllSquares(SquareColor.SELECT);
			chessboard.state.selectable.selectedPiece = undefined;
			return;
		}
	};

	const moveMadeFromPiece = (e: CustomEvent) => {
		const move = e.detail;
		if (move.substring(0, 2) === move.substring(2, 4)) {
			highlightSquare(move.substring(0, 2), SquareColor.SELECT);
			chessboard.state.markedSquares = chessboard.state.markedSquares;
			return;
		}

		if (chessboard.state.legal.enabled) {
			if (chessboard.isPromotion(move) && chessboard.state.legal.moves.includes(move + 'q')) makeMovePromotion(move);
			else if (chessboard.state.legal.moves.includes(move)) makeMove(move);
			else if (chessboard.state.legal.preMoves.enabled && chessboard.state.legal.preMoves.moves.includes(move)) makeNextMove(move);
		} else makeMove(move);

		clearAllSquares(SquareColor.LEGAL);
		clearAllSquares(SquareColor.PREMOVE);
		chessboard.state.markedSquares = chessboard.state.markedSquares;
	};

	export const setFEN = (fen: string, sound: MoveTypeSound = 'MOVE') => {
		chessboard.updatePiecesWithFen(fen);

		clearAllSquares();
		chessboard.removeGhostPiece();

		updateLegalStateIfNeeded();
		if (chessboard.state.callbacks.getLastMove) {
			let lastMove = chessboard.state.callbacks.getLastMove();

			if (sound !== 'MOVE') sounds.playMoveSound(sound);
			else if (chessboard.isCastling(lastMove)) sounds.playMoveSound('CASTLE');
			else sounds.playMoveSound(sound);

			highlightMove(lastMove);
		} else sounds.playMoveSound(sound);

		chessboard.state.draggable.ghostPiece.piece = chessboard.state.draggable.ghostPiece.piece;
		chessboard.state.pieces = chessboard.state.pieces;
	};

	export const getShortFEN = () => {
		return chessboard.getShortFEN();
	};

	export const setSize = (size: number) => {
		if (!size || chessboard.state.board.size === size) return;
		chessboard.state.board.size = size;
		if (browser && chessboard.state.resizible.enabled)
			document.documentElement.style.setProperty('--boardSize', `${chessboard.state.board.size}px`);
	};

	export const getSquareFromCoords = (x: number, y: number): string => {
		const coordX = Math.floor((x / chessboard.state.board.size) * 8);
		const coordY = Math.floor((y / chessboard.state.board.size) * 8);

		const adjX = chessboard.state.board.flipped ? Math.abs(coordX - 7) : coordX;
		const adjY = chessboard.state.board.flipped ? coordY : Math.abs(coordY - 7);

		const square = Object.keys(chessboard.letters)[adjX] + (adjY + 1).toString();
		return square;
	};

	export const getPieceFromSquare = (square: string) => {
		return chessboard.getPieceFromSquare(square)?.name;
	};

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

	const updateLegalStateIfNeeded = () => {
		if (!chessboard.state.legal.enabled) return;

		if (chessboard.state.callbacks.getWhiteToMove) chessboard.state.legal.whiteToMove = chessboard.state.callbacks.getWhiteToMove();

		if (chessboard.state.callbacks.getPreMoves && !canMove() && chessboard.state.legal.preMoves.enabled)
			chessboard.state.legal.preMoves.moves = chessboard.state.callbacks.getPreMoves();
		else chessboard.state.legal.preMoves.moves.length = 0;
		if (chessboard.state.callbacks.getLegalMoves && canMove()) chessboard.state.legal.moves = chessboard.state.callbacks.getLegalMoves();
		else chessboard.state.legal.moves.length = 0;

		//change preMoves to legalMoves
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

	const handlePieceMoving = (e: CustomEvent) => {
		let bounding = boardDiv.getBoundingClientRect();
		if (chessboard.state.legal.enabled) {
			if (canMove()) chessboard.legalHover(getSquareFromCoords(e.detail.x - bounding.x, e.detail.y - bounding.y));
			if (!canMove() && chessboard.state.legal.preMoves.enabled)
				chessboard.preMoveHover(getSquareFromCoords(e.detail.x - bounding.x, e.detail.y - bounding.y));
		}
		chessboard.state.markedSquares = chessboard.state.markedSquares;
	};

	const handlePromotion = (e: CustomEvent): void => {
		const piece = chessboard.getPieceFromSquare(promotionLastMove.substring(2, 4));
		if (!piece) return;

		const newPiece = (piece.name[0] + (<string>e.detail).toUpperCase()) as ChessPiece;
		const newMove = promotionLastMove + <string>e.detail;

		if (chessboard.state.callbacks.beforeMove) chessboard.state.callbacks.beforeMove(newMove);

		chessboard.setPiece(piece.square, newPiece);
		chessboard.state.pieces = chessboard.state.pieces;
		sounds.playMoveSound('MOVE');

		if (chessboard.state.callbacks.afterMove) chessboard.state.callbacks.afterMove(newMove);
		updateLegalStateIfNeeded();
	};

	const setGhostPiece = (piece: piece) => {
		chessboard.setGhostPiece(piece);
		chessboard.state.draggable.ghostPiece.piece = chessboard.state.draggable.ghostPiece.piece;
	};

	const removeGhostPiece = () => {
		chessboard.removeGhostPiece();
		chessboard.state.draggable.ghostPiece.piece = chessboard.state.draggable.ghostPiece.piece;
	};

	const startDragging = (piece: piece) => {
		if (chessboard.state.draggable.ghostPiece) setGhostPiece(piece);
		clearAllSquares(SquareColor.SELECT);

		if (chessboard.state.selectable.selectedPiece === undefined) {
			if (allowDrawHighlightSquares('legal'))
				chessboard.state.legal.moves.forEach((move) => {
					if (move.substring(0, 2) === piece.square) highlightSquare(move.substring(2, 4), SquareColor.LEGAL);
				});
		}
	};

	const allowDrawHighlightSquares = (color?: 'legal' | 'move' | 'select' | 'check' | 'preMove') =>
		chessboard.state.highlight.enabled && (color === undefined || chessboard.state.highlight.settings[color]);

	const allowDragPiece = (color: string) => {
		if (!chessboard.state.movable.enabled) return false;

		if (
			chessboard.state.legal.enabled &&
			chessboard.state.legal.preMoves.enabled &&
			(chessboard.state.movable.color === Color.BOTH || chessboard.state.movable.color === getColorFromString(color))
		)
			return true;

		if (chessboard.state.movable.color === Color.BOTH || chessboard.state.movable.color === getColorFromString(color)) return true;

		return false;
	};

	const canMove = () =>
		chessboard.state.movable.enabled &&
		(chessboard.state.movable.color === Color.BOTH ||
			(chessboard.state.legal.whiteToMove && chessboard.state.movable.color === getColorFromString('w')) ||
			(!chessboard.state.legal.whiteToMove && chessboard.state.movable.color === getColorFromString('b')));
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
	class="noselect lg:rounded board text-xs{chessboard.state.board.shadow ? ' shadow-lg' : ''} sm:text-sm"
	style="--boardTheme: url({chessboard.state.board.boardTheme === 'standard' ? standardBoard : darkBlueBoard});"
>
	<div class="noselect h-full w-full">
		{#if chessboard.state.board.startFen}
			{#each chessboard.state.pieces as piece (piece)}
				<Piece
					square={piece.square}
					name={piece.name}
					easing={chessboard.state.draggable.transition.settings.easing}
					whiteToMove={chessboard.state.legal.whiteToMove}
					movable={chessboard.state.movable}
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
					on:endDragging={() => {
						dispatch('endDragging');
						chessboard.state.selectable.selectedPiece = undefined;
					}}
					on:animationEnded={removeGhostPiece}
				/>
			{/each}
		{/if}
	</div>
	{#if chessboard.state.draggable.ghostPiece.enabled && chessboard.state.draggable.ghostPiece.piece !== undefined}
		<Piece
			ghostPiece={true}
			duration={0}
			square={chessboard.state.draggable.ghostPiece.piece.square}
			name={chessboard.state.draggable.ghostPiece.piece.name}
			movable={false}
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
	{#if chessboard.state.resizible.enabled}
		<Resizing {chessboard} {setSize} />
	{/if}
	{#if chessboard.state.drawTools.enabled}
		<Arrows
			flipped={chessboard.state.board.flipped}
			bind:svg={arrowsSvg}
			{computerArrows}
			LshapeKnightMove={chessboard.state.drawTools.settings.LshapeKnightMove}
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
	}
</style>
<script lang="ts">
	import { createEventDispatcher, onMount, tick } from 'svelte';
	import type { ChessboardConfig, MoveTypeSound } from './boardConfig.js';
	import Chessboard from './chessboard.js';
	import Notation from './Notation.svelte';
	import Piece from './Piece.svelte';
	import Square from './Square.svelte';
	import drawArrows, { type ArrowTool, type CircleTool } from './drawArrows.js';
	import Arrows from './Arrows.svelte';
	import PromotionModal from './PromotionModal.svelte';
	import Sounds from './Sounds.svelte';
	import standardBoard from './assets/boards/standard.svg';
	import darkBlueBoard from './assets/boards/darkBlue.svg';
	import Resizing from './Resizing.svelte';
	import type { ChessFile, ChessPiece, ChessRank, ChessSquare } from './chessTypes.js';
	import type { State, Piece as StatePiece } from './state/index.js';
	import { squareColorToString, type SquareType } from './enums.js';
	import { fitSize } from './fitSize.js';

	export let config: ChessboardConfig;
	let className: string | undefined | null = undefined;
	export { className as class };

	const chessboard = new Chessboard(config);
	const dispatch = createEventDispatcher();

	let boardDiv: HTMLDivElement;
	let arrowsSvg: SVGGElement;
	let sounds: Sounds;

	let promotionModal: PromotionModal;
	let promotionLastMove = '';
	let promotionIsCapture = false;

	let mounted = false;

	export const clearAllSquares = (mode?: SquareType) => {
		chessboard.clearAllSquares(mode);
		if (mode === 'LEGAL') chessboard.clearAllSquares('LEGALHOVER');
		if (mode === 'PREMOVE') chessboard.clearAllSquares('PREMOVEHOVER');
		chessboard.state.markedSquares = chessboard.state.markedSquares;
	};

	export const highlightSquare = (square: ChessSquare, mode: SquareType): void => {
		if (!allowDrawHighlightSquares(mode)) return;
		chessboard.highlightSquare(square, mode);
		chessboard.state.markedSquares = chessboard.state.markedSquares;
	};

	const allowDrawHighlightSquares = (color?: SquareType) =>
		chessboard.highlightEnabled &&
		(color === undefined || chessboard.highlightSettings[squareColorToString(color)]);

	export const selectPiece = (square: ChessSquare) => {
		if (!chessboard.selectableEnabled && chessboard.draggableEnabled)
			updateSelectedPieceHighlight(square);
		if (!chessboard.selectableEnabled) return;
		deselect(true);

		const piece = chessboard.getPieceFromSquare(square);
		if (piece === undefined) return;

		chessboard.selectedPiece = piece;
		updateSelectedPieceHighlight();
	};

	export const deselect = (removeNextMove = true) => {
		clearAllSquares('SELECT');
		clearAllSquares('LEGAL');
		clearAllSquares('PREMOVE');
		chessboard.selectedPiece = undefined;
		if (removeNextMove) {
			clearAllSquares('NEXTMOVE');
			chessboard.currentPreMove = '';
		}
	};

	export const setCheckSquare = (square: ChessSquare | undefined) => {
		clearAllSquares('CHECK');
		if (square && chessboard.legalEnabled) highlightSquare(square, 'CHECK');
		chessboard.state.markedSquares = chessboard.state.markedSquares;
	};

	export const removeCheckSquare = () => {
		clearAllSquares('CHECK');
	};

	export const flipBoard = (flipped?: boolean) => {
		chessboard.flipBoard(flipped);
		chessboard.flipped = chessboard.flipped;
	};

	export const highlightManySquares = (squares: ChessSquare[], mode: SquareType): void => {
		squares.forEach((square) => chessboard.highlightSquare(square, mode));
		chessboard.state.markedSquares = chessboard.state.markedSquares;
	};

	export const highlightMove = (
		move: string | undefined,
		clear = true,
		color: SquareType = 'MOVE'
	) => {
		if (move === undefined) return;
		if (move.length < 4 || !allowDrawHighlightSquares(color)) return;
		if (clear) clearAllSquares(color);
		highlightManySquares(
			[<ChessSquare>move.substring(0, 2), <ChessSquare>move.substring(2, 4)],
			color
		);
	};

	export const highlightLegalMove = (legalMove: string) => {
		highlightSquare(<ChessSquare>legalMove.substring(2, 4), 'LEGAL');
	};

	export const highlightLegalMoves = (
		legalMoves: string[],
		from?: ChessSquare,
		mode: 'LEGAL' | 'PREMOVE' = 'LEGAL'
	) => {
		clearAllSquares(mode);
		if (!allowDrawHighlightSquares(mode)) return;

		legalMoves.forEach((move) => {
			if (move.length < 4) return;
			if (from === undefined || move.substring(0, 2) === from)
				chessboard.highlightSquare(<ChessSquare>move.substring(2, 4), mode);
		});

		chessboard.state.markedSquares = chessboard.state.markedSquares;
	};

	export const movePiece = (move: string, highlight = true) => {
		chessboard.makeMove(move);
		if (highlight) highlightMove(move);
		chessboard.state.pieces = chessboard.state.pieces;
	};

	export const removePiece = (square: ChessSquare | undefined): void => {
		if (!square) return;
		chessboard.removePiece(square);
		if (chessboard.ghostPieceEnabled && chessboard.ghostPiece?.square === square) {
			chessboard.removeGhostPiece();
			chessboard.ghostPiece = chessboard.ghostPiece;
		}
		chessboard.state.pieces = chessboard.state.pieces;
	};

	const canMove = (pieceName: string) =>
		(chessboard.whiteToMove && pieceName[0] === 'w') ||
		(!chessboard.whiteToMove && pieceName[0] === 'b');

	export const updateLegalState = (updateSelect = false) => {
		if (!chessboard.legalEnabled) return;

		chessboard.whiteToMove =
			chessboard.state.callbacks.getWhiteToMove?.() ?? chessboard.whiteToMove;

		if (chessboard.preMovesEnabled)
			chessboard.preMoves = chessboard.state.callbacks.getPreMoves?.() ?? [];

		if (chessboard.legalEnabled)
			chessboard.legalMoves = chessboard.state.callbacks.getLegalMoves?.() ?? [];

		// change preMoves to legalMoves
		if (updateSelect) updateSelectedPieceHighlight();

		if (chessboard.state.callbacks.getInCheck?.()) {
			if (chessboard.whiteToMove) setCheckSquare(chessboard.getWhiteKingSquare());
			else setCheckSquare(chessboard.getBlackKingSquare());
		} else removeCheckSquare();

		if (chessboard.state.callbacks.getLastMove) {
			chessboard.lastMove = chessboard.state.callbacks.getLastMove();
			highlightMove(chessboard.lastMove);
		} else clearAllSquares('MOVE');
	};

	export const playMoveSound = (moveType: MoveTypeSound) => {
		if (chessboard.soundsEnabled && sounds) sounds.playMoveSound?.(moveType);
	};

	const setGhostPiece = (piece: StatePiece) => {
		chessboard.setGhostPiece(piece);
		chessboard.ghostPiece = chessboard.ghostPiece;
	};

	const removeGhostPiece = () => {
		chessboard.removeGhostPiece();
		chessboard.ghostPiece = chessboard.ghostPiece;
	};

	export const makeMove = (move: string): void => {
		if (move.substring(0, 2) === move.substring(2, 4)) return;
		chessboard.state.callbacks.beforeMove?.(move);
		const prevSelectedPiece = chessboard.selectedPiece
			? { ...chessboard.selectedPiece }
			: undefined;
		deselect(false);

		const rookMove = chessboard.getRookMoveIfIsCastling(move);
		const capturedPawnSquare = chessboard.getCapturedPawnSquareIfIsEnPassant(move);

		if (rookMove && chessboard.state.legal.settings.allowCastling) {
			movePiece(rookMove, false);
			playMoveSound('CASTLE');
		} else if (capturedPawnSquare && chessboard.state.legal.settings.allowEnPassant) {
			removePiece(capturedPawnSquare);
			playMoveSound('CAPTURE');
		} else if (chessboard.isCapture(move)) {
			playMoveSound('CAPTURE');
		} else playMoveSound('MOVE');

		removeGhostPiece();
		movePiece(move);

		chessboard.state.callbacks.afterMove?.(move);

		updateLegalState(false);

		const curSelectedPiece = chessboard.getPieceFromSquare(prevSelectedPiece?.square);
		if (
			curSelectedPiece &&
			prevSelectedPiece &&
			curSelectedPiece.square === prevSelectedPiece.square &&
			curSelectedPiece.name === prevSelectedPiece?.name
		)
			chessboard.selectedPiece = curSelectedPiece;
		else chessboard.selectedPiece = undefined;
		if (chessboard.selectedPiece !== undefined) updateSelectedPieceHighlight();

		if (chessboard.legalEnabled && chessboard.preMovesEnabled && chessboard.currentPreMove !== '') {
			if (chessboard.legalMoves.includes(chessboard.currentPreMove)) {
				const nextMove = chessboard.currentPreMove;
				tick().then(() => {
					makeMove(nextMove);
				});
			}
			chessboard.currentPreMove = '';
			clearAllSquares('NEXTMOVE');
		}
	};

	export const makeNextMove = (move: string): void => {
		if (!chessboard.legalEnabled || !chessboard.preMovesEnabled || !chessboard.movableEnabled)
			return;

		deselect(false);
		highlightMove(move, true, 'NEXTMOVE');
		chessboard.currentPreMove = move;
		dispatch('nextMove', { move });
	};

	export const makeMovePromotion = (move: string): void => {
		const piece = chessboard.getPieceFromSquare(<ChessSquare>move.substring(0, 2));
		if (!piece) return;
		const color = piece.name[0] === 'w' ? 'WHITE' : 'BLACK';
		promotionModal.openPromotionModal?.(color === 'WHITE');
		promotionLastMove = move;
		promotionIsCapture = chessboard.isCapture(move);
		chessboard.makeMove(move);
		clearAllSquares('LEGAL');
		clearAllSquares('SELECT');
		highlightMove(move);
	};

	export const removeSquareHighlight = (square: ChessSquare, mode?: SquareType): void => {
		chessboard.clearSquare(square, mode);
		chessboard.state.markedSquares = chessboard.state.markedSquares;
	};

	export const removeAllPiece = (): void => {
		chessboard.clearAllPieces();
		chessboard.state.pieces = chessboard.state.pieces;
	};

	export const createPiece = (square: ChessSquare, piece: ChessPiece): void => {
		chessboard.setPiece(square, piece);
		chessboard.state.pieces = chessboard.state.pieces;
	};

	export const changeColorOfPiece = (square: ChessSquare, color?: 'WHITE' | 'BLACK') => {
		const piece = chessboard.getPieceFromSquare(square)?.name;
		if (!piece) return;
		if (color !== undefined)
			chessboard.setPiece(square, `${color === 'WHITE' ? 'w' : 'b'}${piece[1]}` as ChessPiece);
		else chessboard.setPiece(square, `${piece[0] === 'w' ? 'b' : 'w'}${piece[1]}` as ChessPiece);
		chessboard.state.pieces = chessboard.state.pieces;
	};

	export const getSquareFromCoords = (x: number, y: number): ChessSquare | undefined => {
		const coordX = Math.floor((x / chessboard.state.board.size) * 8);
		const coordY = Math.floor((y / chessboard.state.board.size) * 8);

		const adjX = chessboard.flipped ? 7 - coordX : coordX;
		const adjY = chessboard.flipped ? coordY : 7 - coordY;

		if (adjX < 0 || adjX > 7 || adjY < 0 || adjY > 7) return undefined;

		const file = Object.keys(chessboard.letters)[adjX];
		const rank = (adjY + 1).toString();

		return `${<ChessFile>file}${<ChessRank>rank}`;
	};

	const boardClick = (e: PointerEvent): void => {
		if (!chessboard.state.board.mouseEvents) return;
		if (e.button === 2) {
			deselect();
			return;
		}
		if (!chessboard.movableEnabled) return;

		const boundingRect = boardDiv.getBoundingClientRect();
		const x = e.clientX - boundingRect.left;
		const y = e.clientY - boundingRect.top;

		const square = getSquareFromCoords(x, y);
		if (!square) return;
		const piece = chessboard.getPieceFromSquare(square);
		dispatch('squareClick', { square, piece: piece?.name });

		if (!chessboard.selectableEnabled && !chessboard.draggableEnabled) {
			deselect();
			return;
		}

		if (!chessboard.selectedPiece) return;
		if (chessboard.selectedPiece.square === square) return;
		const move = chessboard.selectedPiece.square + square;

		if (!chessboard.legalEnabled) {
			makeMove(move);
			deselect();
			return;
		}

		if (!canMove(chessboard.selectedPiece.name)) {
			if (chessboard.preMovesEnabled && chessboard.preMoves.includes(move)) {
				if (chessboard.isPromotion(move)) makeNextMove(`${move}q`);
				else makeNextMove(move);
				e.stopPropagation();
			}
			deselect(false);
			return;
		}

		if (
			(piece === undefined || piece.name[0] !== chessboard.selectedPiece.name[0]) &&
			canMove(chessboard.selectedPiece.name)
		) {
			if (chessboard.isPromotion(move) && chessboard.legalMoves.includes(move))
				makeMovePromotion(move);
			else if (chessboard.legalMoves.includes(move)) makeMove(move);
			deselect();
		}
	};

	const moveMadeFromPiece = (e: CustomEvent) => {
		const move = e.detail;

		if (chessboard.legalEnabled) {
			if (chessboard.isPromotion(move) && chessboard.legalMoves.includes(`${move}q`))
				makeMovePromotion(move);
			else if (chessboard.legalMoves.includes(move)) makeMove(move);
			else if (chessboard.preMovesEnabled && chessboard.preMoves.includes(move)) {
				if (chessboard.isPromotion(move)) makeNextMove(`${move}q`);
				else makeNextMove(move);
			} else {
				deselect();
			}
		} else makeMove(move);

		clearAllSquares('LEGAL');
		clearAllSquares('PREMOVE');
		chessboard.state.markedSquares = chessboard.state.markedSquares;
	};

	const updateSelectedPieceHighlight = (square?: ChessSquare) => {
		if (chessboard.selectableEnabled || chessboard.draggableEnabled) {
			const piece = chessboard.getPieceFromSquare(square ?? chessboard.selectedPiece?.square);
			if (!piece) return;
			if (chessboard.selectableEnabled) highlightSquare(piece.square, 'SELECT');
			if (!chessboard.legalEnabled) return;
			clearAllSquares('LEGAL');
			clearAllSquares('PREMOVE');
			if (canMove(piece.name)) highlightLegalMoves(chessboard.legalMoves, piece.square);
			if (!canMove(piece.name)) highlightLegalMoves(chessboard.preMoves, piece.square, 'PREMOVE');
		}
	};

	export const setFEN = (
		fen: string,
		deselectPiece = true,
		sound: MoveTypeSound | false = 'MOVE'
	) => {
		chessboard.updatePiecesWithFen(fen);
		if (deselectPiece) {
			deselect();
		}

		clearAllSquares();
		removeGhostPiece();

		updateLegalState(false);

		chessboard.currentPreMove = '';
		if (chessboard.state.callbacks.getLastMove) {
			const lastMove = chessboard.state.callbacks.getLastMove();
			chessboard.lastMove = lastMove;
			if (sound !== false) {
				if (sound !== 'MOVE') playMoveSound(sound);
				else if (chessboard.isCastling(lastMove)) playMoveSound('CASTLE');
				else playMoveSound(sound);
			}

			highlightMove(lastMove);
		} else if (sound !== false) playMoveSound(sound);

		updateSelectedPieceHighlight();

		chessboard.state.pieces = chessboard.state.pieces;
	};

	export const getShortFEN = () => chessboard.getShortFEN();

	export const setSize = (size: number) => {
		if (!size || chessboard.state.board.size === size) return;
		chessboard.state.board.size = size;
		if (mounted && chessboard.state.board.resizible)
			document.body.style.setProperty('--boardSize', `${chessboard.state.board.size}px`);
	};

	export const setScale = (scale: number) => {
		if (!scale || chessboard.state.board.scale === scale) return;

		chessboard.state.board.scale = scale;
		dispatch('resize', { scale: scale });

		if (mounted && chessboard.state.board.resizible)
			document.body.style.setProperty('--boardScale', `${chessboard.state.board.scale}`);
	};

	export const getPieceNameFromSquare = (square: ChessSquare | undefined): ChessPiece | undefined =>
		chessboard.getPieceFromSquare(square)?.name;

	export const setTools = (tools: (CircleTool | ArrowTool)[]) => {
		chessboard.state.drawTools.tools = tools;
	};

	export const removeTools = (prop?: {
		type?: 'arrow' | 'circle';
		from?: ChessSquare;
		to?: ChessSquare;
		fixed?: boolean;
	}) => {
		chessboard.state.drawTools.tools = chessboard.state.drawTools.tools.filter((tool) => {
			if (!prop) return false;

			return (
				(!prop.type || tool.type !== prop.type) &&
				(!prop.from ||
					(tool.type === 'arrow' && tool.from !== prop.from) ||
					(tool.type === 'circle' && tool.square !== prop.from)) &&
				(!prop.to || (tool.type === 'arrow' && tool.to !== prop.to)) &&
				(prop.fixed === undefined || tool.fixed !== prop.fixed)
			);
		});
	};

	export const setMovableColor = (color: 'WHITE' | 'BLACK' | boolean) => {
		if (color === false) chessboard.state.movable.enabled = false;
		else {
			chessboard.state.movable.enabled = true;
			chessboard.state.movable.color = color === true ? 'BOTH' : color;
		}
	};

	export const setLastMove = (move: string) => {
		if (move.length < 4) return;
		chessboard.lastMove = move;
		highlightMove(move);
	};

	export const setLegalMoves = (moves: string[]) => {
		chessboard.legalMoves = moves;
	};

	export const setPreMoves = (moves: string[]) => {
		chessboard.preMoves = moves;
	};

	export const getState = () => chessboard.state;

	export const setState = (state: State) => {
		chessboard.state = state;

		clearAllSquares();
		updateLegalState(false);

		highlightMove(chessboard.lastMove);
		highlightMove(chessboard.currentPreMove, true, 'NEXTMOVE');
		updateSelectedPieceHighlight();
	};

	export const setConfigSettings = (cfg?: ChessboardConfig | undefined) => {
		if (cfg === undefined) return;
		chessboard.setConfigSettings(cfg);
		chessboard.state = chessboard.state;

		setState(chessboard.state);
	};

	export const getConfigFromState = (state: State) => state.getConfig();

	const handleSquareOver = (e: CustomEvent, piece: StatePiece) => {
		if (chessboard.legalEnabled) {
			if (canMove(piece.name)) chessboard.legalHover(e.detail.square);
			if (!canMove(piece.name) && chessboard.preMovesEnabled)
				chessboard.legalHover(e.detail.square, 'PREMOVE');
		}
		chessboard.state.markedSquares = chessboard.state.markedSquares;
	};

	const startDragging = (piece: StatePiece) => {
		if (chessboard.ghostPieceEnabled) setGhostPiece(piece);
		clearAllSquares('SELECT');
	};

	const handlePromotion = (e: CustomEvent) => {
		const piece = chessboard.getPieceFromSquare(<ChessSquare>promotionLastMove.substring(2, 4));
		if (!piece) return;

		const newPiece = (piece.name[0] + e.detail.toUpperCase()) as ChessPiece;
		const newMove = promotionLastMove + e.detail;

		chessboard.state.callbacks.beforeMove?.(newMove);

		chessboard.setPiece(piece.square, newPiece);
		chessboard.state.pieces = chessboard.state.pieces;
		playMoveSound(promotionIsCapture ? 'CAPTURE' : 'MOVE');

		chessboard.state.callbacks.afterMove?.(newMove);
		updateLegalState();
	};

	const handleSelect = (piece: StatePiece) => {
		const tmp = chessboard.getPieceFromSquare(piece.square);
		if (
			tmp &&
			tmp.square === piece.square &&
			tmp.name === piece.name &&
			chessboard.selectableEnabled
		)
			highlightSquare(piece.square, 'SELECT');
		else deselect();
	};

	const getRoundedSquareCorner = (square: ChessSquare) => {
		if (square === 'a1') return chessboard.flipped ? 'top-right' : 'bottom-left';
		if (square === 'a8') return chessboard.flipped ? 'bottom-right' : 'top-left';
		if (square === 'h1') return chessboard.flipped ? 'top-left' : 'bottom-right';
		if (square === 'h8') return chessboard.flipped ? 'bottom-left' : 'top-right';
		return '';
	};

	const whoCanMove = (whiteToMove: boolean) => {
		if (
			!chessboard.movableEnabled ||
			!chessboard.state.board.mouseEvents ||
			(!chessboard.draggableEnabled && !chessboard.selectableEnabled)
		)
			return '';
		if (!chessboard.legalEnabled) return 'wb';

		if (chessboard.preMovesEnabled && chessboard.state.movable.color !== 'BOTH')
			return chessboard.state.movable.color[0].toLowerCase();

		if (
			chessboard.state.movable.color === 'BOTH' ||
			whiteToMove === (chessboard.state.movable.color === 'WHITE')
		)
			return whiteToMove ? 'w' : 'b';

		return '';
	};

	onMount(() => {
		mounted = true;
		updateLegalState(true);
		highlightMove(chessboard.state.callbacks.getLastMove?.());
		if (chessboard.state.board.resizible)
			document.body.style.setProperty('--boardScale', `${chessboard.state.board.scale}`);

		return () => {
			if (chessboard.state.board.resizible) document.body.style.removeProperty('--boardScale');
		};
	});
</script>

<div class="boardWrapper {className}">
	<div
		role="button"
		tabindex="0"
		use:fitSize
		on:newsize={(e) => {
			chessboard.state.board.size = e.detail;
		}}
		on:pointerdown|capture={boardClick}
		on:contextmenu|preventDefault
		on:drag|preventDefault
		use:drawArrows={{
			svg: arrowsSvg,
			flipped: chessboard.flipped,
			enabled: chessboard.state.drawTools.enabled && chessboard.state.board.mouseEvents,
			settings: chessboard.state.drawTools.settings
		}}
		on:drawCircle={(e) =>
			dispatch('drawCircle', { square: e.detail.square, color: e.detail.color })}
		on:drawArrow={(e) => dispatch('drawArrow', { move: e.detail.move, color: e.detail.color })}
		bind:this={boardDiv}
		class="board text-sm{!chessboard.legalEnabled && chessboard.selectedPiece ? ' pointer' : ''}"
		style="
		--boardTheme: url({chessboard.state.board.boardTheme === 'standard'
			? standardBoard
			: darkBlueBoard});"
	>
		<div style="width: 100%; height: 100%" class={whoCanMove(chessboard.whiteToMove)}>
			{#if chessboard.state.board.startFen}
				{#each chessboard.state.pieces as piece (piece)}
					<Piece
						square={piece.square}
						name={piece.name}
						boardSize={chessboard.state.board.size}
						mouseEvents={chessboard.state.board.mouseEvents}
						draggableState={chessboard.state.draggable}
						movableState={chessboard.state.movable}
						selectedPiece={chessboard.selectedPiece}
						getGridCoordsFromSquare={chessboard.getGridCoordsFromSquare}
						flipped={chessboard.flipped}
						on:move={moveMadeFromPiece}
						on:clicked={() => {
							dispatch('piececlick', { piece });
							selectPiece(piece.square);
						}}
						on:startMoving={() => {
							dispatch('startDragging', { piece });
							startDragging(piece);
						}}
						on:squareover={(e) => handleSquareOver(e, piece)}
						on:endDragging
						on:select={() => handleSelect(piece)}
						on:canceled={() => deselect()}
						on:deselect={() => deselect()}
					/>
				{/each}
			{/if}
		</div>
		{#if chessboard.ghostPiece}
			<Piece
				isGhost={true}
				boardSize={chessboard.state.board.size}
				square={chessboard.ghostPiece.square}
				name={chessboard.ghostPiece.name}
				getGridCoordsFromSquare={chessboard.getGridCoordsFromSquare}
				flipped={chessboard.flipped}
			/>
		{/if}
		{#if chessboard.highlightEnabled}
			{#each [...chessboard.state.markedSquares] as square (square)}
				<Square
					on:dragenter={(e) => {
						highlightSquare(e.detail.square, 'LEGALHOVER');
					}}
					boardSize={chessboard.state.board.size}
					theme={chessboard.state.board.boardTheme}
					square={square.square}
					color={square.color}
					getGridCoordsFromSquare={chessboard.getGridCoordsFromSquare}
					flipped={chessboard.flipped}
					mouseEvents={chessboard.state.board.mouseEvents}
					corner={getRoundedSquareCorner(square.square)}
				/>
			{/each}
		{/if}
		{#if chessboard.state.board.notation && mounted}
			<Notation theme={chessboard.state.board.boardTheme} flipped={chessboard.flipped} />
		{/if}
		{#if chessboard.state.board.resizible && mounted}
			<Resizing
				{chessboard}
				mouseEvents={chessboard.state.board.mouseEvents}
				on:resizing={(e) => {
					setScale(e.detail);
				}}
			/>
		{/if}
		{#if chessboard.state.drawTools.enabled}
			<Arrows
				flipped={chessboard.flipped}
				bind:svg={arrowsSvg}
				tools={chessboard.state.drawTools.tools}
				knightLShape={chessboard.state.drawTools.settings.knightLShape}
			/>
		{/if}
		{#if chessboard.legalEnabled}
			<PromotionModal bind:this={promotionModal} on:newPromotion={handlePromotion} />
		{/if}
	</div>
	<div use:fitSize class="layer-1">
		<slot name="layer-1" />
	</div>
</div>

{#if chessboard.soundsEnabled}
	<Sounds bind:this={sounds} settings={chessboard.state.sounds.settings} />
{/if}

<style>
	:global(.w .white, .b .black, .wb .black, .wb .white) {
		pointer-events: auto;
		cursor: pointer;
	}

	.boardWrapper {
		aspect-ratio: 1 / 1;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}
	.board {
		-webkit-touch-callout: none; /* iOS Safari */
		-webkit-user-select: none; /* Safari */
		-khtml-user-select: none; /* Konqueror HTML */
		-moz-user-select: none; /* Old versions of Firefox */
		-ms-user-select: none; /* Internet Explorer/Edge */
		user-select: none; /* Non-prefixed version, currently supported by Chrome, Opera and Firefox */
		touch-action: none;
		outline: none;
		position: relative;
		aspect-ratio: 1;
		width: 100%;
		max-width: 100%;
		max-height: 100%;
		background-image: var(--boardTheme);
		font-size: 0.75rem;
		line-height: 1rem;
		cursor: default;
		border-radius: inherit;
	}

	.pointer {
		cursor: pointer;
	}

	@media (min-width: 640px) {
		.text-sm {
			font-size: 0.875rem;
			line-height: 1.25rem;
		}
	}

	.layer-1 {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		pointer-events: none;
		z-index: 5;
		border-radius: inherit;
		overflow: hidden;
	}
</style>

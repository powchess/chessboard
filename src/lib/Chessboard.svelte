<script context="module" lang="ts">
	export type ChessboardConfig = Config;
</script>

<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount, tick } from 'svelte';
	import type { ChessboardConfig as Config, MoveTypeSound } from './boardConfig';
	import Chessboard from './chessboard';
	import Notation from './Notation.svelte';
	import Piece from './Piece.svelte';
	import Square from './Square.svelte';
	import drawArrows, { type ArrowTool, type CircleTool } from './drawArrows';
	import Arrows from './Arrows.svelte';
	import PromotionModal from './PromotionModal.svelte';
	import Sounds from './Sounds.svelte';
	import standardBoard from './assets/boards/standard.svg';
	import darkBlueBoard from './assets/boards/darkBlue.svg';
	import Resizing from './Resizing.svelte';
	import type { ChessFile, ChessPiece, ChessRank, ChessSquare } from './chessTypes';
	import { Color, SquareColor, squareColorToString } from './enums';
	import { browser } from '$app/environment';
	import type { State, Piece as StatePiece } from './state/index';

	export let config: ChessboardConfig;
	export let className = '';

	const chessboard = new Chessboard(config);
	const dispatch = createEventDispatcher();

	let boardDiv: HTMLDivElement;
	let boardWrapper: HTMLDivElement;
	let arrowsSvg: SVGGElement;
	let sounds: Sounds;

	let promotionModal: PromotionModal;
	let promotionLastMove = '';

	export const clearAllSquares = (mode?: SquareColor) => {
		chessboard.clearAllSquares(mode);
		if (mode === SquareColor.LEGAL) chessboard.clearAllSquares(SquareColor.LEGALHOVER);
		if (mode === SquareColor.PREMOVE) chessboard.clearAllSquares(SquareColor.PREMOVEHOVER);
		chessboard.state.markedSquares = chessboard.state.markedSquares;
	};

	export const highlightSquare = (square: ChessSquare, mode: SquareColor): void => {
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		if (!allowDrawHighlightSquares(squareColorToString(mode))) return;
		chessboard.highlightSquare(square, mode);
		chessboard.state.markedSquares = chessboard.state.markedSquares;
	};

	const allowDrawHighlightSquares = (color?: 'legal' | 'check' | 'move' | 'nextMove' | 'preMove' | 'select' | SquareColor) =>
		chessboard.highlightEnabled &&
		(color === undefined || chessboard.highlightSettings[typeof color === 'string' ? color : squareColorToString(color)]);

	export const selectPiece = (square: ChessSquare) => {
		if (!chessboard.selectableEnabled && chessboard.draggableEnabled) updateSelectedPieceHighlight(square);
		if (!chessboard.selectableEnabled) return;
		deselect(true);

		const piece = chessboard.getPieceFromSquare(square);
		if (piece === undefined) return;

		chessboard.selectedPiece = piece;
		updateSelectedPieceHighlight();
	};

	export const deselect = (removeNextMove = true) => {
		clearAllSquares(SquareColor.SELECT);
		clearAllSquares(SquareColor.LEGAL);
		clearAllSquares(SquareColor.PREMOVE);
		chessboard.selectedPiece = undefined;
		if (removeNextMove) {
			clearAllSquares(SquareColor.NEXTMOVE);
			chessboard.currentPreMove = '';
		}
	};

	export const setCheckSquare = (square: ChessSquare | undefined) => {
		clearAllSquares(SquareColor.CHECK);
		if (square && chessboard.legalEnabled) highlightSquare(square, SquareColor.CHECK);
		chessboard.state.markedSquares = chessboard.state.markedSquares;
	};

	export const removeCheckSquare = () => {
		clearAllSquares(SquareColor.CHECK);
	};

	export const flipBoard = (flipped?: boolean) => {
		chessboard.flipBoard(flipped);
		chessboard.flipped = chessboard.flipped;
	};

	export const highlightManySquares = (squares: ChessSquare[], mode: SquareColor): void => {
		squares.forEach((square) => chessboard.highlightSquare(square, mode));
		chessboard.state.markedSquares = chessboard.state.markedSquares;
	};

	export const highlightMove = (move: string, clear = true, color: SquareColor = SquareColor.MOVE) => {
		if (move.length < 4 || !allowDrawHighlightSquares(squareColorToString(color))) return;
		if (clear) clearAllSquares(color);
		highlightManySquares([<ChessSquare>move.substring(0, 2), <ChessSquare>move.substring(2, 4)], color);
	};

	export const highlightMoves = (moves: string[], clear?: boolean, color: SquareColor = SquareColor.MOVE) => {
		const squares: ChessSquare[] = [];
		if (clear) clearAllSquares(color);

		moves.forEach((move) => {
			if (move.length < 4) return;
			squares.push(<ChessSquare>move.substring(0, 2));
			squares.push(<ChessSquare>move.substring(2, 4));
		});

		highlightManySquares(squares, color);
	};

	export const highlightLegalMove = (legalMove: string) => {
		highlightSquare(<ChessSquare>legalMove.substring(2, 4), SquareColor.LEGAL);
	};

	export const highlightLegalMoves = (
		legalMoves: string[],
		from?: ChessSquare,
		mode: SquareColor.LEGAL | SquareColor.PREMOVE = SquareColor.LEGAL
	) => {
		clearAllSquares(mode);
		if (!allowDrawHighlightSquares(squareColorToString(mode))) return;

		legalMoves.forEach((move) => {
			if (move.length < 4) return;
			if (from === undefined || move.substring(0, 2) === from) chessboard.highlightSquare(<ChessSquare>move.substring(2, 4), mode);
		});

		chessboard.state.markedSquares = chessboard.state.markedSquares;
	};

	export const movePiece = (move: string, highlight = true) => {
		chessboard.makeMove(move);
		if (highlight) highlightMove(move);
		chessboard.state.pieces = chessboard.state.pieces;
	};

	export const removePiece = (square: ChessSquare): void => {
		chessboard.removePiece(square);
		if (chessboard.ghostPieceEnabled && chessboard.ghostPiece?.square === square) {
			chessboard.removeGhostPiece();
			chessboard.ghostPiece = chessboard.ghostPiece;
		}
		chessboard.state.pieces = chessboard.state.pieces;
	};

	// eslint-disable-next-line @typescript-eslint/no-use-before-define
	const canMove = (pieceName: string) =>
		(chessboard.whiteToMove && pieceName[0] === 'w') || (!chessboard.whiteToMove && pieceName[0] === 'b');

	export const updateLegalState = (updateSelect = false) => {
		if (!chessboard.legalEnabled) return;

		if (chessboard.state.callbacks.getWhiteToMove) chessboard.whiteToMove = chessboard.state.callbacks.getWhiteToMove();

		if (chessboard.state.callbacks.getPreMoves && chessboard.preMovesEnabled)
			chessboard.preMoves = chessboard.state.callbacks.getPreMoves();
		else chessboard.preMoves = [];

		if (chessboard.state.callbacks.getLegalMoves && chessboard.state.legal.enabled)
			chessboard.legalMoves = chessboard.state.callbacks.getLegalMoves();
		else chessboard.legalMoves = [];

		// change preMoves to legalMoves
		if (updateSelect) updateSelectedPieceHighlight();

		if (chessboard.state.callbacks.getInCheck && chessboard.state.callbacks.getInCheck()) {
			if (chessboard.whiteToMove) setCheckSquare(chessboard.getWhiteKingSquare());
			else setCheckSquare(chessboard.getBlackKingSquare());
		} else removeCheckSquare();

		if (chessboard.state.callbacks.getLastMove) {
			chessboard.lastMove = chessboard.state.callbacks.getLastMove();
			highlightMove(chessboard.lastMove);
		} else clearAllSquares(SquareColor.MOVE);
	};

	export const playMoveSound = (moveType: MoveTypeSound) => {
		if (chessboard.soundsEnabled && sounds) sounds.playMoveSound(moveType);
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
		if (chessboard.state.callbacks.beforeMove) chessboard.state.callbacks.beforeMove(move);
		deselect(false);

		const rookMove = chessboard.getRookMoveIfIsCastling(move);
		const capturedPawnSquare = chessboard.getCapturedPawnSquareIfIsEnPassant(move);

		if (rookMove && chessboard.legalEnabled && chessboard.state.legal.settings.allowCastling) {
			movePiece(rookMove, false);
			playMoveSound('CASTLE');
		} else if (capturedPawnSquare && chessboard.legalEnabled && chessboard.state.legal.settings.allowEnPassant) {
			removePiece(capturedPawnSquare);
			playMoveSound('CAPTURE');
		} else if (chessboard.isCapture(move)) {
			playMoveSound('CAPTURE');
		} else playMoveSound('MOVE');

		removeGhostPiece();
		movePiece(move);

		if (chessboard.state.callbacks.afterMove) chessboard.state.callbacks.afterMove(move);
		updateLegalState();

		if (chessboard.legalEnabled && chessboard.preMovesEnabled && chessboard.currentPreMove !== '') {
			if (chessboard.legalMoves.includes(chessboard.currentPreMove) || chessboard.legalMoves.includes(`${chessboard.currentPreMove}q`)) {
				const nextMove = chessboard.currentPreMove;
				tick().then(() => {
					makeMove(nextMove);
				});
			}
			chessboard.currentPreMove = '';
			clearAllSquares(SquareColor.NEXTMOVE);
		}
	};

	export const makeNextMove = (move: string): void => {
		if (!chessboard.legalEnabled || !chessboard.preMovesEnabled || !chessboard.movableEnabled) return;

		clearAllSquares(SquareColor.PREMOVE);
		highlightMove(move, true, SquareColor.NEXTMOVE);
		chessboard.currentPreMove = move;
		dispatch('nextMove', { move });
	};

	export const makeMovePromotion = (move: string): void => {
		const piece = chessboard.getPieceFromSquare(<ChessSquare>move.substring(0, 2));
		if (!piece) return;
		const color = piece.name[0] === 'w' ? Color.WHITE : Color.BLACK;
		promotionModal.openPromotionModal(color === Color.WHITE);
		promotionLastMove = move;
		chessboard.makeMove(move);
		clearAllSquares(SquareColor.LEGAL);
		clearAllSquares(SquareColor.SELECT);
		highlightMove(move);
	};

	export const removeSquareHighlight = (square: ChessSquare, mode?: SquareColor): void => {
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

	export const changeColorOfPiece = (square: ChessSquare, color?: Color.WHITE | Color.BLACK) => {
		const piece = chessboard.getPieceFromSquare(square)?.name;
		if (!piece) return;
		if (color !== undefined) chessboard.setPiece(square, `${color === Color.WHITE ? 'w' : 'b'}${piece[1]}` as ChessPiece);
		else chessboard.setPiece(square, `${piece[0] === 'w' ? 'b' : 'w'}${piece[1]}` as ChessPiece);
		chessboard.state.pieces = chessboard.state.pieces;
	};

	export const getSquareFromCoords = (x: number, y: number): ChessSquare => {
		const coordX = Math.floor((x / chessboard.state.board.size) * 8);
		const coordY = Math.floor((y / chessboard.state.board.size) * 8);

		const adjX = chessboard.flipped ? Math.abs(coordX - 7) : coordX;
		const adjY = chessboard.flipped ? coordY : Math.abs(coordY - 7);

		const square: ChessSquare = `${<ChessFile>Object.keys(chessboard.letters)[adjX]}${<ChessRank>(adjY + 1).toString()}`;
		return square;
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
		const piece = chessboard.getPieceFromSquare(square);
		dispatch('squareClick', { square, piece: piece ? piece.name : undefined });

		if (!chessboard.selectableEnabled && !chessboard.draggableEnabled) {
			deselect();
			return;
		}

		if (chessboard.selectedPiece && chessboard.selectedPiece.square !== square && !chessboard.legalEnabled) {
			makeMove(chessboard.selectedPiece.square + square);
			deselect();
			return;
		}

		if (chessboard.selectedPiece && chessboard.selectedPiece.square !== square && !canMove(chessboard.selectedPiece.name)) {
			if (chessboard.preMovesEnabled && chessboard.preMoves.includes(chessboard.selectedPiece.square + square)) {
				makeNextMove(chessboard.selectedPiece.square + square);
			}
			deselect(false);
			return;
		}

		if (
			chessboard.selectedPiece &&
			chessboard.selectedPiece.square !== square &&
			(piece === undefined || piece.name[0] !== chessboard.selectedPiece.name[0]) &&
			canMove(chessboard.selectedPiece.name)
		) {
			if (
				chessboard.isPromotion(chessboard.selectedPiece.square + square) &&
				chessboard.legalMoves.includes(`${chessboard.selectedPiece.square + square}q`)
			)
				makeMovePromotion(chessboard.selectedPiece.square + square);
			else if (chessboard.legalMoves.includes(chessboard.selectedPiece.square + square)) makeMove(chessboard.selectedPiece.square + square);
			deselect();
		}
	};

	const moveMadeFromPiece = (e: CustomEvent) => {
		const move = e.detail;

		if (chessboard.legalEnabled) {
			if (chessboard.isPromotion(move) && chessboard.legalMoves.includes(`${move}q`)) makeMovePromotion(move);
			else if (chessboard.legalMoves.includes(move)) makeMove(move);
			else if (chessboard.preMovesEnabled && chessboard.preMoves.includes(move)) makeNextMove(move);
			else {
				deselect();
			}
		} else makeMove(move);

		clearAllSquares(SquareColor.LEGAL);
		clearAllSquares(SquareColor.PREMOVE);
		chessboard.state.markedSquares = chessboard.state.markedSquares;
	};

	const updateSelectedPieceHighlight = (square?: ChessSquare) => {
		if (chessboard.selectableEnabled || chessboard.draggableEnabled) {
			const piece = chessboard.getPieceFromSquare(square ?? chessboard.selectedPiece?.square);
			if (!piece) return;
			if (chessboard.selectableEnabled) highlightSquare(piece.square, SquareColor.SELECT);
			if (!chessboard.legalEnabled) return;
			clearAllSquares(SquareColor.LEGAL);
			clearAllSquares(SquareColor.PREMOVE);
			if (canMove(piece.name)) highlightLegalMoves(chessboard.legalMoves, piece.square);
			if (!canMove(piece.name)) highlightLegalMoves(chessboard.preMoves, piece.square, SquareColor.PREMOVE);
		}
	};

	export const setFEN = (fen: string, deselectPiece = true, sound: MoveTypeSound | false = 'MOVE') => {
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
		if (browser && chessboard.state.board.resizible) document.body.style.setProperty('--boardSize', `${chessboard.state.board.size}px`);
	};

	export const setScale = (scale: number) => {
		if (!scale || chessboard.state.board.scale === scale) return;
		chessboard.state.board.scale = scale;
		if (browser && chessboard.state.board.resizible) document.body.style.setProperty('--boardScale', `${chessboard.state.board.scale}`);
	};

	export const getPieceFromSquare = (square: ChessSquare) => chessboard.getPieceFromSquare(square)?.name;

	export const setTools = (tools: (CircleTool | ArrowTool)[]) => {
		chessboard.state.drawTools.tools = tools;
	};

	export const removeTools = (prop?: { type?: 'arrow' | 'circle'; from?: ChessSquare; to?: ChessSquare; fixed?: boolean }) => {
		chessboard.state.drawTools.tools = chessboard.state.drawTools.tools.filter((tool) => {
			if (!prop) return false;

			return (
				(!prop.type || tool.type !== prop.type) &&
				(!prop.from || (tool.type === 'arrow' && tool.from !== prop.from) || (tool.type === 'circle' && tool.square !== prop.from)) &&
				(!prop.to || (tool.type === 'arrow' && tool.to !== prop.to)) &&
				(prop.fixed === undefined || tool.fixed !== prop.fixed)
			);
		});
	};

	export const setMovableColor = (color: Color.WHITE | Color.BLACK | boolean) => {
		if (color === false) chessboard.state.movable.enabled = false;
		else {
			chessboard.state.movable.enabled = true;
			chessboard.state.movable.color = color === true ? Color.BOTH : color;
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
		highlightMove(chessboard.currentPreMove, true, SquareColor.NEXTMOVE);
		updateSelectedPieceHighlight();
	};

	export const setConfigSettings = (cfg?: ChessboardConfig | undefined) => {
		if (cfg === undefined) return;
		chessboard.setConfigSettings(cfg);
		chessboard.state = chessboard.state;

		setState(chessboard.state);
	};

	export const getConfigFromState = (state: State) => state.getConfig();

	const handlePieceMoving = (e: CustomEvent, piece: StatePiece) => {
		const bounding = boardDiv.getBoundingClientRect();
		if (chessboard.legalEnabled) {
			if (canMove(piece.name)) chessboard.legalHover(getSquareFromCoords(e.detail.x - bounding.x, e.detail.y - bounding.y));
			if (!canMove(piece.name) && chessboard.preMovesEnabled)
				chessboard.preMoveHover(getSquareFromCoords(e.detail.x - bounding.x, e.detail.y - bounding.y));
		}
		chessboard.state.markedSquares = chessboard.state.markedSquares;
	};

	const startDragging = (piece: StatePiece) => {
		if (chessboard.ghostPieceEnabled) setGhostPiece(piece);
		clearAllSquares(SquareColor.SELECT);
	};

	const handlePromotion = (e: CustomEvent) => {
		const piece = chessboard.getPieceFromSquare(<ChessSquare>promotionLastMove.substring(2, 4));
		if (!piece) return;

		const newPiece = (piece.name[0] + e.detail.toUpperCase()) as ChessPiece;
		const newMove = promotionLastMove + e.detail;

		if (chessboard.state.callbacks.beforeMove) chessboard.state.callbacks.beforeMove(newMove);

		chessboard.setPiece(piece.square, newPiece);
		chessboard.state.pieces = chessboard.state.pieces;
		playMoveSound('MOVE');

		if (chessboard.state.callbacks.afterMove) chessboard.state.callbacks.afterMove(newMove);
		updateLegalState();
	};

	const handleCaptured = (square: ChessSquare) => {
		if (!chessboard.selectedPiece) return;
		const move = chessboard.selectedPiece.square + square;

		if (chessboard.legalEnabled) {
			if (chessboard.isPromotion(move) && chessboard.legalMoves.includes(`${move}q`)) makeMovePromotion(move);
			else if (chessboard.legalMoves.includes(move)) makeMove(move);
			else if (chessboard.preMovesEnabled && chessboard.preMoves.includes(move)) makeNextMove(move);
			else {
				deselect();
			}
		} else makeMove(move);

		deselect(false);
	};

	const handleSelect = (piece: StatePiece) => {
		const tmp = chessboard.getPieceFromSquare(piece.square);
		if (tmp && tmp.square === piece.square && tmp.name === piece.name) highlightSquare(piece.square, SquareColor.SELECT);
		// selectPiece(piece.square);
	};

	function setupChessboardObserver(boardWrap: HTMLDivElement) {
		if (!boardDiv || !boardWrap) return undefined;
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		teardownChessboard?.();

		if (typeof window.ResizeObserver === 'undefined') {
			throw new Error('window.ResizeObserver is missing.');
		}

		const observer = new ResizeObserver((entries) => {
			const boundingRect = boardWrap.getBoundingClientRect();
			entries.forEach(() => {
				boardDiv.style.setProperty(
					'width',
					`${(Math.floor((boundingRect.width * window.devicePixelRatio) / 8) * 8) / window.devicePixelRatio}px`
				);
				boardDiv.style.setProperty(
					'height',
					`${(Math.floor((boundingRect.width * window.devicePixelRatio) / 8) * 8) / window.devicePixelRatio}px`
				);
			});
		});
		observer.observe(boardWrap);
		return () => {
			observer.unobserve(boardWrap);
			observer.disconnect();
		};
	}

	$: teardownChessboard = setupChessboardObserver(boardWrapper);

	onMount(() => {
		updateLegalState(true);
		if (chessboard.state.callbacks.getLastMove) highlightMove(chessboard.state.callbacks.getLastMove());
		if (chessboard.state.board.resizible) document.body.style.setProperty('--boardScale', `${chessboard.state.board.scale}`);
	});

	onDestroy(() => {
		teardownChessboard?.();
		if (browser && chessboard.state.board.resizible) document.body.style.removeProperty('--boardScale');
	});
</script>

<div bind:this={boardWrapper} class="boardWrapper">
	<div
		on:pointerdown={boardClick}
		on:contextmenu|preventDefault
		on:drag|preventDefault
		use:drawArrows={{
			svg: arrowsSvg,
			flipped: chessboard.flipped,
			enabled: chessboard.state.drawTools.enabled && chessboard.state.board.mouseEvents,
			settings: chessboard.state.drawTools.settings
		}}
		on:drawCircle={(e) => dispatch('drawCircle', { square: e.detail.square, color: e.detail.color })}
		on:drawArrow={(e) => dispatch('drawArrow', { move: e.detail.move, color: e.detail.color })}
		bind:this={boardDiv}
		bind:clientWidth={chessboard.state.board.size}
		class="noselect board text-sm {className}{!chessboard.legalEnabled && chessboard.selectedPiece ? ' pointer' : ''}"
		style="
		--boardTheme: url({chessboard.state.board.boardTheme === 'standard' ? standardBoard : darkBlueBoard});"
	>
		<div style="width: 100%; height: 100%" class="noselect">
			{#if chessboard.state.board.startFen}
				{#each chessboard.state.pieces as piece (piece)}
					<Piece
						square={piece.square}
						name={piece.name}
						mouseEvents={chessboard.state.board.mouseEvents}
						legalState={chessboard.state.legal}
						draggableState={chessboard.state.draggable}
						selectableState={chessboard.state.selectable}
						movableState={chessboard.state.movable}
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
						on:moving={(e) => handlePieceMoving(e, piece)}
						on:endDragging
						on:select={() => handleSelect(piece)}
						on:deselect={() => {
							deselect();
						}}
						on:captured={() => handleCaptured(piece.square)}
					/>
				{/each}
			{/if}
		</div>
		{#if chessboard.ghostPiece}
			<Piece
				isGhost={true}
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
						highlightSquare(e.detail.square, SquareColor.LEGALHOVER);
					}}
					theme={chessboard.state.board.boardTheme}
					square={square.square}
					color={square.color}
					getGridCoordsFromSquare={chessboard.getGridCoordsFromSquare}
					flipped={chessboard.flipped}
					mouseEvents={chessboard.state.board.mouseEvents}
					corner={square.square === 'a8'
						? 'top-left'
						: square.square === 'h8'
						? 'top-right'
						: square.square === 'a1'
						? 'bottom-left'
						: square.square === 'h1'
						? 'bottom-right'
						: ''}
				/>
			{/each}
		{/if}
		{#if chessboard.state.board.notation}
			<Notation theme={chessboard.state.board.boardTheme} flipped={chessboard.flipped} />
		{/if}
		{#if chessboard.state.board.resizible}
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
</div>

{#if chessboard.soundsEnabled}
	<Sounds bind:this={sounds} settings={chessboard.state.sounds.settings} />
{/if}

<style>
	@import './boardThemes/themes.css';

	.boardWrapper {
		aspect-ratio: 1 / 1;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
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

	.pointer {
		cursor: pointer;
	}

	@media (min-width: 640px) {
		.text-sm {
			font-size: 0.875rem;
			line-height: 1.25rem;
		}
	}
</style>

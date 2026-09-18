import { cleanup, render, waitFor } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Chessboard from './Chessboard.svelte';
import ChessboardEventHarness from './ChessboardEventHarness.test.svelte';

class ResizeObserverMock {
	observe = vi.fn();
	unobserve = vi.fn();
	disconnect = vi.fn();
}

const promotionConfig = {
	board: { startFen: '4k2r/6P1/8/8/8/8/8/4K3 w - - 0 1' },
	movable: true,
	draggable: { ghostPiece: true },
	selectable: true,
	legal: true,
	callbacks: {
		getWhiteToMove: () => true,
		getLegalMoves: () => ['g7h8q', 'g7h8r', 'g7h8b', 'g7h8n']
	}
} as const;

const pointerEvent = (
	type: 'pointerdown' | 'pointermove' | 'pointerup',
	x: number,
	y: number,
	pointerType: 'mouse' | 'touch' = 'mouse'
) => {
	const event = new MouseEvent(type, { bubbles: true, button: 0, clientX: x, clientY: y });
	Object.defineProperties(event, {
		isPrimary: { value: true },
		pointerType: { value: pointerType },
		offsetX: { value: 0 },
		offsetY: { value: 0 }
	});
	return event;
};

const pointerDown = (x: number, y: number) => pointerEvent('pointerdown', x, y);

describe('Chessboard component API', () => {
	beforeEach(() => {
		vi.stubGlobal('ResizeObserver', ResizeObserverMock);
	});

	afterEach(() => {
		cleanup();
		vi.unstubAllGlobals();
	});

	it('renders the initial position and retains its imperative methods', () => {
		const { component, container } = render(Chessboard, { props: { config: {} } });

		expect(container.querySelectorAll('[id^="w"], [id^="b"]')).toHaveLength(32);
		expect(component.getShortFEN()).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');

		component.movePiece('e2e4', false);
		expect(component.getPieceNameFromSquare('e2')).toBeUndefined();
		expect(component.getPieceNameFromSquare('e4')).toBe('wP');

		component.highlightSquare('e4', 'SELECT');
		expect(component.getState().markedSquares.size).toBe(1);
		component.clearAllSquares();
		expect(component.getState().markedSquares.size).toBe(0);
	});

	it('keeps highlights aligned with board-relative square positions', async () => {
		const { component, container } = render(Chessboard, { props: { config: {} } });

		component.highlightSquare('h1', 'CHECK');
		await tick();

		const highlight = container.querySelector<HTMLElement>('.check');
		expect(highlight?.style.left).toBe('87.5%');
		expect(highlight?.style.top).toBe('87.5%');
		expect(highlight?.style.translate).toBe('');

		component.flipBoard(true);
		await tick();

		expect(highlight?.style.left).toBe('0%');
		expect(highlight?.style.top).toBe('0%');
	});

	it('preserves the public custom event contract', () => {
		const onPieceClick = vi.fn();
		const { container } = render(ChessboardEventHarness, { props: { onpiececlick: onPieceClick } });

		const piece = container.querySelector('#wP4');
		expect(piece).not.toBeNull();
		const event = new MouseEvent('pointerdown', { bubbles: true, button: 0 });
		Object.defineProperties(event, {
			isPrimary: { value: true },
			pointerType: { value: 'mouse' },
			offsetX: { value: 0 },
			offsetY: { value: 0 }
		});
		piece?.dispatchEvent(event);

		expect(onPieceClick).toHaveBeenCalledTimes(1);
		expect(onPieceClick.mock.calls[0]?.[0].detail.piece).toMatchObject({
			id: 'wP4',
			square: 'e2',
			name: 'wP'
		});
	});

	it('opens promotion when an enemy piece is clicked', async () => {
		const { component, container } = render(Chessboard, { props: { config: promotionConfig } });
		component.setSize(800);
		const board = container.querySelector<HTMLElement>('.board');
		const pawn = container.querySelector<HTMLElement>('#wP0');
		expect(board).not.toBeNull();
		expect(pawn).not.toBeNull();
		if (!board || !pawn) return;
		board.getBoundingClientRect = () => ({ left: 0, top: 0, width: 800, height: 800 }) as DOMRect;

		pawn.dispatchEvent(pointerDown(650, 150));
		await tick();
		expect(component.getState().selectedPiece?.square).toBe('g7');
		board.dispatchEvent(pointerDown(750, 50));
		await tick();

		const promotionOptions = [...container.querySelectorAll('.promotion-menu button')];
		expect(promotionOptions).toHaveLength(4);
		expect(promotionOptions.map((option) => option.getAttribute('aria-label'))).toEqual([
			'Promote to queen',
			'Promote to knight',
			'Promote to rook',
			'Promote to bishop'
		]);
		expect(container.querySelector<HTMLElement>('.promotion-menu')?.style.left).toBe('87.5%');
		expect(container.querySelector<HTMLElement>('.promotion-menu')?.style.top).toBe('0%');
		expect(component.getPieceNameFromSquare('g7')).toBe('wP');
		expect(component.getPieceNameFromSquare('h8')).toBe('bR');
	});

	it('does not select a promotion piece from the touch gesture that opened the chooser', async () => {
		const { component, container } = render(Chessboard, { props: { config: promotionConfig } });
		component.setSize(800);
		const board = container.querySelector<HTMLElement>('.board');
		const pawn = container.querySelector<HTMLElement>('#wP0');
		expect(board).not.toBeNull();
		expect(pawn).not.toBeNull();
		if (!board || !pawn) return;
		board.getBoundingClientRect = () => ({ left: 0, top: 0, width: 800, height: 800 }) as DOMRect;

		pawn.dispatchEvent(pointerEvent('pointerdown', 650, 150, 'touch'));
		await tick();
		board.dispatchEvent(pointerEvent('pointerdown', 750, 50, 'touch'));
		await tick();

		const queen = container.querySelector<HTMLButtonElement>('[aria-label="Promote to queen"]');
		expect(queen).not.toBeNull();
		queen?.dispatchEvent(pointerEvent('pointerup', 750, 50, 'touch'));
		queen?.dispatchEvent(new MouseEvent('click', { bubbles: true, button: 0 }));
		await tick();

		expect(container.querySelector('.promotion-menu')).not.toBeNull();
		expect(component.getPieceNameFromSquare('g7')).toBe('wP');
		expect(component.getPieceNameFromSquare('h8')).toBe('bR');

		queen?.click();
		await tick();
		expect(component.getPieceNameFromSquare('h8')).toBe('wQ');
	});

	it('cancels promotion by clicking outside the chooser', async () => {
		const { component, container } = render(Chessboard, { props: { config: promotionConfig } });
		component.makeMovePromotion('g7h8');
		await tick();
		expect(container.querySelector('.promotion-menu')).not.toBeNull();

		container.querySelector<HTMLElement>('.promotion-layer')?.dispatchEvent(pointerDown(400, 400));
		await tick();

		await waitFor(() => expect(container.querySelector('.promotion-menu')).toBeNull());
		expect(component.getPieceNameFromSquare('g7')).toBe('wP');
		expect(component.getPieceNameFromSquare('h8')).toBe('bR');
		expect(component.getState().selectedPiece).toBeUndefined();
	});

	it('keeps the promotion chooser attached to its square when the board flips', async () => {
		const { component, container } = render(Chessboard, { props: { config: promotionConfig } });
		component.makeMovePromotion('g7h8');
		await tick();

		component.flipBoard(true);
		await tick();

		const menu = container.querySelector<HTMLElement>('.promotion-menu');
		expect(menu?.style.left).toBe('0%');
		expect(menu?.style.top).toBe('50%');
		expect(menu?.classList.contains('opens-up')).toBe(true);
	});

	it('cancels promotion with Escape', async () => {
		const { component, container } = render(Chessboard, { props: { config: promotionConfig } });
		component.makeMovePromotion('g7h8');
		await tick();

		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		await tick();

		await waitFor(() => expect(container.querySelector('.promotion-menu')).toBeNull());
		expect(component.getPieceNameFromSquare('g7')).toBe('wP');
		expect(component.getPieceNameFromSquare('h8')).toBe('bR');
	});

	it('selects a promotion piece with its keyboard shortcut', async () => {
		const { component, container } = render(Chessboard, { props: { config: promotionConfig } });
		component.makeMovePromotion('g7h8');
		await tick();

		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'n', bubbles: true }));
		await tick();

		expect(component.getPieceNameFromSquare('g7')).toBeUndefined();
		expect(component.getPieceNameFromSquare('h8')).toBe('wN');
		await waitFor(() => expect(container.querySelector('.promotion-menu')).toBeNull());
	});

	it('automatically promotes a pawn premove to a queen', async () => {
		let promotionIsLegal = false;
		const afterMove = vi.fn((move: string) => {
			if (move === 'e8e7') promotionIsLegal = true;
		});
		const config = {
			board: { startFen: '4k2r/6P1/8/8/8/8/8/4K3 b - - 0 1' },
			movable: 'WHITE',
			draggable: true,
			selectable: true,
			legal: { enabled: true, preMoves: true },
			callbacks: {
				getWhiteToMove: () => false,
				getLegalMoves: () => (promotionIsLegal ? ['g7h8q'] : []),
				getPreMoves: () => ['g7h8'],
				afterMove
			}
		} as const;
		const { component, container } = render(Chessboard, { props: { config } });
		component.setSize(800);
		const board = container.querySelector<HTMLElement>('.board');
		const pawn = container.querySelector<HTMLElement>('#wP0');
		expect(board).not.toBeNull();
		expect(pawn).not.toBeNull();
		if (!board || !pawn) return;
		board.getBoundingClientRect = () => ({ left: 0, top: 0, width: 800, height: 800 }) as DOMRect;

		pawn.dispatchEvent(pointerDown(650, 150));
		await tick();
		board.dispatchEvent(pointerDown(750, 50));
		await tick();
		expect(component.getState().legal.preMoves.curMove).toBe('g7h8q');

		component.makeMove('e8e7');
		await tick();
		await tick();

		expect(component.getPieceNameFromSquare('h8')).toBe('wQ');
		expect(afterMove).toHaveBeenLastCalledWith('g7h8q');
	});

	it('removes the drag ghost after a pointer drag promotion', async () => {
		const { component, container } = render(Chessboard, { props: { config: promotionConfig } });
		component.setSize(800);
		const board = container.querySelector<HTMLElement>('.board');
		const pieceLayer = container.querySelector<HTMLElement>('.board > div');
		const pawn = container.querySelector<HTMLElement>('#wP0');
		expect(board).not.toBeNull();
		expect(pieceLayer).not.toBeNull();
		expect(pawn).not.toBeNull();
		if (!board || !pieceLayer || !pawn) return;
		board.getBoundingClientRect = () =>
			({ x: 0, y: 0, left: 0, top: 0, width: 800, height: 800 }) as DOMRect;
		pieceLayer.getBoundingClientRect = () => board.getBoundingClientRect();
		Object.defineProperty(pieceLayer, 'clientWidth', { value: 800 });
		Object.defineProperties(pawn, {
			offsetWidth: { value: 100 },
			offsetHeight: { value: 100 }
		});
		pawn.getBoundingClientRect = () =>
			({ x: 600, y: 100, left: 600, top: 100, width: 100, height: 100 }) as DOMRect;

		pawn.dispatchEvent(pointerDown(650, 150));
		window.dispatchEvent(pointerEvent('pointermove', 750, 50));
		window.dispatchEvent(pointerEvent('pointerup', 750, 50));
		await tick();
		expect(container.querySelector('.ghost')).toBeNull();

		container.querySelector<HTMLButtonElement>('[aria-label="Promote to bishop"]')?.click();
		await tick();
		expect(component.getPieceNameFromSquare('h8')).toBe('wB');
		expect(container.querySelector('#wP0')).toBeNull();
	});
});

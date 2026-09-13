import { vi } from 'vitest';

Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn()
	}))
});

Object.defineProperty(Element.prototype, 'animate', {
	writable: true,
	value: vi.fn(() => {
		let finishHandler: ((event: AnimationPlaybackEvent) => void) | null = null;
		return {
			cancel: vi.fn(),
			currentTime: 0,
			get onfinish() {
				return finishHandler;
			},
			set onfinish(handler: ((event: AnimationPlaybackEvent) => void) | null) {
				finishHandler = handler;
				if (handler) queueMicrotask(() => handler(new Event('finish') as AnimationPlaybackEvent));
			},
			playState: 'finished'
		} as unknown as Animation;
	})
});

HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve());
HTMLMediaElement.prototype.pause = vi.fn();

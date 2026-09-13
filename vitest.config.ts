import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		conditions: ['browser']
	},
	test: {
		environment: 'jsdom',
		clearMocks: true,
		include: ['src/**/*.test.ts'],
		setupFiles: ['./vitest.setup.ts']
	}
});

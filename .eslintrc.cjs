module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: ['airbnb', 'airbnb-typescript', 'prettier'],
	plugins: ['svelte3', '@typescript-eslint', 'prettier'],
	ignorePatterns: ['*.cjs', '*.js', 'node_modules', 'build', 'static'],
	overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
	settings: {
		'svelte3/typescript': () => require('typescript'),
		'svelte3/ignore-styles': () => true.valueOf
	},
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		tsconfigRootDir: __dirname,
		project: './tsconfig.json'
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	rules: {
		'import/extensions': 'off',
		'no-nested-ternary': 'off',
		'no-plusplus': 'off',
		'import/no-extraneous-dependencies': 'off',
		'no-continue': 'off',
		'import/no-unresolved': 'off',
		'import/no-mutable-exports': 'off'
	}
};

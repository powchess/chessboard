module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: [
		'airbnb-base',
		'airbnb-typescript/base',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
		'plugin:svelte/recommended'
	],
	plugins: ['@typescript-eslint', 'prettier'],
	ignorePatterns: ['*.cjs', '*.js', 'node_modules', 'build', 'static', 'dist'],
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			},
			rules: {
				'import/no-unresolved': 'off',
				'import/no-extraneous-dependencies': 'off',
				'import/no-mutable-exports': 'off',
				'import/newline-after-import': 'error',
				'@typescript-eslint/no-unused-expressions': 'off',
				'no-sequences': 'off',
				'no-self-assign': 'off',
				'no-undef-init': 'off'
			}
		}
	],
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		tsconfigRootDir: __dirname,
		project: './tsconfig.json',
		extraFileExtensions: ['.svelte']
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
		'no-restricted-exports': 'off',
		'no-continue': 'off',
		'no-restricted-syntax': 'off',
		'no-underscore-dangle': 'off',
		'import/prefer-default-export': 'off',
		'@typescript-eslint/no-use-before-define': 'off'
	}
};

import cfg from '@neovici/cfg/eslint/index.mjs';

export default [
	...cfg,
	{
		rules: {
			'valid-jsdoc': 'off',
		},
	},
	{
		files: ['test/**/*.js'],
		rules: {
			'mocha/max-top-level-suites': 'off',
			'mocha/no-top-level-hooks': 'off',
			'mocha/no-identical-title': 'warn',
			'mocha/no-pending-tests': 'off',
		},
	},
	{ ignores: ['coverage/**'] },
];

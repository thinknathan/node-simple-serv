// @ts-check

import eslint from '@eslint/js';
import globals from 'globals';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
	eslint.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},
];

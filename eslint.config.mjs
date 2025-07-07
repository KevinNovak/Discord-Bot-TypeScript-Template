import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';

var customConfig = defineConfig([
    globalIgnores([
        '.cache',
        '.git',
        'dist',
        'docs',
        'eslint.config.mjs',
        'misc',
        'node_modules',
        'temp',
    ]),
    {
        plugins: {
            unicorn: eslintPluginUnicorn,
        },
        rules: {
            '@typescript-eslint/explicit-function-return-type': [
                'error',
                {
                    allowExpressions: true,
                },
            ],
            '@typescript-eslint/no-deprecated': 'warn',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/no-inferrable-types': [
                'error',
                {
                    ignoreParameters: true,
                },
            ],
            '@typescript-eslint/no-misused-promises': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-enum-comparison': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-var-requires': 'off',
            '@typescript-eslint/only-throw-error': 'off',
            '@typescript-eslint/require-await': 'off',
            '@typescript-eslint/restrict-template-expressions': 'off',
            '@typescript-eslint/return-await': ['error', 'always'],
            '@typescript-eslint/typedef': [
                'error',
                {
                    parameter: true,
                    propertyDeclaration: true,
                },
            ],
            '@typescript-eslint/unbound-method': 'off',
            'import/extensions': ['error', 'ignorePackages'],
            'import/no-extraneous-dependencies': 'error',
            'import/no-unresolved': 'off',
            'import/no-useless-path-segments': 'error',
            'import/order': [
                'error',
                {
                    alphabetize: {
                        caseInsensitive: true,
                        order: 'asc',
                    },

                    groups: [
                        ['builtin', 'external', 'object', 'type'],
                        ['internal', 'parent', 'sibling', 'index'],
                    ],

                    'newlines-between': 'always',
                },
            ],
            'no-return-await': 'off',
            'no-unused-vars': 'off',
            'prefer-const': 'off',
            quotes: [
                'error',
                'single',
                {
                    allowTemplateLiterals: true,
                },
            ],
            'sort-imports': [
                'error',
                {
                    allowSeparatedGroups: true,
                    ignoreCase: true,
                    ignoreDeclarationSort: true,
                    ignoreMemberSort: false,
                    memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
                },
            ],
            'unicorn/prefer-node-protocol': 'error',
        },
    },
]);

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: import.meta.dirname,
                project: ['./tsconfig.json', './tsconfig.test.json'],
            },
        },
    },
    importPlugin.flatConfigs.recommended,
    importPlugin.flatConfigs.typescript,
    customConfig
);

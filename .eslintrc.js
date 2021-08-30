module.exports = {
    extends: ['eslint:recommended', 'prettier', 'plugin:prettier/recommended'],
    plugins: ['prettier'], // activating esling-plugin-prettier (--fix stuff)
    parser: '@babel/eslint-parser',
    env: {
        browser: true,
        node: true,
    },
    parserOptions: {
        sourceType: 'module',
        allowImportExportEverywhere: false,
        ecmaFeatures: {
            globalReturn: false,
        },
    },
    rules: {
        'no-console': 0,
        'prettier/prettier': [
            // customizing prettier rules (unfortunately not many of them are customizable)
            'error',
            {
                endOfLine: 'auto',
                singleQuote: true,
                trailingComma: 'all',
            },
        ],
        eqeqeq: ['error', 'always'], // adding some custom ESLint rules
    },
}

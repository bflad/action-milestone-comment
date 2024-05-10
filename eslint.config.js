const js = require('@eslint/js');
const jest = require('eslint-plugin-jest');

module.exports = [
    {
        ignores: ["dist/**", "node_modules/**"],
    },
    {
        files: ["**/*.js"],
        languageOptions: {
            globals: {
                __dirname: "readonly",
            },
            sourceType: "commonjs",
        },
        rules: {
            ...js.configs.recommended.rules,
        },
    },
    {
        files: ["**/*.test.js"],
        languageOptions: {
            sourceType: "commonjs",
        },
        plugins: {
            jest: jest,
        },
        rules: {
            ...jest.configs["flat/recommended"].rules,
        },
    },
];

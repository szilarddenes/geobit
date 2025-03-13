module.exports = {
    root: true,
    env: {
        es6: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "google",
    ],
    rules: {
        quotes: ["error", "double"],
    },
    parserOptions: {
        ecmaVersion: 2020,
    },
    overrides: [
        {
            files: ["*.ts"],
            extends: [
                "eslint:recommended",
                "plugin:@typescript-eslint/recommended",
            ],
            parser: "@typescript-eslint/parser",
            plugins: [
                "@typescript-eslint",
            ],
            rules: {
                "@typescript-eslint/no-explicit-any": "off",
                "quotes": ["error", "single"],
            },
        },
    ],
}; 
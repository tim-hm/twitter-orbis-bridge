module.exports = {
    root: true,
    extends: ["@tim-hm/eslint-config"],
    parserOptions: {
        project: "./tsconfig.json",
    },
    settings: {
        "import/internal-regex": "^@tob",
    },
    rules: {
        "import/order": [
            "warn",
            {
                "newlines-between": "always",
                alphabetize: {
                    order: "asc",
                },
                groups: [
                    "builtin",
                    "external",
                    "internal",
                    "parent",
                    "sibling",
                    "index",
                ],
            },
        ],
    },
}

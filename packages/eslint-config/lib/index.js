module.exports = {
  settings: {
    "import/internal-regex": "^@tob",
  },
  overrides: [
    {
      files: ["*.ts"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint", "import"],
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
      ],
      rules: {
        "import/order": [
          "warn",
          {
            "newlines-between": "always",
            alphabetize: {
              order: "asc",
            }
          },
        ],
        "eol-last": ["warn"],
        "no-console": ["warn"],
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            args: "none",
          },
        ],
        "@typescript-eslint/explicit-function-return-type": [
          "warn",
          {
            allowExpressions: true,
          },
        ],
      },
    },
    {
      files: ["*.js"],
      parser: "@babel/eslint-parser",
      parserOptions: {
        requireConfigFile: false,
      },
      env: {
        browser: true,
        jest: true,
        node: true,
      },
    },
  ],
}

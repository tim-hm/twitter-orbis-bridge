module.exports = {
  overrides: [
    {
      files: ["*.ts"],
      parser: "@typescript-eslint/parser",
      extends: ["prettier", "plugin:@typescript-eslint/recommended"],
      plugins: ["@typescript-eslint"],
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

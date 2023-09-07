import baseConfig from "../../eslint.config.js";

export default [
  ...baseConfig,
  {
    files: [
      "packages/use/**/*.ts",
      "packages/use/**/*.tsx",
      "packages/use/**/*.js",
      "packages/use/**/*.jsx",
    ],
    rules: {},
  },
  {
    files: ["packages/use/**/components/**/*.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": ["off"],
      "@typescript-eslint/no-empty-function": ["off"],
    },
  },
  {
    files: ["packages/use/**/*.js", "packages/use/**/*.jsx"],
    rules: {},
  },
];

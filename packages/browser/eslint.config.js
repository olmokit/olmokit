import baseConfig from "../../eslint.config.js";

export default [
  ...baseConfig,
  {
    files: [
      "packages/browser/**/*.ts",
      "packages/browser/**/*.tsx",
      "packages/browser/**/*.js",
      "packages/browser/**/*.jsx",
    ],
    rules: {},
  },
  {
    files: ["packages/browser/**/*.ts", "packages/browser/**/*.tsx"],
    rules: {},
  },
  {
    files: ["packages/browser/**/*.js", "packages/browser/**/*.jsx"],
    rules: {},
  },
];

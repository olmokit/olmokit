import baseConfig from "../../eslint.config.js";

export default [
  ...baseConfig,
  {
    files: [
      "packages/browser/src/**/*.ts",
      "packages/browser/src/**/*.tsx",
      "packages/browser/src/**/*.js",
      "packages/browser/src/**/*.jsx",
    ],
    rules: {},
  },
  {
    files: ["packages/browser/src/**/*.ts", "packages/browser/src/**/*.tsx"],
    rules: {},
  },
  {
    files: ["packages/browser/src/**/*.js", "packages/browser/src/**/*.jsx"],
    rules: {},
  },
];

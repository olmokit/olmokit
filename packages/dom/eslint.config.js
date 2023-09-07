import baseConfig from "../../eslint.config.js";

export default [
  ...baseConfig,
  {
    files: [
      "packages/dom/**/*.ts",
      "packages/dom/**/*.tsx",
      "packages/dom/**/*.js",
      "packages/dom/**/*.jsx",
    ],
    rules: {},
  },
  {
    files: ["packages/dom/**/*.ts", "packages/dom/**/*.tsx"],
    rules: {},
  },
  {
    files: ["packages/dom/**/*.js", "packages/dom/**/*.jsx"],
    rules: {},
  },
];

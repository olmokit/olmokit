import baseConfig from "../../eslint.config.js";

export default [
  ...baseConfig,
  {
    files: [
      "packages/utils/**/*.ts",
      "packages/utils/**/*.tsx",
      "packages/utils/**/*.js",
      "packages/utils/**/*.jsx",
    ],
    rules: {},
  },
  {
    files: ["packages/utils/**/*.ts", "packages/utils/**/*.tsx"],
    rules: {},
  },
  {
    files: ["packages/utils/**/*.js", "packages/utils/**/*.jsx"],
    rules: {},
  },
];

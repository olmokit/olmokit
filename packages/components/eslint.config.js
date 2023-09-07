import baseConfig from "../../eslint.config.js";

export default [
  ...baseConfig,
  {
    files: [
      "packages/components/**/*.ts",
      "packages/components/**/*.tsx",
      "packages/components/**/*.js",
      "packages/components/**/*.jsx",
    ],
    rules: {},
  },
  {
    files: ["packages/components/**/*.ts", "packages/components/**/*.tsx"],
    rules: {},
  },
  {
    files: ["packages/components/**/*.js", "packages/components/**/*.jsx"],
    rules: {},
  },
];

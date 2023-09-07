import baseConfig from "../../eslint.config.js";

export default [
  ...baseConfig,
  {
    files: [
      "packages/create-app/**/*.ts",
      "packages/create-app/**/*.tsx",
      "packages/create-app/**/*.js",
      "packages/create-app/**/*.jsx",
    ],
    rules: {},
  },
  {
    files: ["packages/create-app/**/*.ts", "packages/create-app/**/*.tsx"],
    rules: {},
  },
  {
    files: ["packages/create-app/**/*.js", "packages/create-app/**/*.jsx"],
    rules: {},
  },
];

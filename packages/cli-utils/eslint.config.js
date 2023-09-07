import baseConfig from "../../eslint.config.js";

export default [
  ...baseConfig,
  {
    files: ["packages/cli-utils/**/*.ts"],
    rules: {},
  },
];

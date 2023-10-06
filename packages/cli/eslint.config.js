import baseConfig from "../../eslint.config.js";

export default [
  ...baseConfig,
  {
    files: ["packages/cli/src/**/*.ts"],
    rules: {
      "import/extensions": ["error", "always", { ignorePackages: true }],
    },
  },
  { ignores: ["packages/cli/src/**/*.spec.ts"] },
];

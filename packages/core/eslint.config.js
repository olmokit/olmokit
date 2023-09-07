import baseConfig from "../../eslint.config.js";

export default [
  ...baseConfig,
  {
    files: [
      "packages/core/**/*.ts",
      "packages/core/**/*.tsx",
      "packages/core/**/*.js",
      "packages/core/**/*.jsx",
    ],
    rules: { "@typescript-eslint/no-unused-vars": ["warn"] },
  },
  {
    files: ["packages/core/**/*.ts", "packages/core/**/*.tsx"],
    rules: {},
  },
  {
    files: ["packages/core/**/*.js", "packages/core/**/*.jsx"],
    rules: {},
  },
  {
    files: ["packages/core/package.json"],
    rules: {
      "@nx/dependency-checks": [
        "error",
        {
          ignoredDependencies: ["videojs-font"],
        },
      ],
    },
  },
];

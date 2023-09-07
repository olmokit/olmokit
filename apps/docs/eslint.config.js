import baseConfig from "../../eslint.config.js";

// const baseConfig = require("../../eslint.config.js");

export default [
  // module.exports = [
  ...baseConfig,
  {
    files: [
      "apps/docs/**/*.ts",
      "apps/docs/**/*.tsx",
      "apps/docs/**/*.js",
      "apps/docs/**/*.jsx",
    ],
    rules: {},
  },
  {
    files: ["apps/docs/**/*.ts", "apps/docs/**/*.tsx"],
    rules: {},
  },
  {
    files: ["apps/docs/**/*.js", "apps/docs/**/*.jsx"],
    rules: {},
  },
  {
    files: ["packages/core/package.json"],
    rules: {
      "@nx/dependency-checks": [
        "error",
        {
          ignoredDependencies: [
            "@docusaurus/preset-classic",
            "@mdx-js/react",
            "clsx",
            "react",
            "react-dom",
            "react-player",
          ],
        },
      ],
    },
  },
];

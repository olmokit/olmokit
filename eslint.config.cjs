const { FlatCompat } = require("@eslint/eslintrc");
const nxEslintPlugin = require("@nx/eslint-plugin");
const eslintPluginImport = require("eslint-plugin-import");
const js = require("@eslint/js");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const config = [
  ...baseConfig,
  {
    plugins: {
      "@nx": nxEslintPlugin,
      import: eslintPluginImport,
    },
  },
  ...compat.config({ parser: "jsonc-eslint-parser" }).map((config) => ({
    ...config,
    files: ["**/*.json"],
    rules: { "@nx/dependency-checks": "error" },
  })),
  {
    files: ["src/**/*.ts", "src/**/*.tsx", "src/**/*.js", "src/**/*.jsx"],
    rules: {
      "@nx/enforce-module-boundaries": [
        "error",
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: "*",
              onlyDependOnLibsWithTags: ["*"],
            },
          ],
        },
      ],
    },
  },
  ...compat.config({ extends: ["plugin:@nx/typescript"] }).map((config) => ({
    ...config,
    files: ["src/**/*.ts", "src/**/*.tsx"],
    rules: {
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  })),
  ...compat.config({ extends: ["plugin:@nx/javascript"] }).map((config) => ({
    ...config,
    files: ["src/**/*.js", "src/**/*.jsx"],
    rules: {},
  })),
  ...compat.config({ env: { jest: true } }).map((config) => ({
    ...config,
    files: ["src/**/*.spec.ts", "src/**/*.spec.tsx", "src/**/*.spec.js", "src/**/*.spec.jsx"],
    rules: {},
  })),
  {
    files: ["src/**/*.ts"],
    rules: {
      "import/no-duplicates": ["error"],
      "import/order": [
        "error",
        {
          pathGroups: [
            {
              pattern: "@olmokit/**",
              group: "internal",
            },
          ],
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
        },
      ],
    },
  },
];

exports.default = config;

module.exports = config;
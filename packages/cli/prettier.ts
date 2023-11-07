import type { Config } from "prettier";

/**
 * @see https://prettier.io/docs/en/options
 */
const basic: Config = {
  tabWidth: 2,
};

/**
 * @see https://prettier.io/docs/en/plugins
 */
const plugins: Config["plugins"] = [
  "@prettier/plugin-php",
  "@trivago/prettier-plugin-sort-imports",
  "@shufo/prettier-plugin-blade",
];

/**
 * @see https://github.com/prettier/plugin-php
 */
const overridesPhp: NonNullable<Config["overrides"]>[number] = {
  files: "*.php",
  options: {
    singleQuote: true,
    tabWidth: 4,
  },
};

/**
 * @see https://github.com/shufo/prettier-plugin-blade#prettierrc-example
 */
const overridesBlade: NonNullable<Config["overrides"]>[number] = {
  files: ["*.blade.php"],
  options: {
    parser: "blade",
    tabWidth: 2,
    // @ts-expect-error Custom plugin option
    wrapAttributes: "force-expand-multiline",
    sortHtmlAttributes: "code-guide",
  },
};

const overrides: Config["overrides"] = [overridesPhp, overridesBlade];

/**
 * @see https://github.com/trivago/prettier-plugin-sort-imports
 */
const importOrderBasic = {
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
};

/**
 * @see https://github.com/trivago/prettier-plugin-sort-imports
 */
const importOrder: string[] = [
  "^node:(.*)$",
  "^react$",
  "^next$",
  "<THIRD_PARTY_MODULES>",
  "^@olmokit/utils(.*)$",
  "^@olmokit/cli(.*)$",
  "^@olmokit/cli-utils(.*)$",
  "^@olmokit/dom(.*)$",
  "^@olmokit/browser(.*)$",
  "^@olmokit/core(?!.*[.]scss$)[./].*$",
  "^@olmokit/core(.*).scss$",
  "^@olmokit/components(?!.*[.]scss$)[./].*$",
  "^@olmokit/components(.*).scss$",
  "^~/(?!.*[.]scss$)[./].*$",
  "^~/(.*).scss$",
  "^@/(?!.*[.]scss$)[./].*$",
  "^@/(.*).scss$",
  "^assets(.*).scss$",
  "^assets(?!.*[.]scss$)[./].*$",
  "^assets(.*).scss$",
  "^vendor(?!.*[.]scss$)[./].*$",
  "^vendor(.*).scss$",
  "^config(?!.*[.]scss$)[./].*$",
  "^config(.*).scss$",
  "^utils(?!.*[.]scss$)[./].*$",
  "^utils(.*).scss$",
  "^layouts(?!.*[.]scss$)[./].*$",
  "^layouts(.*).scss$",
  "^routes(?!.*[.]scss$)[./].*$",
  "^routes(.*).scss$",
  "^components(?!.*[.]scss$)[./].*$",
  "^components(.*).scss$",
  "^(?!.*[.]scss$)[./].*$",
  ".scss$",
];

/**
 * @see https://prettier.io/docs/en/options
 */
const config = {
  ...basic,
  plugins,
  overrides,
  ...importOrderBasic,
  importOrder,
};

/**
 * @see https://prettier.io/docs/en/options
 */
const defineConfig = (customConfig: Config = {} as Config) => ({
  ...config,
  ...customConfig,
});

export {
  basic,
  plugins,
  overridesPhp,
  overridesBlade,
  overrides,
  importOrderBasic,
  importOrder,
  config,
  defineConfig,
};

export default defineConfig;

// module.exports.basic = basic;
// module.exports.plugins = plugins;
// module.exports.overridesPhp = overridesPhp;
// module.exports.overrides = overrides;
// module.exports.importOrderBasic = importOrderBasic;
// module.exports.importOrder = importOrder;
// module.exports.config = config;
// module.exports.defineConfig = defineConfig;
// module.exports = defineConfig;

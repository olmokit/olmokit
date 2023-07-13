import { createRequire } from "node:module";
import type { Options as SWCOptions } from "@swc/core";
import type { RuleSetRule } from "webpack";
import { meta } from "../../meta.js";

const require = createRequire(import.meta.url);

export default () => {
  const rules: RuleSetRule[] = [
    {
      test: /\.(js|mjs|jsx|ts|tsx)$/,
      // https://webpack.js.org/configuration/module/#resolvefullyspecified
      resolve: {
        fullySpecified: false,
      },
      // NOTE: excluding all node_modules but ours as they break compilation
      // dure to the missing `.js` imports. This regex accounts for deeply
      // nested pnpm node_modules paths. Note, eslint is not right here, that
      // slash makes a difference. Tests at https://regex101.com/r/a25mZe/1
      // eslint-disable-next-line no-useless-escape
      exclude: new RegExp(`node_modules(?!.*\/(${meta.orgScope})).*`),
      use: {
        // `.swcrc` can be used to configure swc
        loader: require.resolve("swc-loader"),
        options: {
          jsc: {
            // FIXME: use browserlist here!
            target: "es2022",
            parser: {
              syntax: "typescript",
              dynamicImport: true,
            },
            loose: true,
            minify: {
              compress: true,
              mangle: true,
            },
            keepClassNames: false,
          },
          minify: process.env["NODE_ENV"] === "production",
        } satisfies SWCOptions,
      },
    },
  ];

  return rules;
};

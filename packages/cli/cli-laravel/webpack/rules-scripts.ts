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
      // FIXME: excluding all node_modules but ours as they break compilation
      // dure to the missing `.js` imports
      exclude: new RegExp(`node_modules(?!/(${meta.orgScope})).*`),
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

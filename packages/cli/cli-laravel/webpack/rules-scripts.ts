import { createRequire } from "node:module";
import type { Options as SWCOptions } from "@swc/core";
import type { RuleSetRule } from "webpack";

const require = createRequire(import.meta.url);

export default () => {
  const rules: RuleSetRule[] = [
    {
      test: /\.(js|mjs|jsx|ts|tsx)$/,
      // https://webpack.js.org/configuration/module/#resolvefullyspecified
      resolve: {
        fullySpecified: false,
      },
      // FIXME: excluding the node_modules would break compilation as there are
      // imports without the `.js` extensions inside and outside our packages
      // exclude: /(node_modules)/,
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
            externalHelpers:
              process.env["NODE_ENV"] === "production" ? false : true,
            keepClassNames: false,
          },
          minify: process.env["NODE_ENV"] === "production",
        } satisfies SWCOptions,
      },
    },
  ];

  return rules;
};

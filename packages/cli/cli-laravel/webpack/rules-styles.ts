/**
 * @file
 *
 * Follow these issues:
 * - [attrs option for MiniCssExtractPlugin](https://git.io/JU10P)
 */
import { createRequire } from "node:module";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import type { RuleSetRule } from "webpack";
import { laravelConfig } from "../helpers/dotenv.js";
import {
  getSassAdditionalData,
  getSassIncludePaths,
  getSassSharedResources,
} from "../helpers/sass.js";

const require = createRequire(import.meta.url);

export default () => {
  const rules: RuleSetRule[] = [
    {
      // sideEffects: true,
      test: /\.(css|sass|scss)$/,
      use: [
        process.env["NODE_ENV"] === "production"
          ? {
              loader: MiniCssExtractPlugin.loader,
              options: {
                // style-loader might be avoided and we might use just Mini... but
                // there is an issue with hmr, @see https://git.io/JU1RW
                // hmr: process.env["NODE_ENV"] === "development",
                // reloadAll: process.env["NODE_ENV"] === "development",
                // @see https://github.com/webpack-contrib/mini-css-extract-plugin#esmodule
                // @see https://github.com/webpack/webpack/issues/6741
                // esModule: process.env["NODE_ENV"] === "production" ? true : false,
                esModule: true,
              },
            }
          : // We have an issue with development environment where js execution that
            // depends on CSS effects happens before the CSS applies, hence we might need
            // in parts of our js to put code in a setTimeout during development
            // @see https://stackoverflow.com/a/49228202/1938970
            // @see https://github.com/webpack-contrib/style-loader/issues/121
            // cross ref this internal issue with FIXME: @styleloader
            {
              // FIXME: using tweaked custom style-loader, see https://git.io/JU1qO
              // loader: require.resolve("./style-loader"),
              loader: require.resolve("style-loader"),
              options: {
                esModule: false,
                // FIXME: see https://git.io/JU1qO
                // attributes: { id: '[path][name].[ext]'}
              },
            },
        {
          loader: require.resolve("css-loader"),
          options: {
            esModule: process.env["NODE_ENV"] === "production" ? true : false,
            sourceMap: laravelConfig("env.DEV_SOURCEMAPS"),
            modules: {
              mode: "icss",
            },
            importLoaders: 1, // @see https://git.io/fjEmR
          },
        },
        {
          loader: require.resolve("postcss-loader"),
          options: {
            // sourceMap,
            postcssOptions: () => ({
              plugins: [
                require.resolve("postcss-preset-env"),
                require.resolve("autoprefixer"),
                require.resolve("postcss-sort-media-queries"),
              ],
            }),
          },
        },
        // {
        //   // @see https://www.npmjs.com/package/resolve-url-loader
        //   loader: require.resolve("resolve-url-loader"),
        //   options: {},
        // },
        {
          loader: require.resolve("sass-loader"),
          options: {
            sourceMap: laravelConfig("env.DEV_SOURCEMAPS"),
            implementation: require("sass"),
            additionalData: getSassAdditionalData(),
            // webpackImporter: false,
            sassOptions: {
              includePaths: getSassIncludePaths(),
              // fiber: require("fibers"),
              quietDeps: true,
            },
          },
        },
        {
          loader: require.resolve("sass-resources-loader"),
          options: {
            resources: getSassSharedResources(),
            hoistUseStatements: true,
          },
        },
      ],
    },
  ];

  return rules;
};

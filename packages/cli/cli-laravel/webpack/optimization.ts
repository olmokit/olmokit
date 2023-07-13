// import { createRequire } from "node:module";
import TerserPlugin from "terser-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import type { JsMinifyOptions as SwcOptions } from "@swc/core";
import type { CliLaravel } from "../pm.js";

// const require = createRequire(import.meta.url);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const optimization = (config: CliLaravel.Config) => ({
  // minimize: false, // uncomment to debug builds
  minimizer:
    process.env["NODE_ENV"] === "production"
      ? [
          // @see https://webpack.js.org/plugins/terser-webpack-plugin/#swc
          // extractComments is not yet supported
          new TerserPlugin<SwcOptions>({
            minify: TerserPlugin.swcMinify,
            // exclude: /(video.js)/,
            terserOptions: {
              compress: {
                drop_console: process.env.APP_ENV !== "dev",
              },
            },
          }),
          // new (require("terser-webpack-plugin"))({
          //   extractComments: true,
          //   terserOptions: {
          //     compress: {
          //       drop_console: process.env.APP_ENV !== "dev",
          //     },
          //     output: {
          //       // the regex should match the one in "./helpers-getters.js" to
          //       // preserve the banner of the current project
          //       comments: new RegExp(
          //         `${config.project.title} v${config.project.packageJson.version}`
          //       ),
          //     },
          //     // mangle: {
          //     //   properties: {
          //     //     keep_quoted: true,
          //     //     regex: /^_/,
          //     //     reserved: [],
          //     //   }
          //     // }
          //   },
          // }),
          new CssMinimizerPlugin(),
          // new (require("css-minimizer-webpack-plugin"))(),
        ]
      : [],
  mangleWasmImports: true,
  // // when using HTTP/2 and long term caching
  // splitChunks: {
  //   chunks: "all",
  //   maxInitialRequests: 30,
  //   maxAsyncRequests: 30,
  //   maxSize: 100000
  // },
});

export default optimization;

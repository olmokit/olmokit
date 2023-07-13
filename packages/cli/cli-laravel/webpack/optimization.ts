import type { JsMinifyOptions as SwcOptions } from "@swc/core";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import type { CliLaravel } from "../pm.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const optimization = (config: CliLaravel.Config) => ({
  mangleWasmImports: true,
  minimizer:
    process.env["NODE_ENV"] === "production"
      ? [
          // @see https://webpack.js.org/plugins/terser-webpack-plugin/#swc
          // NOTE: extractComments is not yet supported
          new TerserPlugin<SwcOptions>({
            minify: TerserPlugin.swcMinify,
            terserOptions: {
              compress: {
                drop_console: process.env.APP_ENV !== "dev",
              },
              // output: {
              //   // the regex should match the one in "./helpers-getters.js" to
              //   // preserve the banner of the current project
              //   comments: new RegExp(
              //     `${config.project.title} v${config.project.packageJson.version}`
              //   ),
              // },
            },
          }),
          new CssMinimizerPlugin(),
        ]
      : [],
});

export default optimization;

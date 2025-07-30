import type { JsMinifyOptions as SwcOptions } from "@swc/core";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const optimization = () => ({
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
                drop_console: false,
              },
              // output: {
              //   // the regex should match the one in "./helpers-getters.js" to
              //   // preserve the banner of the current project
              //   comments: new RegExp(
              //     `${project.title} v${project.packageJson.version}`
              //   ),
              // },
            },
          }),
          new CssMinimizerPlugin(),
        ]
      : [],
});

export default optimization;

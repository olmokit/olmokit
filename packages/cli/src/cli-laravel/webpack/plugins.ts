import { createRequire } from "node:module";
import { join } from "node:path";
import CaseSensitivePathsPlugin from "case-sensitive-paths-webpack-plugin";
// import CleanWebpackPlugin from "clean-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
// import PostCSSAssetsPlugin from "postcss-assets-webpack-plugin";
import webpack from "webpack";
import { WebpackManifestPlugin } from "webpack-manifest-plugin";
import WorkboxPlugin from "workbox-webpack-plugin";
import { getBanner } from "../../helpers-getters.js";
import { getProjectJsGlobals } from "../helpers/index.js";
import { paths } from "../paths/index.js";
import type { CliLaravel } from "../pm.js";
import { getCopySetting, getOutputName } from "./helpers.js";

const require = createRequire(import.meta.url);

export default (config: CliLaravel.Config) => {
  // shared basic plugins
  let plugins = [
    new CaseSensitivePathsPlugin(),
    new webpack.DefinePlugin(
      getProjectJsGlobals(config).reduce(
        (output, def) => {
          output[def.name] = def.value;
          return output;
        },
        {} as Record<string, string | boolean>,
      ),
    ),
    new CopyPlugin({
      patterns: [
        // NOTE: when deploying to a CDN webpack does not resolve the URLs of
        // the fonts correctl, anyway we already use a versioned folder name in
        // the public path so there is no risk here in omitting the contenthash
        getCopySetting("fonts", process.env.CDN ? false : true),
        getCopySetting("images", false),
        getCopySetting("media", false),
      ],
    }),
  ];

  // non-production plugins
  if (process.env.NODE_ENV === "development") {
    // const CleanWebpackPlugin = require("clean-webpack-plugin");
    plugins = plugins.concat([
      // new webpack.HotModuleReplacementPlugin(),
      // new CleanWebpackPlugin({
      //   cleanStaleWebpackAssets: true,
      // }),
    ]);
  }

  // production plugins
  if (process.env.NODE_ENV === "production") {
    plugins = plugins.concat([
      new MiniCssExtractPlugin({
        filename: getOutputName("entry", "css"),
        chunkFilename: getOutputName("chunk", "css"),
        ignoreOrder: true,
      }),
      // TODO: check if this is still needed or if the postcss-sort-media-queries
      // in the rules-styles is enough
      // new PostCSSAssetsPlugin({
      //   test: /\.css$/,
      //   log: false,
      //   plugins: [require("postcss-sort-media-queries")()],
      // }),
      new WebpackManifestPlugin({
        // the public url is prepended in the `assets.blade.php` automated partial
        publicPath: "",
        // filter out license files
        filter: ({ name }) => !name.endsWith(".LICENSE.txt"),
      }),
      new webpack.BannerPlugin({
        banner: getBanner(),
        raw: true,
        entryOnly: true,
        exclude: /^vendors/,
      }),
    ]);
  }

  // NOTE: service worker does not work with cross origin URLs
  if (process.env.NODE_ENV === "production" && !process.env.CDN) {
    plugins.push(
      new WorkboxPlugin.GenerateSW({
        swDest: join(paths.frontend.dest.assets, "service-worker.js"),
        clientsClaim: true,
        skipWaiting: true,
        // exclude php files (like the favicons partial which goes through webpack
        // HTML plugin and therefore ends up in the webpack chunks handling)
        exclude: [/\.php$/],
      }),
    );
  }

  // env dependent plugins
  if (process.env.DEV_ANALYZE) {
    const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

    plugins = plugins.concat([
      new BundleAnalyzerPlugin({
        reportFilename: join(paths.frontend.dest.folders.assets, "stats.json"),
      }),
    ]);
  }

  return plugins;
};

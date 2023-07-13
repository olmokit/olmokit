import type { RuleSetRule } from "webpack";
import { paths } from "../paths/index.js";
import type { CliLaravel } from "../pm.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (config: CliLaravel.Config) => {
  const rules: RuleSetRule[] = [
    {
      test: /\.(woff2?|ttf|otf|eot)$/,
      type: "asset",
      generator: {
        filename: `${paths.frontend.dest.folders.fonts}/[name].[contenthash][ext]`,
      },
    },
    {
      test: /\.(mp4|wav|mp3|ogg)$/i,
      type: "asset",
      generator: {
        filename: `${paths.frontend.dest.folders.media}/[name].[contenthash][ext]`,
      },
    },
    {
      test: /\.(gif|png|jpe?g|svg)$/i,
      type: "asset",
      generator: {
        filename: `${paths.frontend.dest.folders.images}/[name].[contenthash][ext]`,
      },
    },
  ];

  return rules;
};

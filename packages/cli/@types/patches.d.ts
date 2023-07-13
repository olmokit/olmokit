/* eslint-disable @typescript-eslint/prefer-namespace-keyword */
declare module NodeJS {
  type PredefinedEnvVars = import("../config-env").PredefinedEnvVars;

  interface ProcessEnv extends PredefinedEnvVars {
    NODE_ENV?: "development" | "production";
  }
}

declare module "copy-webpack-plugin";
// declare module "postcss-assets-webpack-plugin";
declare module "workbox-webpack-plugin";

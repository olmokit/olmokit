import type { Configuration } from "webpack-dev-server";
import { isHttps, removeTrailingSlashes } from "../../helpers-getters.js";
import { getPublicUrls } from "../helpers/index.js";
import { getServerHost, getServerPort } from "./helpers.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function webpackConfigDevServer() {
  const configuration: Configuration = {
    devMiddleware: {
      publicPath: getPublicUrls().assets,
      // needed for copy-webpack-plugin and images/media files
      // writeToDisk: true,
      writeToDisk: (filePath) => {
        // match everyhting but js/css
        return /^(.(?!\.js|\.css$))+$/.test(filePath);
      },      
    },
    client: {
      webSocketURL: {
        port: getServerPort(),
      },
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    liveReload: false,
    host: getServerHost(),
    port: getServerPort(),
    https: isHttps(),
    allowedHosts: "all",    
    proxy: {
      "*": {
        target: removeTrailingSlashes(process.env.APP_URL), // target host
        changeOrigin: true, // needed for virtual hosted sites
      },
    },
    setupExitSignals: true,
  };
  return configuration;
}

export default webpackConfigDevServer;

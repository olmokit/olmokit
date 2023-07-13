import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Configuration } from "webpack";
import { isUsingLocalLinkedNodeModule } from "../../helpers-getters.js";
import { meta } from "../../meta.js";
import { getLibraries } from "../helpers/libraries.js";
import { paths } from "../paths/index.js";
import type { CliLaravel } from "../pm.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

/**
 * @see https://webpack.js.org/configuration/resolve/#resolvesymlinks
 * @see https://webpack.js.org/configuration/resolve/#resolvemodules
 *
 * TODO: verify that all this is needed and that it works with pnpm
 */
export default (config: CliLaravel.Config): Configuration["resolve"] => {
  const modules = ["node_modules"];
  let symlinks = false;
  const { core: coreLibrary } = getLibraries(config);

  if (
    isUsingLocalLinkedNodeModule(meta.nodeModule) ||
    (coreLibrary.exists && isUsingLocalLinkedNodeModule(coreLibrary.path))
  ) {
    symlinks = true;
  }

  if (coreLibrary.pathNodeModules) {
    modules.push(coreLibrary.pathNodeModules);
  }

  return {
    modules,
    symlinks,
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      "~": resolve(__dirname, paths.frontend.src.base),
      // TODO: "@/" and "~" patterns (to replicate in tsconfig.json creation task)
      // ...["assets", "components", "config", "layouts", "routes", "utils", "vendor"].reduce()
      assets: resolve(__dirname, paths.frontend.src.assets),
      components: resolve(__dirname, paths.frontend.src.components),
      config: resolve(__dirname, paths.frontend.src.config),
      layouts: resolve(__dirname, paths.frontend.src.layouts),
      routes: resolve(__dirname, paths.frontend.src.routes),
      utils: resolve(__dirname, paths.frontend.src.utils),
      vendor: resolve(__dirname, paths.frontend.src.vendor),
    },
  };
};

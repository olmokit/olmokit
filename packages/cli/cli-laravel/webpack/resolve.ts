// import { resolve } from "node:path";
// import { fileURLToPath } from "node:url";
import { Configuration } from "webpack";
import { isUsingLocalLinkedNodeModule } from "../../helpers-getters.js";
import { meta } from "../../meta.js";
import { libraries } from "../helpers/libraries.js";
// import { paths } from "../paths/index.js";
import type { CliLaravel } from "../pm.js";

// const __dirname = fileURLToPath(new URL(".", import.meta.url));

/**
 * @see https://webpack.js.org/configuration/resolve/#resolvesymlinks
 * @see https://webpack.js.org/configuration/resolve/#resolvemodules
 *
 * TODO: verify that all this is needed and that it works with pnpm
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_config: CliLaravel.Config): Configuration["resolve"] => {
  const modules = ["node_modules"];
  let symlinks = false;
  const { core } = libraries;

  if (
    isUsingLocalLinkedNodeModule(meta.nodeModule) ||
    (core.exists && isUsingLocalLinkedNodeModule(core.path))
  ) {
    symlinks = true;
  }

  if (core.pathNodeModules) {
    modules.push(core.pathNodeModules);
  }

  // console.log("symlinks", symlinks, "modules", modules)

  return {
    modules,
    symlinks,
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    // alias: {
    //   "~": resolve(__dirname, paths.frontend.src.base),
    //   "@/": resolve(__dirname, paths.frontend.src.base),
    //   // TODO: "@/" and "~" patterns (to replicate in tsconfig.json creation task)
    //   // ...["assets", "components", "config", "layouts", "routes", "utils", "vendor"].reduce()
    //   assets: resolve(__dirname, paths.frontend.src.assets),
    //   components: resolve(__dirname, paths.frontend.src.components),
    //   config: resolve(__dirname, paths.frontend.src.config),
    //   layouts: resolve(__dirname, paths.frontend.src.layouts),
    //   routes: resolve(__dirname, paths.frontend.src.routes),
    //   utils: resolve(__dirname, paths.frontend.src.utils),
    //   vendor: resolve(__dirname, paths.frontend.src.vendor),
    // },
  };
};

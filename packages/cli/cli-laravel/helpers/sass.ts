import { existsSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { project } from "../../project.js";
import { paths } from "../paths/index.js";
import { laravelConfig } from "./dotenv.js";
import { getPublicUrls } from "./index.js";
// eslint-disable-next-line import/order
import { type Libraries, libraries } from "./libraries.js";

/**
 * Get SASS shared resources
 *
 * Paths of sass file that might be made always available with
 * `sass-resource-loader`
 *
 * The order of the array is crucial here to enable SASS overriding defaults
 * behaviour.
 */
export function getSassSharedResources() {
  const importFromLibrary = (
    lib: keyof Libraries,
    module: string,
    filename: string
  ) =>
    join(
      project.nodeModules,
      `${libraries[lib].name}/${module}/_${filename}.scss`
    );
  const importFromProject = (filename: string) =>
    join(paths.frontend.src.config, `/${filename}.scss`);

  const possiblePaths = [
    // functions:
    importFromLibrary("core", "scss", "functions"),
    importFromProject("functions"),
    // variables:
    importFromProject("variables"),
    importFromLibrary("core", "scss", "variables"),
    importFromLibrary("core", "typography", "variables"),
    importFromLibrary("core", "grid", "variables"),
    importFromLibrary("core", "buttons", "variables"),
    importFromLibrary("core", "forms", "variables"),
    importFromLibrary("core", "media", "variables"),
    importFromLibrary("core", "progress", "variables"),
    importFromLibrary("core", "glide", "variables"),
    importFromLibrary("components", "Header", "variables"),
    importFromLibrary("components", "Hamburger", "variables"),
    importFromLibrary("core", "dialog", "variables"),
    // mixins:
    importFromLibrary("core", "scss", "mixins"),
    importFromLibrary("core", "scss/vendor", "rfs"),
    importFromLibrary("core", "scss/vendor", "sass-rem"),
    importFromLibrary("core", "grid", "mixins"),
    importFromLibrary("core", "responsive", "mixins"),
    importFromLibrary("core", "typography", "mixins"),
    importFromLibrary("core", "forms", "mixins"),
    importFromLibrary("core", "olmoforms", "mixins"),
    importFromLibrary("core", "media", "mixins"),
    importFromLibrary("core", "buttons", "mixins"),
    importFromLibrary("core", "dialog", "mixins"),
    importFromLibrary("core", "scss/mixins", "fonts"),
    importFromLibrary("core", "scss/mixins", "overlay"),
    importFromLibrary("core", "scss/mixins", "ratio"),
    importFromLibrary("core", "scss/mixins", "spacing"),
    importFromLibrary("core", "scss/mixins", "svg"),
    importFromLibrary("core", "glide", "mixins"),
    importFromLibrary("core", "video", "mixins"),
    importFromLibrary("components", "Header", "mixins"),
    importFromLibrary("components", "Hamburger", "mixins"),
    importFromProject("mixins"),
    // placeholders:
    importFromLibrary("core", "scss", "placeholders"),
    importFromProject("placeholders"),
  ];

  return possiblePaths.filter((sassFilePath) => {
    return existsSync(resolve(sassFilePath));
  });
}

/**
 * Get SASS include paths
 *
 * Adds the core library node_modules folder if the core library exists, this
 * is needed when using the core library installed through `npm link` which
 * does not install its node_modules in the project root (no deps hoisting)
 * but keeps them under the node_modules inside the symlinked library's folder
 * (e.g. in `./node_modules/@olmokit/core/node_modules)
 */
export function getSassIncludePaths() {
  const includePaths = [resolve(project.nodeModules)];

  // FIXME: is this working? not even sure if still needed
  if (libraries.core.pathNodeModules) {
    includePaths.push(resolve(libraries.core.pathNodeModules));
  }

  return includePaths;
}

/**
 * Get SASS additional data based on env variables and paths/urls
 */
export function getSassAdditionalData() {
  const publicUrls = getPublicUrls();
  const output = [
    // FIXME: hacky solution found at
    // https://github.com/nuxt-community/style-resources-module/issues/143#issuecomment-847413359
    `@use "sass:math";`,
    `$DEV: ${process.env["NODE_ENV"] !== "production"};`,
    `$ENV: "${process.env.APP_ENV}";`,
    `$SRC_ASSETS: "${relative(
      paths.frontend.src.utils,
      paths.frontend.src.assets
    )}";`,
    `$URL_ASSETS: "${publicUrls.assets}";`,
    `$SRC_FONTS: "${relative(
      paths.frontend.src.utils,
      paths.frontend.src.fonts
    )}";`,
    // when using a CDN we need to use the absolute fonts URLS referenced in the
    // CSS or the path will be wrong. TODO: doesn't webpack have something
    // more integrated to manage paths in scss files?
    `$URL_FONTS: ${
      process.env.NODE_ENV === "production" && laravelConfig("env.CDN")
        ? `"${publicUrls.fonts}"`
        : `false`
    };`,
    `$SRC_IMAGES: "${relative(
      paths.frontend.src.utils,
      paths.frontend.src.images
    )}";`,
    `$URL_IMAGES: "${publicUrls.images}";`,
    `$SRC_SVGICONS: "${paths.frontend.src.svgicons}";`,
  ];

  return output.join(" ");
}

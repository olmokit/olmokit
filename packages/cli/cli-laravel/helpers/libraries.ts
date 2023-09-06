import { existsSync, realpathSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import type { PackageJson } from "type-fest";
import { isUsingLinkedPackage } from "../../development.js";
import { meta } from "../../meta.js";
import { project } from "../../project.js";

const require = createRequire(import.meta.url);

export type Libraries = ReturnType<typeof getLibraries>;

export type Library = ReturnType<typeof getLibrary>;

export const libraries = getLibraries();

function getLibraries() {
  return {
    core: getLibrary("@olmokit/core"),
    components: getLibrary("@olmokit/components"),
  };
}

function getLibrary(name: string) {
  const { workspaceRoot } = meta;
  const slug = name.split("/")[1];
  const path = join(project.nodeModules, ...name.split("/"));
  const exists = existsSync(path);
  const locallyLinked = exists ? isUsingLinkedPackage(path) : false;
  const src =
    locallyLinked && workspaceRoot
      ? join(workspaceRoot, "/packages/", slug)
      : path;
  let pathNodeModules = "";
  let packageJson;

  try {
    if (exists) {
      packageJson = require(join(path, "/package.json")) as PackageJson;
    }
  } catch (e) {
    // doesn't matter
  }

  if (exists) {
    try {
      pathNodeModules = realpathSync(join(path, "node_modules"));
    } catch (e) {
      // doesn't matter
    }
  }

  return {
    /**
     * Library package name e.g. `@scope/lib-name`
     */
    name,
    /**
     * Library package slug e.g. for `@scope/lib-name` is `lib-name`
     */
    slug,
    /**
     * Library's package.json parsed file content
     */
    packageJson,
    /**
     * Library's path in current _project_'s `node_modules` folder
     */
    path,
    /**
     * Either the library's source root folder when the library is **linked** or
     * the library's path in current _project_'s `node_modules` folder
     */
    src,
    /**
     * This is the library's own `node_modules` path following symlink's real path
     *
     * TODO: verify `pnpm` behaviour
     */
    pathNodeModules,
    /**
     * Is the library installed?
     */
    exists,
    /**
     * Is the library's package locally linked?
     */
    locallyLinked,
  };
}

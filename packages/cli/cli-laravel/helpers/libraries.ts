import { existsSync, realpathSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import type { PackageJson } from "type-fest";
import type { CliLaravel } from "../pm.js";

const require = createRequire(import.meta.url);

export type Libraries = ReturnType<typeof getLibraries>;

export function getLibraries(config: CliLaravel.Config) {
  const map = {
    core: getLibrary("@olmokit/core", config),
    components: getLibrary("@olmokit/components", config),
  };

  return map;
}

function getLibrary(name: string, config: CliLaravel.Config) {
  const path = join(config.project.nodeModules, name);
  const exists = existsSync(path);
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
    name,
    packageJson,
    path,
    /**
     * This is the library's node_modules path following symlink's real path
     * so that we can use `npm link` without problems
     *
     * TODO: verify `pnpm` behaviour
     */
    pathNodeModules,
    exists,
  };
}

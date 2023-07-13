/**
 * @file With `meta` we mean this `CLI`'s information
 */
import { createRequire } from "node:module";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const __dirname = fileURLToPath(new URL(".", import.meta.url));

const pkg = require("./package.json") as {
  name: string;
  version: string;
};
const root = __dirname;

/**
 * Meta information of this package
 */
export const meta = {
  ...pkg,
  /**
   * The `@${string}` portion of this package name
   */
  orgScope: pkg.name.split("/")[0] as `@${string}`,
  /**
   * The root path of this package's source on the local machine
   */
  root,
  /**
   * The path within the node_modules folder when this package is used in a project
   */
  nodeModule: join(process.cwd(), "node_modules", pkg.name),
};

/**
 * @file With `meta` we mean this `CLI`'s information
 */
import { createRequire } from "node:module";
import { join, sep } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const __dirname = fileURLToPath(new URL(".", import.meta.url));

const pkg = require("./package.json") as {
  /**
   * The _name_ of this `cli` package
   */
  name: string;
  /**
   * The _version_ of this `cli` package
   */
  version: string;
};
const root = __dirname;

/**
 * Meta information of this package
 */
export const meta = {
  ...pkg,
  /**
   * This repository's workspace root path (useful only when packages are
   * `link`ed locally, in other cases this will be `false`).
   */
  workspaceRoot: getWorkspaceRoot(),
  /**
   * The `@${string}` portion of this package name
   */
  orgScope: pkg.name.split("/")[0] as `@${string}`,
  /**
   * The root path of this package's source on the local machine
   */
  root,
  /**
   * This package location within the _project_'s `node_modules` folder
   */
  nodeModule: join(process.cwd(), "node_modules", pkg.name),
};

/**
 * Consider that this package might or might not be in the `packages/dist` folder
 * dependending on the fact the developer has locally linked these packages or not.
 */
function getWorkspaceRoot() {
  const parent = join(root, "../");
  const parentParent = join(parent, "../");
  const parentParentParts = parentParent.split(sep).filter(Boolean);

  // check if we have: /xyz/Olmokit/olmokit/[dist]/packages/cli
  if (parentParentParts.pop() === "dist") {
    return join(parentParent, "../");
  }

  const parentParts = parent.split(sep).filter(Boolean);

  // check if we have: /xyz/Olmokit/olmokit/[packages]/cli
  if (parentParts.pop() === "packages") {
    return parentParent;
  }

  return false as const;
}

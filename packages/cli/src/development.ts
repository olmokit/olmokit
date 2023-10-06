import { readlinkSync } from "node:fs";
import { sep } from "node:path";
import { meta } from "./meta.js";

/**
 * To detect if a package is locally linked we can read the symbolic link target
 * path of each package and check whether the second parent folder, of
 * the link target, if that match this standard Nx repo folder structure
 * (`packages`) it means the package is linked. This should work both with
 * `pnpm` and `npm`
 */
export function isUsingLinkedPackage(nodeModulePath = "") {
  // will be e.g.: ../../../../Olmo/olmokit/packages/cli
  try {
    const packageTarget = readlinkSync(nodeModulePath);
    const targetParts = packageTarget.split(sep);
    const isLinked = targetParts.slice(-2, -1).join("/") === "packages";

    return isLinked;
  } catch (e) {
    return false;
  }
}

export function isUsingLinkedPackages() {
  const isLinked = isUsingLinkedPackage(meta.nodeModule);

  // console.log("isUsingLinkedPackages, isLinked:", isLinked);
  return isLinked;
}

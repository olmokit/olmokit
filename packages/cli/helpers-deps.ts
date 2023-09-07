import {
  getNpmDependencies,
  getNpmDependenciesNames,
  updateNpmDependencies,
} from "@olmokit/cli-utils/deps-npm";
import { meta } from "./meta.js";
import { project } from "./project.js";

export function getOurProjectNpmDependenciesNames() {
  return getNpmDependenciesNames(project.packageJson, meta.orgScope);
}

export async function getOurProjectNpmDependencies() {
  return getNpmDependencies(project.packageJson, meta.orgScope);
}

/**
 * Update our **project**'s npm dependencies in the **project**'s `package.json`
 * file
 */
export async function updateOurProjectNpmDependencies() {
  return await updateNpmDependencies(
    project.root,
    project.packageJson,
    meta.orgScope
  );
}

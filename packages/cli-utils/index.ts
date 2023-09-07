// console.log("in packages/cli/utils")
export {
  getComposerDependenciesNames,
  getComposerDependencies,
  updateComposerDependencies,
  getComposerPkgLatestVersion,
  type ComposerJson,
} from "./deps-composer.js";
export {
  getNpmDependenciesNames,
  getNpmDependencies,
  updateNpmDependencies,
  getNpmPkgLatestVersionSync,
  getNpmPkgLatestVersion,
  type PackageJson,
} from "./deps-npm.js";
export { editJsonFile } from "./editJsonFile.js";
export { inGitRepo, isGitDirty, tryGitInit, tryGitCommit } from "./git.js";
export { filer, type FilerOptions, type FilerTranformerArg } from "./filer.js";
export {
  createTaskr,
  type Task,
  type TaskArg,
  type TaskRunOptions,
} from "./taskr.js";

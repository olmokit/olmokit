import { join } from "node:path";
import editJsonFile, { type JsonEditor } from "edit-json-file";
import { copy, ensureDir } from "fs-extra";
import { project } from "../../project.js";
import { paths } from "../paths/index.js";
import type { CliLaravel } from "../pm.js";
import { PRETTIER_CONFIG, PRETTIER_PATH } from "./prettier.js";

/**
 * Set `"scripts"` and `"config.startYear"` defaults on `package.json` if
 * missing
 */
function pkgSetup(pkg: JsonEditor) {
  const existingScripts = pkg.get("scripts");
  const existingStartYear = pkg.get("config.startYear");
  const startYear = existingStartYear || new Date().getFullYear();

  // TODO: this object could/should be created dynamically by reading commander
  pkg.set("scripts", {
    postinstall: "olmo postinstall",
    ...existingScripts,
  });
  pkg.set("config.startYear", startYear);
  pkg.save();
}

/**
 * Set browserlist configuration on `package.json`
 *
 * @see https://browserl.ist/
 */
function pkgBrowserslistConfig(pkg: JsonEditor) {
  const browsersListDefault = ["last 2 versions", "> 1%"];
  const browserslistExisting = pkg.get("browserslist");
  const browserslist = isCustomised(browserslistExisting, browsersListDefault)
    ? browserslistExisting
    : browsersListDefault;

  pkg.set("browserslist", browserslist);
  pkg.save();
}

/**
 * Set prettier configuration on `package.json`
 */
function pkgPrettierConfig(pkg: JsonEditor) {
  const lintStagedDefault = {
    [PRETTIER_PATH]: "prettier --write",
  };
  const prettierDefault = PRETTIER_CONFIG;
  const lintStagedExisting = pkg.get("lint-staged");
  const prettierExisting = pkg.get("prettier");
  const prettier = isCustomised(prettierExisting, prettierDefault)
    ? prettierExisting
    : prettierDefault;
  const lintStaged = isCustomised(lintStagedExisting, lintStagedDefault)
    ? lintStagedExisting
    : lintStagedDefault;

  pkg.unset("overrides"); // remove the former prettier overrides key
  pkg.set("prettier", prettier);
  pkg.set("lint-staged", lintStaged);
  pkg.save();
}

/**
 * Copy husky configuration folder
 */
async function huskyConfig() {
  const src = join(paths.self.templates, "/.husky");
  const dest = join(project.root, "/.husky");

  await ensureDir(dest);

  await copy(src, dest, {
    preserveTimestamps: true,
    overwrite: false,
  });
}

/**
 * Check if the existing configuration is different than the default,
 * so that we don't override it if it has been customised.
 */
function isCustomised(existing?: any, _default?: any) {
  if (!existing) {
    return false;
  }
  if (JSON.stringify(existing) === JSON.stringify(_default)) {
    return false;
  }
  return true;
}

export const pkg: CliLaravel.Task = async () => {
  const pkg = editJsonFile(join(project.root, "package.json"), {
    stringify_eol: true,
  });

  pkgSetup(pkg);
  pkgBrowserslistConfig(pkg);
  pkgPrettierConfig(pkg);
  await huskyConfig();
};
pkg.meta = { title: "Ensure correct package.json file" };

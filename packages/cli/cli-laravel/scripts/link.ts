import { execSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { join, sep } from "node:path";
import { $ } from "execa";
import { ensureDirSync } from "fs-extra";
import { globSync } from "glob";
import { rimraf, rimrafSync } from "rimraf";
import type { PackageJson } from "@olmokit/utils";
import {
  getNpmDependenciesNameAndVersion,
  readJsonFile,
} from "@olmokit/cli-utils";
// import { getPackageManagerCommand } from "@olmokit/cli-utils/package-manager.js";
import { meta } from "../../meta.js";
import { project } from "../../project.js";
import type { CliLaravel } from "../pm.js";

type LinkedLib = {
  name: string;
  root: string;
};

type LinkedLibWithDeps = LinkedLib & {
  otherDeps: {
    name: string;
    version: string;
  }[];
};

const internalDepsPackageName = `${meta.orgScope}/internal-deps`;

/**
 * Try link each candidate package
 *
 * Custom plain symlinking to solve pnpm/npm global links continuous issues
 */
async function tryNodeLink({ log, ora, chalk }: CliLaravel.TaskArg) {
  const spinner = ora({
    text: `Linking internal node packages`,
    indent: 2,
  });
  const linkedLibs = await linkInternalNodeLibsFrom(project.root);
  await removeInternalLibsInLinkedLibs(linkedLibs);
  const linkedLibsWithDeps = await gatherNodeLibsDeps(linkedLibs);
  const thirdPartyDeps = getLinkedLibsThirdPartyDeps(linkedLibsWithDeps);
  // createDummyPackageWithExternalDeps(linkedLibsWithDeps);

  if (!linkedLibs.length) {
    spinner.warn(`No packages were linked :/.`);
  } else {
    spinner.succeed(
      `Linked ${linkedLibs.map((lib) => chalk.bold(lib.name)).join(", ")}`,
    );
    // prettier-ignore
    console.log(`
  Your linked packages have the following dependencies:
    ${thirdPartyDeps.list.map(l => l.name).join("\n    ")}.

  You might need to ${chalk.bold("temporarily")} install them in your current project with

  pnpm add --save-optional ${thirdPartyDeps.list.map(l => `${l.name}@${l.version}`).join(" ")}
`);
  }
}

async function linkInternalNodeLibsFrom(projectRoot: string) {
  const linked: LinkedLib[] = [];
  const packageJson = readJsonFile<PackageJson>(
    join(projectRoot, "./package.json"),
  );
  const sourceLibsRoot = findFolderUp("*/*/olmokit/dist/packages", projectRoot);

  if (!packageJson) {
    console.error("Could not read current project package.json");
    return linked;
  }

  const projectInternalDeps = getNpmDependenciesNameAndVersion(
    packageJson,
    meta.orgScope,
  );

  if (sourceLibsRoot && existsSync(sourceLibsRoot)) {
    console.log("Trying 'manual' linking");
    console.log();
    // 1) 'manual' linking

    const sourceLibs = globSync("*", {
      cwd: sourceLibsRoot,
    });
    await Promise.all(
      sourceLibs.map(async (name) => {
        const depPathInProject = join(
          project.nodeModules,
          `${meta.orgScope}/${name}`,
        );
        const depPathInSource = join(sourceLibsRoot, name);

        if (existsSync(depPathInProject) && existsSync(depPathInSource)) {
          try {
            rmSync(depPathInProject, { recursive: true });
            symlinkSync(depPathInSource, depPathInProject);

            linked.push({ name, root: depPathInProject });
          } catch (e) {}
        }
      }),
    );
  } else {
    console.log("Could not figure out local olmokit repo folder");
    console.log();
    console.log("Trying standard 'pnpm' linking");
    // 2) 'pnpm' standard linking
    const linked: string[] = [];

    await Promise.all(
      projectInternalDeps.map(async ({ name }) => {
        const { exitCode } = await $({
          reject: false,
          cwd: project.root,
        })`pnpm ${["link", name, "--global"]}`;

        if (exitCode === 0) {
          linked.push(name);
        }
      }),
    );
  }

  return linked;
}

async function gatherNodeLibsDeps(libs: LinkedLib[]) {
  return await Promise.all(
    libs.map(async (lib) => {
      let otherDeps: LinkedLibWithDeps["otherDeps"] = [];
      const packageJsonPath = join(lib.root, "./package.json");

      if (existsSync(packageJsonPath)) {
        try {
          const packageJson = readJsonFile<PackageJson>(packageJsonPath);
          if (packageJson) {
            const libsDeps = getNpmDependenciesNameAndVersion(packageJson);
            // filter out the inner dependencies, just keep the third party ones
            otherDeps = otherDeps.concat(
              libsDeps.filter(
                (dep) => !dep.name.startsWith(meta.orgScope + "/"),
              ),
            );
          }
        } catch (e) {}
      }

      return {
        ...lib,
        otherDeps,
      };
    }),
  );
}

function getLinkedLibsThirdPartyDeps(libs: LinkedLibWithDeps[]) {
  const list: { name: string; version: string }[] = [];
  const map = libs.reduce(
    (map, lib) => {
      for (let i = 0; i < lib.otherDeps.length; i++) {
        const dep = lib.otherDeps[i];
        map[dep.name] = dep.version;
        if (list.findIndex((item) => item.name) === -1) {
          list.push(dep);
        }
      }
      return map;
    },
    {} as Record<string, string>,
  );

  return { list, map };
}

function createDummyPackageWithExternalDeps(libs: LinkedLibWithDeps[]) {
  const packageDir = join(project.nodeModules, internalDepsPackageName);
  const packageJsonPath = join(packageDir, "./package.json");
  const packageJsonContent = {
    name: internalDepsPackageName,
    dependencies: getLinkedLibsThirdPartyDeps(libs).map,
    private: true,
  };

  ensureDirSync(packageDir);

  if (existsSync(packageJsonPath)) {
    rmSync(packageJsonPath);
  }

  writeFileSync(packageJsonPath, JSON.stringify(packageJsonContent, null, 2));
}

async function removeInternalLibsInLinkedLibs(libs: LinkedLib[]) {
  await Promise.all(
    libs.map(async (lib) => {
      await rimraf(join(lib.root, "/node_modules", `/${meta.orgScope}/*`), {
        preserveRoot: false,
      });
    }),
  );
}

/**
 * @deprecated This might be useful for something else
 */
function getNodeGloballyLinkedPackages() {
  return execSync("pnpm list -g")
    .toString()
    .trim()
    .split("\n")
    .filter((line) => line.startsWith(`${meta.orgScope}/`))
    .map((line) => {
      const [name /* , relativePath */] = line.split(" link:");
      return name;
    });
}

/**
 * We just try to find where is this package source on the machine of the
 * developer running it...
 */
function tryComposerLink({ log, chalk }: CliLaravel.TaskArg) {
  const name = "olmo/laravel-frontend";
  const nameLog = chalk.bold(name);
  const src = findFolderUp(
    "*/*/olmokit/packages/laravel-frontend",
    project.root,
  );

  if (src && existsSync(src)) {
    const dest = join(project.root, "/vendor/", name);
    if (existsSync(dest) || lstatSync(dest)) {
      rimrafSync(dest);
    }

    symlinkSync(src, dest);

    log.success(`  Symlinked composer package ${nameLog}`);
  } else {
    log.warn(`  Could not link composer package ${nameLog}`);
  }
}

function findFolderUp(
  pathToFind: string,
  startFromPath: string,
  // preferPathParent?: string
): string {
  const parent = join(startFromPath, "../");
  const parentParts = parent.split(sep).filter(Boolean);
  const matches = globSync(pathToFind, {
    cwd: parent,
    absolute: true,
  });

  if (matches && matches.length) {
    return matches[0];
  }

  if (parentParts.length) {
    return findFolderUp(pathToFind, parent);
  }

  return "";
}

/**
 * List linked packages from curent project with `pnpm list -g --parseable`
 */
export const link: CliLaravel.Task = async (arg) => {
  await tryNodeLink(arg);
  tryComposerLink(arg);
};
link.meta = { title: ":no" };

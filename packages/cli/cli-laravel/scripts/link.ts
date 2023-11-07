import { existsSync, lstatSync, rmSync, symlinkSync } from "node:fs";
import { join, sep } from "node:path";
import { $ } from "execa";
import { globSync } from "glob";
import { rimrafSync } from "rimraf";
import type { PackageJson } from "@olmokit/utils";
import {
  getNpmDependenciesNameAndVersion,
  readJsonFile,
} from "@olmokit/cli-utils";
// import { getPackageManagerCommand } from "@olmokit/cli-utils/package-manager";
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

  if (!linkedLibs.length) {
    spinner.warn(`No packages were linked :/.`);
  } else {
    spinner.succeed(
      `Linked ${linkedLibs.map((lib) => chalk.bold(lib.name)).join(", ")}`
    );
  }
}

async function linkInternalNodeLibsFrom(projectRoot: string) {
  const { orgScope } = meta;
  const linked: LinkedLib[] = [];
  const packageJson = readJsonFile<PackageJson>(
    join(projectRoot, "./package.json")
  );
  const hereLibsDist = findFolderUp("*/*/olmokit/dist/packages", projectRoot);

  if (!packageJson) {
    console.error("Could not read current project package.json");
    return linked;
  }

  const projectInternalDeps = getNpmDependenciesNameAndVersion(
    packageJson,
    meta.orgScope
  );

  if (hereLibsDist && existsSync(hereLibsDist)) {
    // 1) 'manual' linking
    console.log("Trying 'manual' linking");
    console.log();

    const sourceLibs = globSync("*", { cwd: hereLibsDist });

    await Promise.all(
      sourceLibs.map(async (name) => {
        const fullName = `${orgScope}/${name}`;
        const pathInProject = join(project.nodeModules, fullName);
        const pathInHereDist = join(hereLibsDist, name);

        try {
          if (existsSync(pathInHereDist)) {
            if (existsSync(pathInProject)) {
              rmSync(pathInProject, { recursive: true });
            }
            symlinkSync(pathInHereDist, pathInProject);
            linked.push({ name: fullName, root: pathInProject });
          }
        } catch (e) {}
      })
    );
  } else {
    // 2) 'pnpm' standard linking
    console.log("Could not figure out local olmokit repo folder");
    console.log();
    console.log("Trying standard 'pnpm' linking");
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
      })
    );
  }

  return linked;
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
    project.root
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
  startFromPath: string
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

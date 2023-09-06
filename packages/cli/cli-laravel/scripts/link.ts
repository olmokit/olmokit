import { execSync } from "node:child_process";
import { existsSync, lstatSync, symlinkSync } from "node:fs";
import { join, sep } from "node:path";
import { $ } from "execa";
import { globSync } from "glob";
import { rimrafSync } from "rimraf";
import { getProjectDependencies } from "../../helpers-getters.js";
import { meta } from "../../meta.js";
import { project } from "../../project.js";
// import { getPackageManagerCommand } from "@olmokit/cli-utils/package-manager";
import type { CliLaravel } from "../pm.js";

/**
 * Try link each candidate package
 *
 * We might use the `--json` argument in the `list -g` command but it seems
 * easier to parse it ourselves rather than relying on the shape of the returned
 * JSON...
 *
 * TODO: support `npm` and `yarn`?
 */
async function tryNodeLink({ log, ora, chalk }: CliLaravel.TaskArg) {
  // const pkm = getPackageManagerCommand();
  // const candidatesGloballyLinked = execSync(pkm.list + " -g")
  const candidatesDeps = getProjectDependencies(
    project.packageJson,
    meta.orgScope
  );
  const candidatesGloballyLinked = execSync("pnpm list -g")
    .toString()
    .trim()
    .split("\n")
    .filter((line) => line.startsWith(`${meta.orgScope}/`))
    .map((line) => {
      const [name /* , relativePath */] = line.split(" link:");
      return name;
    });
  const candidates = candidatesDeps.list.filter((dep) =>
    candidatesGloballyLinked.includes(dep.name)
  );
  const linked: string[] = [];

  await Promise.all(
    candidates.map(async ({ name }) => {
      const spinner = ora({
        text: `Linking ${chalk.bold(name)}`,
        suffixText: "...",
        indent: 2,
      });
      const { exitCode } = await $({ reject: false })`pnpm ${[
        "link",
        name,
        "--global",
      ]}`;

      spinner.suffixText = "";

      if (exitCode === 0) {
        linked.push(name);
        spinner.succeed(`Linked ${chalk.bold(name)}`);
      } else {
        spinner.warn(`Could not link ${chalk.bold(name)}`);
      }
    })
  );

  if (!linked.length) {
    log.warn(`No packages were linked :/.`);
  }
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
    // "*/packages/laravel-frontend",
    // project.root,
    // "olmokit"
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
    // let bestMatch = "";

    // if (matches.length > 1 && preferPathParent) {
    //   bestMatch =
    //     matches.find((foundPath) => {
    //       const foundPathParts = foundPath.split(sep).filter(Boolean);
    //       const normalisedFountPath = foundPathParts.join("/");

    //       if (
    //         normalisedFountPath
    //           .toLowerCase()
    //           .endsWith(pathToFind.replace("*", preferPathParent))
    //       ) {
    //         return foundPath;
    //       }
    //       return false;
    //     }) || "";
    // }
    // return bestMatch || matches[0];
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

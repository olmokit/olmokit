import { execSync } from "node:child_process";
import { existsSync, symlinkSync } from "node:fs";
import { join } from "node:path";
import { $ } from "execa";
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
 * We just try to guess where is this package source on the machine of the
 * developer running it...TODO: probably we could better here
 */
function tryComposerLink({ log, chalk }: CliLaravel.TaskArg) {
  const name = "olmo/laravel-frontend";
  const nameLog = chalk.bold(name);
  const src = join(
    project.root,
    "../../Olmo/olmokit/packages/laravel-frontend"
  );
  const dest = join(project.root, "/vendor/", name);

  if (existsSync(src)) {
    if (existsSync(dest)) {
      rimrafSync(dest);
    }
    symlinkSync(src, dest);
    log.success(`  Symlinked composer package ${nameLog}`);
  } else {
    log.warn(`  Could not link composer package ${nameLog}`);
  }
}

/**
 * List linked packages from curent project with `pnpm list -g --parseable`
 */
export const link: CliLaravel.Task = async (arg) => {
  await tryNodeLink(arg);
  tryComposerLink(arg);
};
link.meta = { title: ":no" };

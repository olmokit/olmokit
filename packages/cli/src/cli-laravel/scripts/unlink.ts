// import { lstatSync } from "node:fs";
// import { join } from "node:path";
import { $ } from "execa";
// import { globSync } from "glob";
// import { meta } from "../../meta.js";
import type { CliLaravel } from "../pm.js";

/**
 * Returns a list of the candidate npm pack
 *
 * FIXME: not sure whether this is ok since `pnpm` uses always symlinks
 */
// function getCandidatePackages({ ctx }: CliLaravel.TaskArg) {
//   const globPath = `${meta.orgScope}/*`;

//   return globSync(globPath, { cwd: project.nodeModules }).filter((file) => {
//     const stat = lstatSync(join(project.nodeModules, file));
//     return stat.isSymbolicLink();
//   });
// }

/**
 * Try unlink for each npm candidate package
 * With [`pnpm` we need to use `uninstall`](https://pnpm.io/cli/unlink)
 *
 */
async function tryNodeUnlink(arg: CliLaravel.TaskArg) {
  const { ora } = arg;

  const spinner = ora({
    text: `Unlinking by re-installing remote dependencies`,
    suffixText: "...",
    indent: 2,
  });

  spinner.suffixText = "";

  const { exitCode } = await $({ reject: false })`pnpm ${["install"]}`;

  if (exitCode === 0) {
    spinner.succeed(`Unlinked done`);
  } else {
    spinner.warn(`Could not unlink packages`);
  }

  // unlink package by package does not seem to work, neither using `pnpm uninstall`
  // nor using `pnpm unlink`, re-installing with `pnpm install` in combination
  // with the `.npmrc` option `exclude-links-from-lockfile = true` seems to work
  // consistently
  // const { ora, chalk } = arg;
  // const packages = getCandidatePackages(arg);

  // await Promise.all(
  //   packages.map(async (name) => {
  //     const spinner = ora({
  //       text: `Unlinking ${chalk.bold(name)}`,
  //       suffixText: "...",
  //       indent: 2,
  //     });
  //     const { exitCode } = await $({ reject: false })`pnpm ${[
  //       "uninstall",
  //       name,
  //       "--global",
  //     ]}`;

  //     spinner.suffixText = "";

  //     if (exitCode === 0) {
  //       spinner.succeed(`Unlinked ${chalk.bold(name)}`);
  //     } else {
  //       spinner.warn(`Could not unlink ${chalk.bold(name)}`);
  //     }
  //   })
  // );
}

export const unlink: CliLaravel.Task = async (arg) => {
  await tryNodeUnlink(arg);
};
unlink.meta = { title: ":no" };

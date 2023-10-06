import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { $ } from "execa";
import {
  type ComposerJson,
  updateComposerDependencies,
} from "@olmokit/cli-utils";
// deps-composer
import { isGitDirty } from "@olmokit/cli-utils";
// git
// import { getPackageManagerCommand } from "@olmokit/cli-utils"; // package-manager
import { updateOurProjectNpmDependencies } from "../../helpers-deps.js";
import { project } from "../../project.js";
import type { CliLaravel } from "../pm.js";

/**
 * Update our **project**'s composer dependencies in the **project**'s
 * `composer.json` file
 */
async function updateOurProjectComposerDependencies() {
  const require = createRequire(import.meta.url);
  const composerJsonPath = join(project.root, "composer.json");
  if (existsSync(composerJsonPath)) {
    const composerJson = require(composerJsonPath) as ComposerJson;
    return await updateComposerDependencies(project.root, composerJson, "olmo");
  }

  return;
}

/**
 * TODO: support `npm` and `yarn`?
 */
async function installPackages(
  packageType: "npm" | "composer",
  ora: CliLaravel.TaskArg["ora"],
  packages?: string[],
) {
  const spinner = ora({
    text: `Install updated packages`,
    suffixText: "...",
    indent: 2,
  }).start();
  let command = "";
  let args: string[] = [];

  if (packageType === "npm") {
    command = "pnpm";
    args = ["install"];
  } else if (packageType === "composer") {
    command = "composer";
    args = ["update", ...(packages?.length ? packages.join(" ") : [])];
  }

  if (command) {
    const { exitCode } = await $({ reject: false })`${command} ${args}`;

    spinner.suffixText = "";

    if (exitCode === 0) {
      spinner.succeed();
    } else {
      spinner.fail();
    }
  }
}

async function updateNpmPackages({ ora, log }: CliLaravel.TaskArg) {
  const res = await updateOurProjectNpmDependencies();
  res.forEach((action) => {
    log(
      `Bumped ${log.chalk.bold(action.name)} ${log.chalk.dim.italic(
        "from",
      )} ${log.chalk.dim(action.from)} ${log.chalk.dim.italic(
        "to",
      )} ${log.chalk.dim(action.to)} `,
    );
  });

  await installPackages("npm", ora);
}

async function updateComposerPackages({ ora, log }: CliLaravel.TaskArg) {
  const res = await updateOurProjectComposerDependencies();

  if (res) {
    res.forEach((action) => {
      log(
        `Bumped ${log.chalk.bold(action.name)} ${log.chalk.dim.italic(
          "from",
        )} ${log.chalk.dim(action.from)} ${log.chalk.dim.italic(
          "to",
        )} ${log.chalk.dim(action.to)} `,
      );
    });

    await installPackages(
      "composer",
      ora,
      res.map((p) => p.name),
    );
  }
}

export const update: CliLaravel.Task = async (arg) => {
  const isDirty = await isGitDirty();
  if (isDirty) {
    arg.log.warn(
      "You have uncommited changes. Commit or stash your changes before upgrading.",
    );
  } else {
    await updateNpmPackages(arg);
    await updateComposerPackages(arg);

    // commit files
    const spinner = arg.ora("Commit files edited during update").start();
    await $({
      stdio: "inherit",
    })`git commit -am ${`chore(olmokit): update to latest version`}`;
    spinner.succeed();

    arg.log.info("Update done! You can now git push if you like.");
  }
};
update.meta = { title: ":no", ownLog: ["start", "end"] };

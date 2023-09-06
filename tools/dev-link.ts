/**
 * @file
 *
 * After this you should go to the project you want to to test these local
 * libs and run `pnpm link --global {packageName}
 */
import { exec } from "node:child_process";
import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import { type Options, oraOpts } from "./dev.js";
import { type LibNpm, self } from "./helpers.js";

export const link = () =>
  new Command("link")
    .description("Link libs globally")
    .action(async (opts: Options) => {
      const libs = self().libsNpm;
      const spinner = ora({
        text: `Link ${libs.length} libs packages...`,
        ...oraOpts,
      });
      spinner.stopAndPersist();
      console.log();
      await linkLibsGlobally(libs, opts);

      // NOTE: maybe linking recursively is only needed with pnpm
      console.log();
      ora({
        text: `Now link those packages in one another...`,
        ...oraOpts,
      }).stopAndPersist();
      console.log();
      await linkRecursively(libs, opts);
    });

async function linkLibsGlobally(libs: LibNpm[], opts: Options) {
  // doing this in parallel does not work consistently
  for (let i = 0; i < libs.length; i++) {
    await linkLibGlobally(libs[i], opts);
  }
}

async function linkLibGlobally(lib: LibNpm, opts: Options) {
  return new Promise<void>((resolve, reject) => {
    const spinner = ora({
      text: `Link ${chalk.bold(lib.name)} globally`,
      indent: 2,
      ...oraOpts,
    });

    let cmd = "pnpm link --global";
    if (opts.pkgm === "npm") {
      cmd = "npm link --global";
    }

    if (opts.verbose) {
      spinner.suffixText = ` ran ${chalk.italic(cmd)} from ${chalk.italic(
        lib.packageJson.name
      )}`;
    }

    exec(
      cmd,
      {
        cwd: lib.linkPath,
        // stdio: "inherit",
      },
      (err) => {
        if (err) {
          spinner.fail();
          reject();
        } else {
          spinner.succeed();
          resolve();
        }
      }
    );
  });
}

async function linkRecursively(libs: LibNpm[], opts: Options) {
  for (let i = 0; i < libs.length; i++) {
    const lib = libs[i];

    let internalDeps = lib.internalDeps;
    if (!internalDeps.length) {
      console.warn(
        chalk.dim(
          [
            `  ${chalk.bold(lib.name)} has no internal deps`,
            !lib.packageJson.version
              ? `.  This is probably because its package.json misses the 'version'`
              : "",
          ].join(" ")
        )
      );
    }

    for (let j = 0; j < internalDeps.length; j++) {
      await linkInternalDep(lib, internalDeps[j], opts);
    }
  }
}

async function linkInternalDep(lib: LibNpm, depName: string, opts: Options) {
  return new Promise<void>((resolve, reject) => {
    if (lib.name !== depName) {
      const spinner = ora({
        text: `In ${chalk.bold(lib.name)} link ${chalk.bold(depName)}`,
        indent: 2,
        ...oraOpts,
      });

      let cmd = "pnpm link --global";
      if (opts.pkgm === "npm") {
        cmd = "npm link --global";
      }

      if (opts.verbose) {
        spinner.suffixText = `ran ${chalk.italic(
          `${cmd} ${depName}`
        )} from ${chalk.italic(lib.name)}`;
      }

      exec(
        `${cmd} ${depName}`,
        {
          cwd: lib.linkPath,
          // stdio: opts.verbose ? "inherit" : "none",
        },
        (err) => {
          if (err) {
            spinner.fail();
            // reject();
            resolve();
          } else {
            spinner.succeed();
            resolve();
          }
        }
      );
    } else {
      resolve();
    }
  });
}

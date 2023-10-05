import { exec } from "node:child_process";
import chalk from "chalk";
import { Command } from "commander";
import { $ } from "execa";
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

      console.log();

      // NOTE: maybe linking recursively is only needed with pnpm
      // ora({
      //   text: `Now link those packages in one another...`,
      //   ...oraOpts,
      // }).stopAndPersist();
      // console.log();
      // await linkRecursively(libs, opts);

      // if (opts.pkgm === "pnpm") {
      //   ora({
      //     text: `Now install linked packages dependencies...`,
      //     ...oraOpts,
      //   }).stopAndPersist();
      //   await linkLibsInstallDeps(libs, opts);
      //   console.log();
      // }
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
    }).start();

    let cmd = "pnpm link --global";
    if (opts.pkgm === "npm") {
      cmd = "npm link --global";
    }

    if (opts.verbose) {
      spinner.suffixText = ` ran ${chalk.italic(cmd)} from ${chalk.italic(
        lib.packageJson.name,
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
      },
    );
  });
}

/**
 * @deprecated This seems to create more problems than it solves? after this run
 * the global pnpm links have weird paths
 */
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
          ].join(" "),
        ),
      );
    }

    for (let j = 0; j < internalDeps.length; j++) {
      await linkInternalDep(lib, internalDeps[j], opts);
    }
  }
}

/**
 * @deprecated This seems to create more problems than it solves? after this run
 * the global pnpm links have weird paths
 */
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
          `${cmd} ${depName}`,
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
        },
      );
    } else {
      resolve();
    }
  });
}

/**
 * @deprecated This does not work inside a monorepo, and there is [no flag to
 * ignore that](https://github.com/pnpm/pnpm/issues/2938)
 */
async function linkLibsInstallDeps(libs: LibNpm[], opts: Options) {
  for (let i = 0; i < libs.length; i++) {
    await linkLibInstallDeps(libs[i], opts);
  }
}

/**
 * @deprecated This does not work inside a monorepo, and there is [no flag to
 * ignore that](https://github.com/pnpm/pnpm/issues/2938)
 */
async function linkLibInstallDeps(lib: LibNpm, opts: Options) {
  const spinner = ora({
    text: `Install ${chalk.bold(lib.name)} dependencies`,
    indent: 2,
    ...oraOpts,
  }).start();

  let cmd = "pnpm install";

  if (opts.verbose) {
    spinner.suffixText = ` ran ${chalk.italic(cmd)} from ${chalk.italic(
      lib.packageJson.name,
    )}`;
  }

  const { exitCode } = await $({ reject: false, cwd: lib.linkPath })`pnpm ${[
    "install",
  ]}`;

  if (exitCode === 0) {
    spinner.info();
  } else {
    spinner.warn();
  }
}

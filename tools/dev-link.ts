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
    .description("Link libs with pnpm")
    .action(async (opts: Options) => {
      const libs = self().libsNpm;
      const spinner = ora({
        text: `Link ${libs.length} libs packages...`,
        ...oraOpts,
      });
      spinner.stopAndPersist();
      console.log();
      await linkGlobally(libs, opts);

      // console.log();
      // ora({
      //   text: `Now link those packages in one another...`,
      //   ...oraOpts,
      // }).stopAndPersist();
      // console.log();
      // linkRecursively(libs, opts);
    });

async function linkGlobally(libs: LibNpm[], opts: Options) {
  await Promise.all(
    libs.map(
      (lib) =>
        new Promise<void>((resolve, reject) => {
          const spinner = ora({
            text: `Link ${chalk.bold(lib.name)} globally`,
            indent: 2,
            ...oraOpts,
          });
          if (opts.verbose) {
            spinner.suffixText = ` ran ${chalk.italic(
              `pnpm link --global`
            )} from ${chalk.italic(lib.packageJson.name)}`;
          }

          let cmd = "pnpm link --global";
          if (opts.pkgm === "npm") {
            cmd = "npm link";
          }

          exec(
            cmd,
            {
              cwd: lib.dist,
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
        })
    )
  );
}

function linkRecursively(libs: LibNpm[], opts: Options) {
  libs.forEach((lib) => {
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

    for (let i = 0; i < internalDeps.length; i++) {
      const depName = internalDeps[i];

      if (lib.name !== depName) {
        const spinner = ora({
          text: `In ${chalk.bold(lib.name)} link ${chalk.bold(depName)}`,
          indent: 2,
          ...oraOpts,
        });

        let cmd = "pnpm link --global";
        if (opts.pkgm === "npm") {
          cmd = "npm link";
        }

        if (opts.verbose) {
          spinner.suffixText = `ran ${chalk.italic(
            `${cmd} ${depName}`
          )} from ${chalk.italic(lib.name)}`;
        }

        exec(
          `${cmd} ${depName}`,
          {
            cwd: lib.dist,
            // stdio: "inherit",
          },
          (err) => {
            if (err) {
              spinner.fail();
              // reject();
            } else {
              spinner.succeed();
              // resolve();
            }
          }
        );
      }
    }
  });
}

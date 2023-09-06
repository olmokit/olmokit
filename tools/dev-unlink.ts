import { exec } from "node:child_process";
import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import { type Options, oraOpts } from "./dev.js";
import { type LibNpm, self } from "./helpers.js";

export const unlink = () =>
  new Command("unlink")
    .description("Unlink libs globally")
    .action(async (opts: Options) => {
      const libs = self().libsNpm;
      const spinner = ora({
        text: `Unlink ${libs.length} libs packages...`,
        ...oraOpts,
      });
      spinner.stopAndPersist();
      console.log();
      await unlinkLibsGlobally(libs, opts);
    });

async function unlinkLibsGlobally(libs: LibNpm[], opts: Options) {
  // doing this in parallel does not work consistently
  for (let i = 0; i < libs.length; i++) {
    await unlinkLibGlobally(libs[i], opts);
  }
}

async function unlinkLibGlobally(lib: LibNpm, opts: Options) {
  return new Promise<void>((resolve, reject) => {
    const spinner = ora({
      text: `Unlink ${chalk.bold(lib.name)} globally`,
      indent: 2,
      ...oraOpts,
    });
    let cmd = `pnpm uninstall ${lib.name} -g`;
    if (opts.pkgm === "npm") {
      cmd = `npm unlink ${lib.name} -g`;
    }

    if (opts.verbose) {
      spinner.suffixText = ` ran ${chalk.italic(cmd)}`;
    }

    exec(cmd, {}, (err) => {
      if (err) {
        // a package might be not globally linked due to a "manual" unlink
        // action or alike, no need to reject
        spinner.fail();
        resolve();
      } else {
        spinner.succeed();
        resolve();
      }
    });
  });
}

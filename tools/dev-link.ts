import { exec } from "node:child_process";
import { existsSync, mkdirSync, rmSync, symlinkSync } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import chalk from "chalk";
import { Command } from "commander";
import { $ } from "execa";
import { glob } from "glob";
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

      ora({
        text: `Now fix packages' node_modules...`,
        ...oraOpts,
      }).stopAndPersist();

      await linkLibsFixNodeModules(libs, opts);

      console.log();
    });

async function linkLibsFixNodeModules(libs: LibNpm[], opts: Options) {
  for (let i = 0; i < libs.length; i++) {
    await linkLibFixNodeModules(libs[i], opts, libs);
  }
}

async function linkLibFixNodeModules(
  lib: LibNpm,
  opts: Options,
  libs: LibNpm[]
) {
  const spinner = ora({
    text: `Fix ${chalk.bold(lib.name)} node_modules`,
    indent: 2,
    ...oraOpts,
  }).start();
  // empty the node_modules folder in /dist, so that the deps
  // defined in the libs' root node_modules folder are picked up
  await rm(join(lib.dist, "/node_modules"), {
    recursive: true,
    force: true,
  });
  await mkdir(join(lib.dist, "/node_modules"));

  // link all the node_modules from the libs' root folder
  (
    await glob("*", {
      cwd: join(lib.src, "/node_modules"),
      ignore: [join(lib.src, "/node_modules/", lib.scope + "/**")],
    })
  ).forEach((nodeModulePath) => {
    // console.log("nodeModulePath", nodeModulePath)
    symlinkSyncSafe(
      join(lib.src, "/node_modules/", nodeModulePath),
      join(lib.dist, "/node_modules/", nodeModulePath)
    );
  });
  // now re-link the internal deps
  libs
    .filter((otherLib) => lib.internalDeps.includes(otherLib.name))
    .forEach((otherLib) => {
      const nodeModuleScopePath = join(
        lib.dist,
        `/node_modules/${otherLib.scope}`
      );
      if (!existsSync(nodeModuleScopePath)) {
        mkdirSync(nodeModuleScopePath);
      }
      symlinkSyncSafe(
        join(otherLib.dist),
        join(nodeModuleScopePath, `/${otherLib.slug}`)
      );
    });

  spinner.succeed();
}

function symlinkSyncSafe(linkTarget: string, linkPath: string) {
  if (existsSync(linkTarget)) {
    if (existsSync(linkPath)) {
      rmSync(linkPath, { recursive: true });
    }
    symlinkSync(linkTarget, linkPath);
  }
}

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

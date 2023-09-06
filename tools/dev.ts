import chalk from "chalk";
import { spawn } from "child_process";
import ci from "ci-info";
import { Command, Option, program } from "commander";
import inquirer from "inquirer";
import { koine } from "./dev-koine.js";
import { libs } from "./dev-libs.js";
import { link } from "./dev-link.js";
import { publish } from "./dev-publish.js";
import { unlink } from "./dev-unlink.js";
import { Lib, self } from "./helpers.js";

export const oraOpts = {
  prefixText: chalk.dim("dev"),
  color: "magenta" as const,
};

export type Options = {
  pkgm: "pnpm" | "npm";
  verbose?: boolean;
  watch?: boolean;
  lib?: string;
};

program
  .name("dev")
  .description("Olmo internal dev cli")
  .addOption(
    new Option("-p, --pkgm <name>", "package manager")
      .choices(["pnpm", "npm"])
      .default("pnpm")
  )
  .option("-v --verbose")
  .option("-w --watch", "Watch packages for changes")
  .addOption(optionLib())
  .addCommand(
    new Command("start")
      .aliases(["watch", "s", "w"])
      .action(async (options: Options) => {
        await devWatch(options);
      })
  )
  .addCommand(
    new Command("build").aliases(["b"]).action(async (options: Options) => {
      const lib = await getOptionLib(options, true, true);
      await devBuild(lib);
    })
  )
  .addCommand(
    new Command("postinstall").action(async (options: Options) => {
      if (!ci.isCI) {
        const lib = await getOptionLib(options, false, true);
        await devBuild(lib, true);
      }
    })
  )
  .addCommand(link())
  .addCommand(unlink())
  .addCommand(libs())
  .addCommand(publish())
  .addCommand(koine())
  .parseAsync();

async function devWatch(options: Options) {
  const lib = await getOptionLib(options, true);

  spawn("nx", ["run", `${lib}:watch`], {
    stdio: "inherit",
  });
}

async function devBuild(libSlug: string, linkAfterBuild?: boolean) {
  const child = libSlug
    ? spawn("nx", ["run", `${libSlug}:build`], {
        stdio: "inherit",
      })
    : spawn("nx", ["run-many", "--all", `--targets=build`], {
        stdio: "inherit",
      });

  if (linkAfterBuild) {
    child.on("close", (code) => {
      if (code === 0) {
        spawn("pnpm", ["dev", "link"], { stdio: "inherit" });
      }
    });
  }
}

async function getOptionLib(
  options: Options,
  prompt?: boolean,
  allowAll?: boolean
) {
  // console.log("options", options);
  let watchLib = options.lib || "";

  if (!watchLib && prompt) {
    const choicesLibs = self().libs.map((lib) => ({
      name: lib.name,
      value: lib,
    }));
    const res = await inquirer.prompt<{ lib: Lib }>([
      {
        name: "lib",
        message: "Choose library",
        choices: allowAll
          ? [
              {
                name: "All",
                value: { slug: "" },
              },
              ...choicesLibs,
            ]
          : choicesLibs,
        type: "list",
        validate: (choices) => {
          if (!choices.length) {
            return "Choose one of the above, use space to choose the option";
          }

          return true;
        },
        loop: false,
        pageSize: 20,
      },
    ]);

    watchLib = res.lib.slug;
  }

  return watchLib;
}

function optionLib() {
  return new Option("-l, --lib <lib>", "operate on a single library").choices(
    self().libs.map((lib) => lib.slug)
  );
}

/**
 * @deprecated It would only be useful with standalone subcommands, but they
 * do not work with ts-node
 */
export const commonOptions = (program?: Command) => {
  const options = [
    new Option("-p, --pkgm <name>", "package manager")
      .choices(["pnpm", "npm"])
      .default("pnpm"),
    new Option("-v, --verbose"),
  ];

  if (program) {
    options.forEach((opt) => program.addOption(opt));
    return program;
  }
  return options;
};

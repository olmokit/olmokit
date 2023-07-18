import chalk from "chalk";
import { spawn, spawnSync } from "child_process";
import ci from "ci-info";
import { Command, Option, program } from "commander";
import { koine } from "./dev-koine.js";
import { libs } from "./dev-libs.js";
import { link } from "./dev-link.js";
import { publish } from "./dev-publish.js";

export const oraOpts = {
  prefixText: chalk.dim("dev"),
  color: "magenta" as const,
};

export type Options = {
  pkgm: "pnpm" | "npm";
  verbose?: boolean;
  watch?: boolean;
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
  // FIXME: this does not work now, maybe it will once we have published the
  // packages to npm registry
  .option("-w --watch", "Watch packages for changes")
  .action((options: Options) => {
    if (ci.isCI) {
      return;
    }
    const { watch } = options;
    if (watch) {
      spawnSync("pnpm", ["dev", "link"], { stdio: "inherit" });
    }
    const child = spawn(
      "nx",
      ["run-many", "--all", `--targets=${options.watch ? "watch" : "build"}`],
      {
        stdio: "inherit",
      }
    );
    if (!watch) {
      child.on("close", function (code) {
        if (code === 0) {
          spawn("pnpm", ["dev", "link"], { stdio: "inherit" });
        }
      });
    }
  })

  // this does not work with ts-node, despite Commanders's README
  // const __dirname = fileURLToPath(new URL(".", import.meta.url));
  // .command("link", "", {
  //   executableFile: path.join(__dirname, "/devlink.ts"),
  // })

  .addCommand(link())
  .addCommand(libs())
  .addCommand(publish())
  .addCommand(koine())
  .parseAsync();

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

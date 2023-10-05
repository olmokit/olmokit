import { existsSync } from "node:fs";
import { join } from "node:path";
import { createTaskr } from "@olmokit/cli-utils/taskr";
import type { Cli, Config } from "./types";

/**
 * An object oholding the few stuff we can pass around other functions when
 * booting up the CLI program
 */
export type CliBootArg = {
  taskr: typeof taskr;
  spinner: typeof spinner;
};

let taskr = createTaskr({
  name: "Olmo",
  color: "magenta",
});
const spinner = taskr.ora("Booting Olmo CLI...").start();

/**
 * Process the project's given config defined in `olmo.ts` and `.olmo.ts`
 * returning its `Internal` representation we use throughout the CLI
 */
async function cliConfig() {
  const cwd = process.cwd();
  const pathHidden = join(cwd, ".olmo.ts");
  const pathPublic = join(cwd, "olmo.ts");

  if (!existsSync(pathPublic)) {
    taskr.log.branded.error("Missing 'olmo.ts` file, a stub is being created");
  }
  const [loadConfig, getConfig, applyEnvVars] = await Promise.all([
    (await import("./config-load.js")).loadConfig,
    (await import("./config.js")).getConfig,
    (await import("./config-env.js")).applyEnvVars,
  ]);
  const custom = loadConfig(existsSync(pathHidden) ? pathHidden : pathPublic, {
    spinner,
    taskr,
  }) as Config.CustomMaybeExtended;

  const config = await getConfig(custom, { spinner, taskr });

  applyEnvVars(config);

  return config;
}

/**
 * The CLI starting point
 */
export async function cli() {
  const config = await cliConfig();
  const type = config.type;
  const Command = (await import("commander")).Command;
  const creator = (await import(`./cli-${type}/pm.js`)).pm as Cli.Creator<any>;

  taskr = taskr.reset({
    suffix: type,
    // TODO: maybe make `ctx` an object, and `config` a property of it, dunno yet
    // if we need to add stuff to the taskr context other than the config
    // @see
    ctx: config,
  });

  const program = taskr
    .pm(new Command())
    .name("olmo")
    .description("CLI to manage Olmo based applications.");

  const { commands } = creator({ program, taskr });

  // here we might add some CLI options shared among all subcommands
  for (let i = 0; i < commands.length; i++) {
    const command = taskr.cmd(commands[i]);
    // command.addOption(new Option("-c, --config").hideHelp().default(config));

    program.addCommand(command);
  }

  spinner.stop();

  program.parseAsync();
}

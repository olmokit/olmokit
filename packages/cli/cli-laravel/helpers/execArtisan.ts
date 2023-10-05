import chalk from "chalk";
import { $ } from "execa";
import type { TaskrOra } from "@olmokit/cli-utils/taskr";

/**
 * Execute a `php artisan <name>` command
 */
export async function execArtisan(commandAndArgs: string[], ora: TaskrOra) {
  const spinner = ora({
    text: `${chalk.dim("Run")} ${chalk.italic("php artisan")} ${chalk.bold(
      commandAndArgs.join(" "),
    )}`,
    suffixText: "...",
  }).start();

  const { exitCode, stdout } = await $({ reject: false })`php ${[
    "artisan",
    ...commandAndArgs,
  ]}`;

  const commandLogs = stdout
    .split("\n")
    .map((line) => line.replace("INFO", "").trim())
    .filter((line) => line)
    .join("\n");

  spinner.suffixText = chalk.dim(commandLogs);
  if (exitCode === 0) {
    spinner.info();
  } else {
    spinner.warn();
  }
}

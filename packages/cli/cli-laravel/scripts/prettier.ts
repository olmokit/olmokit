import { $ } from "execa";
import type { TaskrInstance } from "@olmokit/cli-utils/taskr";

export const PRETTIER_PATH =
  "(src|config)/**/!(assets)/**/*.{js,jsx,ts,tsx,json,css,scss,md,yml,yaml,php}";

export const PRETTIER_CONFIG = {
  overrides: [
    {
      files: "*.php",
      options: {
        singleQuote: true,
      },
    },
  ],
};

export async function prettier(taskr: TaskrInstance) {
  const spinner = taskr
    .ora({
      text: `Run ${taskr.chalk.bold("prettier")} to format the code`,
      suffixText: "...",
      indent: 2,
    })
    .stopAndPersist();
  const { exitCode } = await $({ reject: false, stdio: "inherit" })`prettier ${[
    "--write",
    PRETTIER_PATH,
  ]}`;

  spinner.suffixText = "";

  if (exitCode === 0) {
    spinner.succeed();
  } else {
    spinner.warn();
  }
}

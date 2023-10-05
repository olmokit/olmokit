import { existsSync } from "node:fs";
import { join } from "node:path";
import { copy } from "fs-extra";
import { filer } from "@olmokit/cli-utils/filer";
import type { TaskrLog } from "@olmokit/cli-utils/taskr";
import {
  getHeaderAutogeneration,
  runIfDevAndMissingFile,
} from "../../helpers-getters.js";
import { project } from "../../project.js";
import { checkRoutesConsistency } from "../helpers/route.js";
import { paths } from "../paths/index.js";
import type { CliLaravel } from "../pm.js";

const checkOlmoConfig: CliLaravel.Task = async () => {
  await runIfDevAndMissingFile(join(project.root, "olmo.ts"), () =>
    filer("olmo.ts__tpl__", {
      base: paths.self.templates,
      dest: project.root,
      rename: "olmo.ts",
      data: {
        randomWord: generateRandomWord(["a", "c", "e", "g", "i", "m", "s"], 8),
      },
    }),
  );
  await runIfDevAndMissingFile(join(project.root, ".olmo.ts"), () =>
    filer(".olmo.ts__tpl__", {
      base: paths.self.templates,
      dest: project.root,
      rename: ".olmo.ts",
    }),
  );
};
checkOlmoConfig.meta = { title: "Ensure olmo.ts files" };

/**
 * Create dummy files that are usually required to run the website locally,
 * wihout overwriting existing ones.
 */
const checkAutomatedPartials: CliLaravel.Task = async ({ log }) => {
  const filenames = paths.frontend.filenames;
  const dest = paths.frontend.dest.automated;
  const prepend = `{{-- ${getHeaderAutogeneration()} --}}\n\n`;
  const unexisting = filesExist(
    [
      { name: filenames.faviconsPartial, dest },
      { name: filenames.assetsHeadPartial, dest },
      { name: filenames.assetsBodyPartial, dest },
      { name: filenames.svgIconsPartial, dest },
    ],
    log,
    {
      willAutogenerate: true,
    },
  );
  if (unexisting.length) {
    await Promise.all(
      unexisting.map(({ name, dest }) =>
        filer("dummy.blade.php", {
          base: paths.self.templates,
          prepend,
          rename: name,
          dest: dest,
        }),
      ),
    );
  }
};
checkAutomatedPartials.meta = { title: "Check automated partials existence" };

/**
 * Create the required `./config/**` folder files if missing
 */
const checkConfig: CliLaravel.Task = async () => {
  await Promise.all(
    [
      {
        fallback: paths.laravel.tpl.config,
        dest: paths.frontend.dest.config,
      },
    ].map(async ({ fallback, dest }) => {
      await copy(fallback, dest, { overwrite: false });
    }),
  );
};
checkConfig.meta = { title: "Check confguration files" };

const checkRoutes: CliLaravel.Task = async ({ ctx, log }) => {
  await checkRoutesConsistency(log, ctx.useBarba);
};
checkRoutes.meta = { title: "Check routes consistency" };

export const check: CliLaravel.TaskGroup = {
  meta: { /* subject: "check", */ title: "Preliminary checks" },
  children: [checkAutomatedPartials, checkConfig, checkOlmoConfig, checkRoutes],
  parallel: true,
};

type FilesExistFile = {
  name: string;
  dest: string;
};

/**
 * Check files existence
 */
export function filesExist(
  files: FilesExistFile[],
  log: TaskrLog,
  options: {
    willAutogenerate?: boolean;
    verbose?: boolean;
  },
) {
  const unexisting: FilesExistFile[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!existsSync(join(file.dest, file.name))) {
      unexisting.push(file);
    }
  }

  if (!unexisting.length) {
    return unexisting;
  }

  const moreThanOne = unexisting.length > 1;
  let message = "Required ";
  message += moreThanOne ? "files " : "file ";

  for (let j = 0; j < unexisting.length; j++) {
    const file = unexisting[j];
    if (options.verbose) {
      message += log.chalk.bold(file.name);
      message += j < unexisting.length - 1 ? ", " : " ";
    }
  }

  if (options.verbose) {
    message += moreThanOne ? "are " : "is ";
    message += "missing. ";

    if (options.willAutogenerate) {
      message += moreThanOne ? "They have " : "It has ";
      message += "been autogenerated.";
    }

    log(log.chalk.dim(message));
  }

  return unexisting;
}

/**
 * @borrows https://stackoverflow.com/a/69960578/1938970
 */
function generateRandomWord(arr: string[], length: number) {
  return Array.from(
    { length },
    () => arr[Math.floor(Math.random() * arr.length)],
  ).join("");
}

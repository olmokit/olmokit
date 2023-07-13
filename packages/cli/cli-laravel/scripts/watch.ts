import { join } from "node:path";
import { createWatcher } from "../../createWatcher.js";
import { paths } from "../paths/index.js";
import type { CliLaravel } from "../pm.js";
import { clear } from "./clean.js";
import { i18n } from "./i18n.js";
import { svgicons } from "./svgicons.js";

/**
 * Styles and scripts are instead watched by webpack in the `assets.js` task
 */
export const watch: CliLaravel.Task = ({ ctx, log, chalk, runTask }) => {
  return new Promise<void>((resolve) => {
    const taskOptions = { still: true };

    const watchers = [
      createWatcher(join(ctx.project.envPath), true)
        .on("change", () => runTask(clear, taskOptions))
        .on("unlink", () =>
          log.error(`You must have an '.env' file in your root project folder`)
        ),
      createWatcher(join(paths.frontend.src.svgicons, "*.svg")).on(
        "change",
        () => runTask(svgicons, taskOptions)
      ),
      createWatcher(
        join(
          paths.frontend.src.translations,
          paths.frontend.filenames.translations
        )
      ).on("change", () => runTask(i18n, taskOptions)),
    ];

    const handleExit = async () => {
      await Promise.all(watchers.map((watcher) => watcher.close()));
      log.info(`Closed ${chalk.bold(watchers.length)} watchers`);
      resolve();
    };
    // process.on("exit", () => { console.log("on exit"); callback(); });
    process.on("SIGINT", handleExit);
    process.on("SIGTERM", handleExit);
    process.on("SIGQUIT", handleExit);

    resolve();
  });
};
watch.meta = { title: "Watch .env, svgs and translations", still: true };

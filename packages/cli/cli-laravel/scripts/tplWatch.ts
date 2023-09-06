import { join } from "node:path";
import { createWatcher } from "../../createWatcher.js";
import { meta } from "../../meta.js";
import { libraries } from "../helpers/libraries.js";
import { paths } from "../paths/index.js";
import type { CliLaravel } from "../pm.js";
import { processCoreLibrary } from "./core.js";
import {
  tplComponents,
  tplFragments,
  tplLayouts,
  tplMiddlewares,
  tplRoutes,
  tplServices,
  tplUtils,
} from "./tpl.js";

export const tplWatch: CliLaravel.Task = async ({ log, chalk, runTask }) => {
  return new Promise<void>((resolve) => {
    const { src } = paths.frontend;
    const taskOptions = { still: true };
    const { workspaceRoot } = meta;
    const { core } = libraries;

    const watchers = [
      createWatcher(join(src.components, "/**/*.php")).on("all", () =>
        runTask(tplComponents, taskOptions)
      ),
      createWatcher(join(src.fragments, "/**/*.php")).on("all", () =>
        runTask(tplFragments, taskOptions)
      ),
      createWatcher(join(src.layouts, "/**/*.php")).on("all", () =>
        runTask(tplLayouts, taskOptions)
      ),
      createWatcher(join(src.middlewares, "/**/*.php")).on("all", () =>
        runTask(tplMiddlewares, taskOptions)
      ),
      createWatcher(join(src.routes, "/**/*.{php,json}")).on("all", () =>
        runTask(tplRoutes, taskOptions)
      ),
      createWatcher(join(src.services, "/**/*.php")).on("all", () =>
        runTask(tplServices, taskOptions)
      ),
      createWatcher(join(src.utils, "/**/*.php")).on("all", () =>
        runTask(tplUtils, taskOptions)
      ),
    ];

    if (core.locallyLinked && workspaceRoot) {
      const { elements, info, syncer } = processCoreLibrary((lib, name) => {
        // target and sync php files from source, not from the `dist` folder
        // they should be the same anyway
        const dirInDevRepo = join(workspaceRoot, "/packages/", lib.slug);

        return join(dirInDevRepo, name);
      });

      elements.forEach((el) => {
        watchers.push(
          createWatcher(join(el.dir, "/**/*.php")).on("all", () => {
            syncer(el);
            log(`Synced with ${info()}`);
          })
        );
      });
    }

    const handleExit = async () => {
      await Promise.all(watchers.map((watcher) => watcher.close()));
      log.info(`Closed ${chalk.bold(watchers.length)} templates watchers`);
      resolve();
    };
    // process.on("exit", () => { console.log("on exit"); callback(); });
    process.on("SIGINT", handleExit);
    process.on("SIGTERM", handleExit);
    process.on("SIGQUIT", handleExit);

    resolve();
  });
};
tplWatch.meta = { title: "Watch templates (blade and php)", still: true };

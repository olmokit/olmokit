import { readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { filer } from "@olmokit/cli-utils/filer";
import { runIfDevAndMissingFile } from "../../helpers-getters.js";
import { meta } from "../../meta.js";
import { getProjectJsGlobals } from "../helpers/index.js";
import { paths } from "../paths/index.js";
import type { CliLaravel } from "../pm.js";

/**
 * Create .vscode folder with settings.json if missing
 */
const configureEditor: CliLaravel.Task = ({ ctx }) =>
  runIfDevAndMissingFile(
    join(ctx.project.root, "/.vscode/settings.json"),
    () => filer(".vscode/settings.json", {
      base: paths.self.templates,
      data: {
        prefix: "${dirty} ",
        packageName: basename(ctx.project.root), // pkg.name
        suffix: " - ${activeFolderMedium}",
      },
      dest: ctx.project.root,
    })
  );
configureEditor.meta = { title: "IDE settings" };

/**
 * Create basic global types made available by this scripts to the project,
 * tsconfig.json will include a path to these types.
 *
 * FIXME: this should be watched and re-generated based on olmo.config.ts
 */
const configureJsTypes: CliLaravel.Task = async ({ ctx }) => {
  const globals = getProjectJsGlobals(ctx);
  const globalConfig = await readFile(
    join(paths.self.templates, "globals_config.d.ts"),
    { encoding: "utf-8" }
  );

  await filer("globals.d.ts__tpl__", {
    base: paths.self.templates,
    data: { globals, packageName: meta.name, globalConfig },
    rename: `${meta.name.replace(/@/g, "").replace(/\//g, "-")}.d.ts`,
    dest: join(ctx.project.nodeModules, "/@types"),
  });
};
configureJsTypes.meta = { title: "globals.d.ts definitions" };

/**
 * Create JavaScript/TypeScript configuration base file in project's source
 */
const configureJsConfig: CliLaravel.Task = async ({ ctx }) => {
  // FIXME: generate the tsconfig paths dynamically in sync with webpack aliases
  await filer("tsconfig.json__tpl__", {
    base: paths.self.templates,
    data: {
      srcFolder: paths.frontend.src.folder,
    },
    rename: "tsconfig.json",
    dest: ctx.project.root,
  });
};
configureJsConfig.meta = { title: "tsconfig.json" };

export const configure: CliLaravel.TaskGroup = {
  meta: { title: "Configure basic files" },
  children: [configureEditor, configureJsTypes, configureJsConfig],
  parallel: true,
};

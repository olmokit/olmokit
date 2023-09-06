import { readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { filer } from "@olmokit/cli-utils/filer";
import { runIfDevAndMissingFile } from "../../helpers-getters.js";
import { meta } from "../../meta.js";
import { project } from "../../project.js";
import { getProjectJsGlobals } from "../helpers/index.js";
import { libraries } from "../helpers/libraries.js";
import { paths } from "../paths/index.js";
import type { CliLaravel } from "../pm.js";

const globalsDtsFilename = `${meta.name
  .replace(/@/g, "")
  .replace(/\//g, "-")}.d.ts`;

const globalsDtsFiledir = "@types";

const configurePackageManager: CliLaravel.Task = () =>
  filer(".npmrc", {
    base: paths.self.templates,
    dest: project.root,
  });
configurePackageManager.meta = { title: "Package manager settings" };

const configureEditor: CliLaravel.Task = () =>
  runIfDevAndMissingFile(join(project.root, "/.vscode/settings.json"), () =>
    filer(".vscode/settings.json", {
      base: paths.self.templates,
      data: {
        prefix: "${dirty} ",
        packageName: basename(project.root), // pkg.name
        suffix: " - ${activeFolderMedium}",
      },
      dest: project.root,
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
    rename: globalsDtsFilename,
    dest: join(project.nodeModules, `/${globalsDtsFiledir}`),
  });
};
configureJsTypes.meta = { title: "globals.d.ts definitions" };

const configureJsConfig: CliLaravel.Task = async () => {
  const { core: coreLib } = libraries;
  const files = [`./node_modules/${globalsDtsFiledir}/${globalsDtsFilename}`];
  if (coreLib.exists) {
    files.push(`./node_modules/${coreLib.name}/globals.d.ts`);
  }

  // FIXME: generate the tsconfig paths dynamically in sync with webpack aliases
  await filer("tsconfig.json__tpl__", {
    base: paths.self.templates,
    data: {
      srcFolder: paths.frontend.src.folder,
      files: files.map((path) => `    "${path}"`).join(",\n"),
    },
    rename: "tsconfig.json",
    dest: project.root,
  });
};
configureJsConfig.meta = { title: "tsconfig.json" };

export const configure: CliLaravel.TaskGroup = {
  meta: { title: "Configure basic files" },
  children: [
    configurePackageManager,
    configureEditor,
    configureJsTypes,
    configureJsConfig,
  ],
  parallel: true,
};

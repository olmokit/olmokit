import { join } from "node:path";
import { paramCase, pascalCase } from "change-case";
import { globSync } from "glob";
import { filer } from "@olmokit/cli-utils/filer";
import { type Library, libraries } from "../helpers/libraries.js";
import { paths } from "../paths/index.js";
import type { CliLaravel } from "../pm.js";

type CoreElement = { dir: string; name: string };

export function processCoreLibrary(
  getBase: (library: Library, elementName: string) => string
) {
  const { core: lib } = libraries;
  const elements: CoreElement[] = [];
  const info = (name?: string) =>
    lib
      ? lib.locallyLinked
        ? `${lib.name}${name ? `/${name}` : ``}@local-version`
        : `${lib.name}${name ? `/${name}` : ``}@${lib.packageJson?.version}`
      : "";

  if (lib.exists) {
    const folders = globSync("*", {
      cwd: lib.src,
      withFileTypes: true,
    })
      .filter((path) => path.isDirectory() && path.name !== "node_modules")
      .map((path) => path.name);

    for (let i = 0; i < folders.length; i++) {
      const name = folders[i];
      elements.push({
        dir: getBase(lib, name),
        name,
      });
    }
  }

  return {
    ...lib,
    elements,
    info,
    syncer: async (el: CoreElement) => {
      return await filer("**/*.php", {
        base: el.dir,
        glob: {
          ignore: join(el.dir, "/(node_modules|examples)/**/*.php"),
        },
        append: ({ basename }) => {
          if (basename.endsWith(".blade.php")) {
            return `\n{{-- Synced with ${info(el.name)} --}}`;
          }
          return;
        },
        rename: ({ basename, dir }) => {
          const isBlade = basename.endsWith(".blade.php");
          let name = "";
          // path dirname is e.g. "forms" or "."
          if (!dir || dir === ".") {
            name = isBlade ? el.name : pascalCase(el.name);
          } else {
            name = isBlade ? `${el.name}-` : pascalCase(el.name);
            name += isBlade ? paramCase(dir) : pascalCase(dir);
          }
          if (isBlade) {
            name += ".blade";
          }

          name += ".php";

          return { dir: "", name };
        },
        dest: paths.frontend.dest.core,
      });
    },
  };
}

/**
 * Core, sync core templates
 */
export const core: CliLaravel.Task = async ({ spinner }) => {
  const { elements, info, syncer } = processCoreLibrary((lib, name) =>
    join(lib.path, name)
  );

  if (!elements.length) {
    spinner.warn("There is no core library installed!");
    return;
  }

  // console.log("elements", elements);

  await Promise.all(elements.map(syncer));

  // spinner.succeed(msg);
  spinner.text = `Synced with ${info()}`;
};
core.meta = { title: "Sync core components templates" };

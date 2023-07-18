import { join } from "node:path";
import { paramCase, pascalCase } from "change-case";
import { filer } from "@olmokit/cli-utils/filer";
import { getLibraries } from "../helpers/libraries.js";
import { paths } from "../paths/index.js";
import type { CliLaravel } from "../pm.js";

/**
 * Core, sync core templates
 */
export const core: CliLaravel.Task = async ({ ctx, spinner, chalk }) => {
  const { core: coreLibrary } = getLibraries(ctx);

  if (!coreLibrary.exists) {
    spinner.warn("There is no core library installed!");
    return;
  }

  const pkgInfo = (name?: string) =>
    `"${coreLibrary.name}${name ? "/" + name : ""}" v${
      coreLibrary.packageJson?.version
    }`;

  // TODO: improve this fragile typing
  const folders = coreLibrary.packageJson?.config?.["core-sync"] as string[];
  const items: { dir: string; name: string }[] = [];
  const names: string[] = [];

  for (let i = 0; i < folders.length; i++) {
    const name = folders[i];
    items.push({
      dir: join(coreLibrary.path, "/" + name),
      name,
    });
    if (!names.includes(name)) {
      names.push(name);
    }
  }

  // console.log("items", items);

  await Promise.all([
    items.map(async (item) => {
      return await filer("**/*.php", {
        base: item.dir,
        glob: {
          ignore: join(item.dir, "/(node_modules|examples)/**/*.php"),
        },
        append: ({ basename }) => {
          if (basename.endsWith(".blade.php")) {
            return `\n{{-- Synced with "${pkgInfo(item.name)} --}}`;
          }
          return;
        },
        rename: ({ basename, dir }) => {
          const isBlade = basename.endsWith(".blade.php");
          let name = "";
          // path dirname is e.g. "forms" or "."
          if (!dir || dir === ".") {
            name = isBlade ? item.name : pascalCase(item.name);
          } else {
            name = isBlade ? `${item.name}-` : pascalCase(item.name);
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
    }),
  ]);

  // spinner.succeed(msg);
  spinner.text = `Synced with ${pkgInfo()}`;
};
core.meta = { title: "Sync core components templates" };

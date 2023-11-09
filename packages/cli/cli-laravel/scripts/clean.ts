import { join } from "node:path";
import { rimraf } from "rimraf";
import { project } from "../../project.js";
import { execArtisan } from "../helpers/execArtisan.js";
import { paths } from "../paths/index.js";
import type { CliLaravel } from "../pm.js";
import { tplServices } from "./tpl.js";

/**
 * Clean storage and public
 */
const cleanStorageAndPublic: CliLaravel.Task = async () => {
  const root = project.root;

  await rimraf([
    join(root, "bootstrap/cache/**/*"),
    // join(root, "storage/**/*"),
    join(root, "storage/app/*"),
    join(root, "storage/app/public/**/*"),
    join(root, "storage/debugbar/**/*"),
    join(root, "storage/framework/cache/**/*"),
    // join(root, "storage/framework/sessions/**/*"),
    join(root, "storage/framework/testing/**/*"),
    join(root, "storage/framework/views/**/*"),
    join(root, "storage/logs/**/*"),
    join(paths.frontend.dest.assets),
    join(paths.frontend.dest.public, "page-cache"),
  ]);
};
cleanStorageAndPublic.meta = { title: "Clean storage and public folder" };

/**
 * On production we should not remove old scripts and styles as they can be long
 * term cached with long expiry-headers. Locally we can instead clear the
 * compiled assets scripts and styles.
 */
export const cleanAssets: CliLaravel.Task = async () => {
  await rimraf(
    [
      // clear everything except favicons
      join(paths.frontend.dest.assets, "*.*"),
      join(paths.frontend.dest.images, "**/*"),
      join(paths.frontend.dest.media, "**/*"),
      join(paths.frontend.dest.fonts, "**/*"),
      join(paths.frontend.dest.chunks, "**/*"),
      join(paths.frontend.dest.entries, "**/*"),
    ],
    { glob: true }
  );
};
cleanAssets.meta = { title: "Clean compiled assets" };

/**
 * Clean compiled template files location
 */
const cleanTpl: CliLaravel.Task = async () => {
  await rimraf(join(paths.frontend.dest.base, "**/*"), {
    glob: true,
  });
};
cleanTpl.meta = { title: "Clean laravel compiled templates" };

/**
 * Clean the Laravel caches
 */
export const clear: CliLaravel.Task = async (arg) => {
  const commands = [
    ["config:clear"],
    ["config:cache"],
    ["route:clear"],
    ["view:clear"],
    ["cacher:clear", "data"],
    ["page-cache:clear"],
  ];
  for (let i = 0; i < commands.length; i++) {
    await execArtisan(commands[i], arg.ora);
  }
  await tplServices(arg);
};
clear.meta = { title: "Clear Laravel caches", ownLog: ["start", "end"] };

export const clean: CliLaravel.TaskGroup = {
  meta: { title: "Clean all generated files" },
  children: [cleanTpl, cleanAssets, cleanStorageAndPublic],
  parallel: true,
};

export const wipe: CliLaravel.TaskGroup = {
  meta: { title: "Wipe out everything" },
  children: [clear, clean],
  parallel: false,
};

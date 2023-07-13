import { join } from "node:path";
import { glob } from "glob";
import { touchFiles } from "../../touchFiles.js";
import { paths } from "../paths/index.js";

/**
 * Touch files in order to change their timestamps and force lftp to update them
 * despite having the same byte length. Esclude node_modules, git, source, images
 * and fonts' files from the process.
 */
export async function touch() {
  // TODO: verify that this glob works correctly (especially the negations)
  const filepaths = await glob([
    join(paths.frontend.dest.base, "/**/*"),
    // FIXME: not sure why we had files in `src` here...
    `!${join(paths.frontend.src.base, "/**/*")}`,
    `!${join(paths.frontend.dest.images, "/**/*")}`,
    `!${join(paths.frontend.dest.fonts, "/**/*")}`,
  ]);
  await touchFiles(filepaths);
}

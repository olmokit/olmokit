import { dirname, join, relative, resolve } from "node:path";
import { globSync } from "glob";
import { paths } from "../paths/index.js";

/**
 * Create dynamic entries based on folder structure
 */
export default () => {
  const srcPath = paths.frontend.src.routes;
  const files = globSync(join(srcPath, "**/index.{js,ts}"));
  const entries: Record<string, string[]> = {};

  files.forEach((filePath) => {
    const folderName = dirname(relative(srcPath, filePath));
    const name = `${folderName}`;
    entries[name] = [
      resolve(filePath),
      resolve(filePath).replace(".js", ".scss").replace(".ts", ".scss"),
    ];
  });

  return entries;
};

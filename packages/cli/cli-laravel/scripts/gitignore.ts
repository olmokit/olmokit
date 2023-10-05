import { join } from "node:path";
import { filer } from "@olmokit/cli-utils/filer";
import { runIfDevAndMissingFile } from "../../helpers-getters.js";
import { project } from "../../project.js";
import { paths } from "../paths/index.js";
import type { CliLaravel } from "../pm.js";

export const gitignore: CliLaravel.Task = async () => {
  return runIfDevAndMissingFile(join(project.root, ".gitignore"), () =>
    filer("gitignore", {
      base: paths.self.templates,
      rename: ".gitignore",
      dest: project.root,
    }),
  );
};
gitignore.meta = { title: "Ensure .gitignore file" };

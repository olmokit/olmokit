import { join } from "node:path";
import { filer } from "@olmokit/cli-utils/filer";
import { runIfDevAndMissingFile } from "../../helpers-getters.js";
import { paths } from "../paths/index.js";
import type { CliLaravel } from "../pm.js";

export const gitignore: CliLaravel.Task = async ({ ctx }) => {
  return runIfDevAndMissingFile(
    join(ctx.project.root, ".gitignore"),
    () => filer("gitignore", {
      base: paths.self.templates,
      rename: ".gitignore",
      dest: ctx.project.root,
    })
  );
};
gitignore.meta = { title: "Ensure .gitignore file" };

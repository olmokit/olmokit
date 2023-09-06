import { paramCase, sentenceCase } from "change-case";
import { filer } from "@olmokit/cli-utils/filer";
import { getEnvVarsByEnvNameList } from "../../config-env.js";
import { project } from "../../project.js";
import { paths } from "../paths/index.js";
import type { CliLaravel } from "../pm.js";

/**
 * Create readme file
 */
export const readme: CliLaravel.Task = async ({ ctx }) => {
  const title = project.title;
  const repo = project.repo;

  await filer("README.md__tpl__", {
    base: paths.self.templates,
    data: {
      slug: paramCase(title),
      title: sentenceCase(title),
      repo,
      envs: getEnvVarsByEnvNameList(ctx),
    },
    rename: "README.md",
    dest: project.root,
  });
};
readme.meta = { title: "Ensure README.md file" };

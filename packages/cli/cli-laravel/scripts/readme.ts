import { paramCase, sentenceCase } from "change-case";
import { filer } from "@olmokit/cli-utils/filer";
import { getEnvVarsByEnvNameList } from "../../config-env.js";
import { paths } from "../paths/index.js";
import type { CliLaravel } from "../pm.js";

/**
 * Create readme file
 *
 * FIXME: some mapped data gathered from the env is not right here...
 */
export const readme: CliLaravel.Task = async ({ ctx }) => {
  const title = ctx.project.title;
  const repo = ctx.project.repo;

  await filer("README.md__tpl__", {
    base: paths.self.templates,
    data: {
      slug: paramCase(title),
      title: sentenceCase(title),
      repo,
      envs: getEnvVarsByEnvNameList(ctx),
    },
    rename: "README.md",
    dest: ctx.project.root,
  });
};
readme.meta = { title: "Ensure README.md file" };

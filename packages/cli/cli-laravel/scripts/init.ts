import ci from "ci-info";
import { configBuild } from "../../config-build.js";
import type { CliLaravel } from "../pm.js";

const devPre: CliLaravel.Task = async ({ ctx }) => {
  configBuild(ctx, { publicPath: "/", publicUrl: "/" });
};
devPre.meta = { title: "Update build information" };

export const init: CliLaravel.TaskGroup = {
  meta: {
    title: ":no",
    whether: () => (ci.isCI ? false : true),
  },
  children: [
    () => import("./clean.js").then((mod) => mod.clean),
    () => import("./setup.js").then((mod) => mod.setup),
    () => import("./check.js").then((mod) => mod.check),
    () => import("./env.js").then((mod) => mod.env),
    {
      meta: { title: ":auto" },
      children: [
        () => import("./configure.js").then((mod) => mod.configure),
        () => import("./readme.js").then((m) => m.readme),
        () => import("./pkg.js").then((m) => m.pkg),
        () => import("./gitignore.js").then((m) => m.gitignore),
        () => import("./htaccess.js").then((m) => m.htaccess),
        () => import("./tplBuild.js").then((m) => m.tplBuild),
        () => import("./i18n.js").then((m) => m.i18nTranslations),
      ],
      parallel: true,
    },
  ],
};

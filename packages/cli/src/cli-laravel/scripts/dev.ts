import { configBuild } from "../../config-build.js";
import type { CliLaravel } from "../pm.js";

const devPre: CliLaravel.Task = async ({ ctx }) => {
  configBuild(ctx, { publicPath: "/", publicUrl: "/" });
};
devPre.meta = { title: "Update build information" };

export const dev: CliLaravel.TaskGroup = {
  meta: { title: ":no" },
  children: [
    {
      meta: { title: ":auto" },
      children: [
        devPre,
        () => import("./clean.js").then((mod) => mod.clean),
        () => import("./setup.js").then((mod) => mod.setup),
        () => import("./check.js").then((mod) => mod.check),
        () => import("./env.js").then((mod) => mod.env),
      ],
    },
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
        () => import("./svgicons.js").then((m) => m.svgicons),
        () => import("./assets.js").then((m) => m.assets),
      ],
      parallel: true,
    },
    {
      meta: { title: "Watch sources", still: true },
      children: [
        () => import("./tplWatch.js").then((m) => m.tplWatch),
        () => import("./watch.js").then((m) => m.watch),
        () => import("./assetsWatch.js").then((m) => m.assetsWatch),
      ],
    },
  ],
};

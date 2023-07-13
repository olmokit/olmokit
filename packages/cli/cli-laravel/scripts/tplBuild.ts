import type { CliLaravel } from "../pm.js";
import { core } from "./core.js";
import {
  tplComponents,
  tplFragments,
  tplLaravel,
  tplLayouts,
  tplMiddlewares,
  tplRoutes,
  tplServices,
  tplUtils,
} from "./tpl.js";

export const tplBuild: CliLaravel.TaskGroup = {
  meta: { title: "Build template files (blade templates and php)" },
  children: [
    core,
    tplComponents,
    tplFragments,
    tplLaravel,
    tplLayouts,
    tplMiddlewares,
    tplRoutes,
    tplServices,
    tplUtils,
  ],
  parallel: true,
};

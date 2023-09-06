import { join } from "node:path";
import { project } from "../../project.js";
import { pathsSelf } from "./self.js";

const root = project.root;
const tplPath = join(pathsSelf.templates, "laravel-frontend");
const libPath = join(root, "vendor", "olmo/laravel-frontend");
const appPath = root;

const appFolders = {
  bootstrap: "bootstrap",
  config: "config",
  public: "public",
  resources: "resources",
  routes: "routes",
  storage: "storage",
};

/**
 * All default paths are defined here
 */
export const pathsLaravel = {
  tpl: {
    base: tplPath,
    bootstrap: join(tplPath, "bootstrap"),
    config: join(tplPath, "config"),
    public: join(tplPath, "public"),
  },
  lib: {
    base: libPath,
    bootstrap: join(libPath, "bootstrap"),
    config: join(libPath, "config"),
    public: join(libPath, "public"),
    routes: join(libPath, "routes"),
    src: join(libPath, "src"),
  },
  app: {
    folders: appFolders,
    base: appPath,
    bootstrap: join(appPath, appFolders.bootstrap),
    config: join(appPath, appFolders.config),
    public: join(appPath, appFolders.public),
    resources: join(appPath, appFolders.resources),
    routes: join(appPath, appFolders.routes),
    storage: join(appPath, appFolders.storage),
  },
};

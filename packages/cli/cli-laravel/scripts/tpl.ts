import { join, relative } from "node:path";
import { unlinkSync, existsSync } from "fs";
import { camelCase, pascalCase } from "change-case";
import { glob } from "glob";
import { type FilerTranformerArg, filer } from "@olmokit/cli-utils/filer";
import { getHeaderAutogeneration } from "../../helpers-getters.js";
import {
  filePathToNamespace,
  getClassPropertyValue,
  getFileClass,
} from "../helpers/php.js";
import { getBarbaRoutes } from "../helpers/route.js";
import { paths } from "../paths/index.js";
import type { CliLaravel } from "../pm.js";

type Middleware = { name: string; classPath: string };

type Middlewares = {
  global: Middleware[];
  web: Middleware[];
  named: Middleware[];
};

/**
 * Rename Laravel PHP files
 *
 * Here we define a common behaviour used to sync/treat/manage files from `/src`
 * to `/resources` inside a Laravel setup
 *
 * - Flatten `index` file names by using only the folder name
 * - Flatten nested folder names into file name (manage this by passing a custom
 * transformer)
 *
 * @param transformer A custom string transformer, e.g. < `pascalCase` function
 */
function renameLaravelPhpFiles(
  { basename, dir, path }: FilerTranformerArg,
  transformer: (input: string) => string
) {
  const isBlade = basename.endsWith(".blade.php");
  const filename = path.basename(basename, isBlade ? ".blade.php" : ".php");
  const isIndex = filename === "index";
  let name = "";

  if (isIndex) {
    name = transformer(dir);
  } else {
    name = transformer(dir + "-" + filename);
  }

  if (isBlade) name += ".blade";

  name += ".php";

  return { dir: "", name };
}

/**
 * Inspects the src/middlewares folder and determine if there are any custom
 * middlewares to automaticlaly register
 */
async function getMiddlewaresToRegister() {
  const files = await glob(join(paths.frontend.src.middlewares, "**/*.php"));

  const middlewares: Middlewares = {
    global: [],
    web: [],
    named: [],
  };

  files.forEach((filePath) => {
    const phpClass = getFileClass(filePath);

    if (phpClass) {
      const relativePath = relative(paths.frontend.src.middlewares, filePath);
      const name = getClassPropertyValue("name", phpClass);
      const classPath =
        filePathToNamespace("resources/middlewares", relativePath) + "::class";
      const middleware = { name, classPath };

      if (!name || name === "global") {
        middlewares.global.push(middleware);
      } else if (name === "web") {
        middlewares.web.push(middleware);
      } else {
        middlewares.named.push(middleware);
      }
    }
  });

  return middlewares;
}

const tplLaravelPublic: CliLaravel.Task = async () => {
  filer("**/*.php", {
    base: paths.laravel.tpl.public,
    dest: paths.laravel.app.public,
  });
  
  /** Delete htaccess file in the public folder */  
  if(process.env.HOSTING_TYPE == "shared"){
    const destFolder = paths.frontend.dest.public;
    const pathHtaccessPublic = join(
      destFolder,
      `.htaccess`
    );      
    if(existsSync(pathHtaccessPublic)){      
      await unlinkSync(pathHtaccessPublic);
      console.log('.htaccess in Public folder deleted');
    }
  }  
};
tplLaravelPublic.meta = { title: "public folder" };

const tplLaravelBootstrap: CliLaravel.Task = async () => {
  filer("**/*.php", {
    base: paths.laravel.tpl.bootstrap,
    dest: paths.laravel.app.bootstrap,
  });
};
tplLaravelBootstrap.meta = { title: "bootstrap folder" };

const tplLaravelBootstrapCache: CliLaravel.Task = async () => {
  filer("gitignore-folder", {
    base: paths.self.templates,
    rename: ".gitignore",
    dest: join(paths.laravel.app.bootstrap, "cache"),
  });
};
tplLaravelBootstrapCache.meta = { title: "bootstrap/cache folder" };

const tplLaravelStorage: CliLaravel.Task = async () => {
  const storage = paths.laravel.app.storage;

  await filer("gitignore-folder", {
    base: paths.self.templates,
    rename: ".gitignore",
    dest: [
      join(storage, "app"),
      join(storage, "app/public"),
      join(storage, "debugbar"),
      join(storage, "framework"),
      join(storage, "framework/cache"),
      join(storage, "framework/sessions"),
      join(storage, "framework/testing"),
      join(storage, "framework/views"),
      join(storage, "logs"),
    ],
  });
};
tplLaravelStorage.meta = { title: "storage folder" };

const tplLaravelArtisan: CliLaravel.Task = async () => {
  await filer("artisan", {
    base: paths.laravel.tpl.base,
    dest: paths.laravel.app.base,
  });
};
tplLaravelArtisan.meta = { title: "artisan file" };

export const tplLaravel: CliLaravel.TaskGroup = {
  meta: { title: "Copy laravel basic files" },
  children: [
    tplLaravelPublic,
    tplLaravelBootstrap,
    tplLaravelBootstrapCache,
    tplLaravelStorage,
    tplLaravelArtisan,
  ],
  parallel: true,
};

export const tplComponents: CliLaravel.Task = async () => {
  await filer("**/*.php", {
    base: paths.frontend.src.components,
    rename: (arg) => {
      return renameLaravelPhpFiles(arg, pascalCase);
    },
    dest: paths.frontend.dest.components,
  });
};
tplComponents.meta = { title: "Compile laravel components" };

export const tplFragments: CliLaravel.Task = async () => {
  await filer("**/*.php", {
    base: paths.frontend.src.fragments,
    // rename: (arg) => {
    //   return renameLaravelPhpFiles(arg, (s) => s);
    // },
    dest: paths.frontend.dest.fragments,
  });
};
tplFragments.meta = { title: "Compile laravel fragments" };

export const tplLayouts: CliLaravel.Task = async () => {
  await filer("**/*.php", {
    base: paths.frontend.src.layouts,
    rename: (arg) => {
      return renameLaravelPhpFiles(arg, camelCase);
    },
    dest: paths.frontend.dest.layouts,
  });
};
tplLayouts.meta = { title: "Compile laravel layouts" };

export const tplMiddlewares: CliLaravel.Task = async () => {
  await filer("**/*.php", {
    base: paths.frontend.src.middlewares,
    dest: paths.frontend.dest.middlewares,
  });
  const middlewares = await getMiddlewaresToRegister();

  await filer(paths.frontend.filenames.middlewares, {
    base: paths.self.templates,
    data: middlewares,
    append: `\n// ${getHeaderAutogeneration()}\n`,
    dest: paths.frontend.dest.middlewares,
  });
};
tplMiddlewares.meta = { title: "Compile laravel middleware" };

const tplRoutesLaravel: CliLaravel.Task = async () => {
  await filer("**/*.{php,json}", {
    base: paths.frontend.src.routes,
    rename: (arg) => {
      const isAtRoot = arg.dir === "." || !arg.dir;

      // don't transform files that are direct child of src/routes, this
      // allows to have some custom controllers and routes outside of the
      // strictier conventions of laravel-frontend
      if (isAtRoot) return;

      return renameLaravelPhpFiles(arg, (name) => `Route${pascalCase(name)}`);
    },
    dest: paths.frontend.dest.routes,
  });
};
tplRoutesLaravel.meta = { title: "Compile laravel routes" };

const tplRoutesBarba: CliLaravel.Task = async () => {
  const routes = await getBarbaRoutes();

  await filer("routesBarba.ts__tpl__", {
    base: paths.self.templates,
    data: { routes },
    // prepend: `// ${getHeaderAutogeneration()}\n\n`,
    rename: "routesBarba.ts",
    dest: paths.frontend.src.vendor,
  });
};
tplRoutesBarba.meta = { title: "Create assets for barba.js" };

export const tplRoutes: CliLaravel.TaskGroup = {
  meta: { title: "Compile routes" },
  children: [tplRoutesLaravel, tplRoutesBarba],
};

export const tplServices: CliLaravel.Task = async () => {
  await filer("**/*.php", {
    base: paths.frontend.src.services,
    dest: paths.frontend.dest.services,
  });
};
tplServices.meta = { title: "Compile laravel services" };

export const tplUtils: CliLaravel.Task = async () => {
  filer("**/*.blade.php", {
    base: paths.frontend.src.utils,
    // keep the names as they are here
    // rename: (arg) => {
    //   return renameLaravelPhpFiles(arg, camelCase);
    // },
    dest: paths.frontend.dest.utils,
  });
};
tplUtils.meta = { title: "Compile laravel utils" };

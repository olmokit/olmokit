/**
 * @file
 *
 * This script automatically adds all the required `exports` to libs `package.json`s
 * in order to make deep imports work within node resolution.
 */
import { relative } from "node:path";
import type {
  AmdConfig,
  CommonJsConfig,
  Es6Config,
  NodeNextConfig,
  UmdConfig,
  Config as _SWCConfig,
} from "@swc/core";
import chalk from "chalk";
import { Command } from "commander";
import { glob } from "glob";
import { oraPromise } from "ora";
import { PackageJson, TsConfigJson } from "type-fest";
import { editJsonFile } from "../packages/cli-utils/src/index.js";
import { oraOpts } from "./dev.js";
import { type Lib, self } from "./helpers.js";

// FIXME: to fix in swc? just exclude `SystemjsConfig` because it does not extends `BaseModuleConfig`
type SWCConfig = Omit<_SWCConfig, "module"> & {
  module: Es6Config | NodeNextConfig | CommonJsConfig | UmdConfig | AmdConfig;
};

export const libs = () =>
  new Command("libs")
    .description("Manage libs exports/bundling")
    .action(async () => {
      await Promise.all(
        self()
          .libs.filter((lib) => lib.packager === "npm" && lib.packageJson)
          .map(async (lib) => {
            const suffixText = chalk.dim(`${lib.name}`);

            await oraPromise(writeLibExports(lib), {
              ...oraOpts,
              suffixText,
              text: "Write exports",
            });

            await oraPromise(ensurePackageVersion(lib), {
              ...oraOpts,
              suffixText,
              text: "Ensure package version",
            });

            await oraPromise(setLibOptions(lib), {
              ...oraOpts,
              suffixText,
              text: "Set lib 'module' type",
            });
          }),
      );

      console.log();
    });

function getLibExport(lib: Lib, name?: string, path?: string) {
  name = name ? `./${name}` : ".";
  const exportPath = path ? `./src/${path}` : "./src/index.js";
  const obj: { import?: string; require?: string /* ; types: string; */ } = {
    // types: exportPath.replace(/\.js$/, ".d.ts")
  };

  if (lib.exports) {
    if (lib.exports.includes("cjs")) {
      obj.require = exportPath;
    }

    if (lib.exports.includes("esm")) {
      obj.import = lib.exports.includes("cjs")
        ? exportPath.replace(/\.js$/, ".mjs")
        : exportPath;
    }
  }

  return { name, obj };
}

async function writeLibExports(lib: Lib) {
  if (typeof lib.exports === "undefined" || lib.exports === "asIs") {
    return;
  }

  if (lib.exports === "none") {
    await editJsonFile(lib.root, "package.json", (data) => {
      delete data.exports;
    });

    return;
  }

  // FIXME: once we have fully migrated to ts we can remove "js"
  const paths = await glob("**/*.{js,ts,tsx,scss}", {
    cwd: lib.src,
    ignore: [
      // ignore node_modules
      lib.src + "/node_modules/**/*",
      // ignore executables
      lib.src + "/bin/*.ts",
      // root index is already exported by `exports: { ".": { import: "./index.js" } }`
      lib.src + "/index.ts",
      // avoid to export configuration files!
      // lib.src + "/jest.config.{js,ts}",
      // lib.src + "/postcss.config.{js.ts}",
      // lib.src + "/tailwind.config.{js.ts}",
      lib.src + "/*.config.{js,ts}",
      // ignore typings
      lib.src + "/*.d.ts",
      // ignore "private" files prefixed with `_` (local convention)
      lib.src + "/_*.ts",
      // ignore tests
      lib.src + "/*.{spec,test}.{js,ts,tsx}",
    ],
  });

  const pathsToExports = paths.sort();

  // console.log(`${lib.name}:`, pathsToExports);

  const defaultExp = getLibExport(lib);
  const exports = pathsToExports.reduce(
    (map, path) => {
      const isScssFile = path.endsWith(".scss");
      // FIXME: once we have fully migrated to ts we can remove "|\.js" in regex
      const name = isScssFile
        ? path
        : path.replace(/\.tsx|\.ts|\.js$/, "").replace(/\/index$/, "");
      const jsFilePath = `${path.replace(/\.tsx|\.ts$/, ".js")}`;
      const exp = getLibExport(lib, name, jsFilePath);
      map[exp.name] = exp.obj;

      // EXP: trying to export both names with and without .js extension
      // probably not needed? doing it while fighting with nextjs build
      // if (!isScssFile && name) {
      //   const expWithJs = getLibExport(lib, name + ".js", jsFilePath);
      //   map[expWithJs.name] = exp.obj;
      // }

      return map;
    },
    {
      [defaultExp.name]: defaultExp.obj,
    } as Record<string, object>,
  );

  await editJsonFile(lib.root, "package.json", (data) => {
    data.exports = exports;
  });
}

/**
 * This is here because NX that does not update correctly the built lib's
 * package.json with the inner dependencies among libs packages if each lib's
 * package does not specify a version in its package.json.
 */
async function ensurePackageVersion(lib: Lib) {
  await editJsonFile<PackageJson>(lib.root, "package.json", (data) => {
    data.version = data.version || self().packageJson.version;
  });
}

function overrideByLibType<T, L extends NonNullable<Lib["type"]>>(
  option: T,
  libType: L,
  override: Record<L, NonNullable<T>>,
) {
  option = override[libType];
}

async function setLibOptions(lib: Lib) {
  await editJsonFile<SWCConfig>(lib.root, ".swcrc", (data) => {
    data.module = data.module || ({} as SWCConfig["module"]);

    if (lib.type !== "none") {
      overrideByLibType(data.module.type, lib.type, {
        module: "es6",
        commonjs: "commonjs",
      });
      // overrideByLibType(data.module.importInterop, lib.type, "swc");

      // FIXME: this is not yet supported officially?
      // overrideByLibType(data.module.importInterop, lib.type, {
      //   module: "none",
      //   commonjs: "node"
      // });
      delete data.module.importInterop;
    }

    data.minify = !!lib.minify;

    // exclude some `.d.ts` files otherwise they get compield into empty `.d.js`
    // file, if we want to include those files in the publishable build they
    // need to be defined in the `options.assets` of the package's `project.json`
    // particularly we are interested in "./typings.d.ts" and "./globals.d.ts"
    const exclude = Array.isArray(data.exclude)
      ? data.exclude
      : [data.exclude || ""];
    data.exclude = Array.from(new Set([...exclude, "./*\\.d.ts"]));
  });

  await editJsonFile<TsConfigJson>(lib.root, "tsconfig.json", (data) => {
    if (lib.type && lib.type !== "none") {
      data.compilerOptions = data.compilerOptions || {};
      overrideByLibType(data.compilerOptions.module, lib.type, {
        module: "ESNext",
        commonjs: "CommonJS",
      });
    }
  });

  await editJsonFile<PackageJson>(lib.root, "package.json", (data) => {
    if (lib.type === "none") {
      delete data.type;
    } else if (lib.type === "commonjs") {
      delete data.type;
    } else {
      data.type = lib.type;
    }
  });
}

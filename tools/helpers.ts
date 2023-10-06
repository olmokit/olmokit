import { createRequire } from "node:module";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { globSync } from "glob";
import {
  type ComposerJson,
  type PackageJson,
  getComposerDependenciesNameAndVersion,
  getNpmDependenciesNameAndVersion,
} from "../packages/cli-utils/index.js";

type LibShared = LibConfig & {
  scope: string;
  src: string;
  dist: string;
  slug: string;
  name: string;
  version: string;
  // deps: Record<string, string>;
  internalDeps: string[];
  linkPath: string;
};

export type LibNpm = LibShared & {
  packager: "npm";
  packageJson: PackageJson;
};

export type LibComposer = LibShared & {
  packager: "composer";
  composerJson?: ComposerJson;
};

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const require = createRequire(import.meta.url);

export type Lib = LibNpm | LibComposer;

type LibConfig = {
  slug: string;
  /**
   * Set to explicit `"none"` to delete the key/value if found
   */
  type?: "none" | "module" | "commonjs";
  /**
   * Set to explicit `"none"` to delete the key/value if found
   */
  exports?: "asIs" | "none" | ("esm" | "cjs")[];
  minify?: boolean;
  /**
   * Which version of the package code to globally link
   */
  link?: "source" | "dist";
};

const libsConfig: LibConfig[] = [
  {
    slug: "browser",
    type: "module",
    exports: ["esm"],
    minify: true,
    link: "dist",
  },
  {
    slug: "cli",
    type: "module",
    exports: "asIs",
    minify: false,
    link: "dist",
  },
  {
    slug: "cli-utils",
    type: "module",
    exports: ["esm"],
    minify: true,
    link: "dist",
  },
  {
    slug: "components",
    type: "module",
    exports: ["esm"],
    minify: true,
    link: "dist",
  },
  {
    slug: "core",
    type: "module",
    exports: ["esm"],
    minify: true,
    link: "dist",
  },
  {
    slug: "create-app",
    type: "module",
    exports: "none",
    link: "dist",
  },
  {
    slug: "dom",
    type: "module",
    exports: ["esm"],
    minify: true,
    link: "dist",
  },
  {
    slug: "template-laravel",
    type: "none",
    exports: "none",
    link: "dist",
  },
  {
    slug: "use",
    type: "module",
    exports: "none",
    link: "dist",
  },
  {
    slug: "utils",
    type: "module",
    exports: ["esm"],
    minify: true,
    link: "dist",
  },
];

export const self = () => {
  const root = join(__dirname, "../");
  const tools = join(__dirname, ".");
  const packageJsonPath = join(root, "package.json");
  const packageJson = require(packageJsonPath) as PackageJson;
  const scope = packageJson.name.split("/")[0];
  const libs = getLibs(packageJson, scope);

  return {
    root,
    tools,
    packageJsonPath,
    scope,
    packageJson,
    libs,
    libsNpm: libs.filter((lib) => lib.packager === "npm") as LibNpm[],
    libsComposer: libs.filter(
      (lib) => lib.packager === "composer",
    ) as LibComposer[],
    libsMap: libs.reduce(
      (map, lib) => {
        map[lib.name] = lib;
        return map;
      },
      {} as Record<Lib["name"], Lib>,
    ),
  };
};

function getLibs(rootPackageJson: PackageJson, scope: string): Lib[] {
  // we do not specify the version in the composer.json following what is
  // suggested here https://getcomposer.org/doc/04-schema.md#version
  // we also do not trust the package.json that each package specifies in its
  // package.json.
  // we rely on the version of the root package.json instead as we adhere
  // to the single version policy
  let version = rootPackageJson.version;

  return (
    (globSync(join(__dirname, "../packages/*")) || [])
      .map((src) => {
        const slug = basename(src);
        const config = libsConfig.find((config) => config.slug === slug);
        const dist = join(__dirname, "../dist/packages/", slug);
        let packager: Lib["packager"];
        let packageJson = {} as PackageJson;
        let composerJson = {} as ComposerJson;
        // let deps = {};
        let internalDeps: string[] = [];
        let name = "";
        const linkPath =
          config?.link === "source" ? src : config?.link === "dist" ? dist : "";

        // packager: "npm"
        try {
          packageJson = require(join(dist, "/package.json")) as PackageJson;
          if (packageJson) {
            packager = "npm";
            name = packageJson.name!;
            internalDeps = getNpmDependenciesNameAndVersion(
              packageJson,
              scope,
            ).map((dep) => dep.name);
          }
        } catch (e) {
          try {
            packageJson = require(join(src, "/package.json")) as PackageJson;
            if (packageJson) {
              packager = "npm";
              name = packageJson.name!;
            }
          } catch (e) {}
        }

        // packager: "composer"
        try {
          composerJson = require(join(dist, "/composer.json")) as ComposerJson;
          if (composerJson) {
            packager = "composer";
            name = composerJson.name!;
            internalDeps = getComposerDependenciesNameAndVersion(
              composerJson,
              "olmo", // FIXME: scope here is `olmokit` instead of `olmo`
            ).map((dep) => dep.name);
          }
        } catch (e) {}

        return {
          ...(config || {}),
          slug,
          name,
          scope,
          version,
          packager,
          src,
          dist,
          internalDeps,
          packageJson,
          composerJson,
          linkPath,
        };
      })
      // filter as we might have empty temporary folders picked up by the packages/* glob
      .filter((lib) => lib.name)
  );
}

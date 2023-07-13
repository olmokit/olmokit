import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import json from "comment-json";
import { globSync } from "glob";
import type { PackageJson } from "type-fest";

type ComposerJson = {
  name: string;
  support: {
    /**
     * The repository absolute URL where lives the built artifact.
     * Used by composer packagist publishing/versioning system.
     */
    source: string;
  };
  require: Record<string, string>;
};

type LibShared = {
  src: string;
  dist: string;
  slug: string;
  name: string;
  version: string;
  deps: Record<string, string>;
  internalDeps: string[];
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

export const self = () => {
  const root = join(__dirname, "../");
  const packageJsonPath = join(root, "package.json");
  const packageJson = require(packageJsonPath) as PackageJson;
  const scope = packageJson.name.split("/")[0];
  const libs = getLibs(packageJson, scope);

  return {
    root,
    packageJsonPath,
    scope,
    packageJson,
    libs,
    libsNpm: libs.filter((lib) => lib.packager === "npm") as LibNpm[],
    libsComposer: libs.filter(
      (lib) => lib.packager === "composer"
    ) as LibComposer[],
    libsMap: libs.reduce((map, lib) => {
      map[lib.name] = lib;
      return map;
    }, {} as Record<Lib["name"], Lib>),
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
        const dist = join(__dirname, "../dist/packages/", slug);
        let packager: Lib["packager"];
        let packageJson = {} as PackageJson;
        let composerJson = {} as ComposerJson;
        let deps = {};
        let internalDeps: string[] = [];
        let name = "";

        // packager: "npm"
        try {
          packageJson = require(join(dist, "/package.json")) as PackageJson;
          if (packageJson) {
            packager = "npm";
            name = packageJson.name!;
            const {
              dependencies = {},
              devDependencies = {},
              peerDependencies = {},
            } = packageJson;
            deps = { ...dependencies, ...devDependencies, ...peerDependencies };
            internalDeps = Object.keys(deps).filter((depName) =>
              depName.startsWith(scope)
            );
          }
          // console.log(name, "internalDeps", internalDeps);
        } catch (e) {}

        // packager: "composer"
        try {
          composerJson = require(join(dist, "/composer.json")) as ComposerJson;
          if (composerJson) {
            packager = "composer";
            name = composerJson.name!;
            const { require: composerRequire = {} } = composerJson;
            deps = { ...composerRequire };
            internalDeps = Object.keys(require).filter((depName) =>
              depName.startsWith(scope)
            );
          }
        } catch (e) {}

        return {
          packager,
          src,
          dist,
          slug,
          name,
          version,
          deps,
          internalDeps,
          packageJson,
          composerJson,
        };
      })
      // filter as we might have empty temporary folders picked up by the packages/* glob
      .filter((lib) => lib.name)
  );
}

/**
 * Edit JSON file (mutable)
 *
 * @param root One or multiple root for the json file to edit
 * @param fileName The json file name
 * @param mutator A function that **mutates** the data
 */
export async function editJSONfile<TData = any>(
  root: string | string[],
  fileName: string,
  mutator: (data: TData) => void
) {
  const roots = Array.isArray(root) ? root : [root];

  await Promise.all(
    roots.map(async (root) => {
      const filePath = join(root, fileName);

      try {
        const fileContent = await readFile(filePath, { encoding: "utf-8" });
        // const fileJSON = JSON.parse(fileContent);
        const jsonContent = json.parse(fileContent) as TData;
        mutator(jsonContent);
        // const fileNewContent = JSON.stringify(jsonContent, null, 2);
        const fileNewContent = json.stringify(jsonContent, null, 2);

        if (fileNewContent) {
          await writeFile(filePath, fileNewContent);
        }
      } catch (err) {
        console.log("editJSONfile failed for:", filePath);
        // throw e;
        return;
      }
    })
  );
}

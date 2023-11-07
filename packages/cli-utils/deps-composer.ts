import { get } from "node:https";
import { editJsonFile } from "./editJsonFile.js";

export type ComposerJson = {
  name: string;
  support: {
    /**
     * The repository absolute URL where lives the built artifact.
     * Used by composer packagist publishing/versioning system.
     */
    source: string;
  };
  require?: Record<string, string>;
};

/**
 * There is much more data, we just care about the version for now though...
 */
type PacakgistPackageData = {
  name: string;
  version: string;
};

/**
 * @see https://packagist.org/apidoc#get-package-data
 * @see https://repo.packagist.org/p2/monolog/monolog.json
 */
type PacakgistPackageResponse = {
  minified: string;
  packages: Record<string, PacakgistPackageData[]>;
};

/**
 * Get all the dependencies' name and version from the given `composer.json`
 * Optionally filter the dependencies by the given `orgScope` name.
 */
export function getComposerDependenciesNameAndVersion(
  data: ComposerJson,
  orgScope?: string
) {
  const allDeps = {
    ...(data.require ?? {}),
  };
  const list: { name: string; version: string }[] = [];

  for (const name in allDeps) {
    if (Object.prototype.hasOwnProperty.call(allDeps, name)) {
      const version = allDeps[name] as string;

      if (!orgScope || (orgScope && name.startsWith(orgScope + "/"))) {
        if (!list.find((item) => item.name === name)) {
          list.push({ name, version });
        }
      }
    }
  }

  return list;
}

/**
 * Get the dependencies' version data of the given `composer.json`.
 * Optionally filter the dependencies by the given `orgScope` name.
 */
export async function getComposerDependencies(
  data: ComposerJson,
  orgScope?: string
) {
  const deps = getComposerDependenciesNameAndVersion(data, orgScope);
  const packages = await Promise.all(
    deps.map(async ({ name, version }) => {
      const latestVersion = await getComposerPkgLatestVersionWithHttp(name);

      return {
        name,
        latestVersion,
        currentVersion: version,
      };
    })
  );

  return packages;
}

const depTypes = ["require"] as const;

/**
 * Update the dependencies in the `composer.json` to their **latest** version.
 * Optionally filter the dependencies by the given `orgScope` name.
 */
export async function updateComposerDependencies(
  dataDir: string,
  data: ComposerJson,
  orgScope?: string
) {
  const deps = await getComposerDependencies(data, orgScope);
  const actions: {
    /** Dependency name */
    name: string;
    /** Version _before_ update */
    from: string;
    /** Version _after_ update */
    to: string;
  }[] = [];

  editJsonFile(dataDir, "composer.json", (content: ComposerJson) => {
    deps.forEach((dep) => {
      depTypes.forEach((key) => {
        if (content?.[key]?.[dep.name]) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          content[key]![dep.name] = dep.latestVersion;

          actions.push({
            name: dep.name,
            from: dep.currentVersion,
            to: dep.latestVersion,
          });
        }
      });
    });
  });

  return actions;
}

function getComposerPkgLatestVersionWithHttp(pkgName: string) {
  return new Promise<string>((resolve, reject) => {
    get(`https://repo.packagist.org/p2/${pkgName}.json`, (res) => {
      if (res.statusCode === 200) {
        let body = "";
        res.on("data", (data) => (body += data));
        res.on("end", () => {
          try {
            const data = JSON.parse(body) as PacakgistPackageResponse;
            const versions = data.packages[pkgName];

            // the array of package versions is sorted by newest to oldest
            // so we just grab the first
            resolve(versions[0].version);
          } catch (e) {
            console.warn(
              "getComposerPkgLatestVersionWithHttp: failed parsing packagist response"
            );
            reject();
          }
        });
      } else {
        reject();
      }
    }).on("error", () => {
      reject();
    });
  });
}

export const getComposerPkgLatestVersion = getComposerPkgLatestVersionWithHttp;

import { execSync } from "node:child_process";
import { get } from "node:https";
import type { PackageJson as _PackageJson } from "type-fest";
import { editJsonFile } from "./editJsonFile.js";

export type PackageJson = _PackageJson;

/**
 * Get all the dependencies' name of the given `package.json`.
 * Optionally filter the dependencies by the given `orgScope` name.
 */
export function getNpmDependenciesNameAndVersion(
  data: PackageJson,
  orgScope?: string,
) {
  const allDeps = {
    ...(data.dependencies ?? {}),
    ...(data.devDependencies ?? {}),
    ...(data.peerDependencies ?? {}),
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
 * Get the dependencies' version data of the given `package.json`.
 * Optionally filter the dependencies by the given `orgScope` name.
 */
export async function getNpmDependencies(data: PackageJson, orgScope?: string) {
  const deps = getNpmDependenciesNameAndVersion(data, orgScope);
  const packages = await Promise.all(
    deps.map(async ({ name, version }) => {
      const latestVersion = await getNpmPkgLatestVersion(name);

      return {
        name,
        latestVersion,
        currentVersion: version,
      };
    }),
  );

  return packages;
}

const depTypes = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
] as const;

type DepType = (typeof depTypes)[number];

/**
 * Update the dependencies in the `package.json` to their **latest** version.
 * Optionally filter the dependencies by the given `orgScope` name.
 */
export async function updateNpmDependencies(
  dataDir: string,
  data: PackageJson,
  orgScope?: string,
) {
  const deps = await getNpmDependencies(data, orgScope);
  const actions: {
    /** Dependency name */
    name: string;
    /** Version _before_ update */
    from: string;
    /** Version _after_ update */
    to: string;
    /** Dependency type in `package.json` */
    depType: DepType;
  }[] = [];

  editJsonFile(dataDir, "package.json", (content: PackageJson) => {
    deps.forEach((dep) => {
      depTypes.forEach((key) => {
        if (content?.[key]?.[dep.name]) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          content[key]![dep.name] = dep.latestVersion;

          actions.push({
            name: dep.name,
            from: dep.currentVersion,
            to: dep.latestVersion,
            depType: key,
          });
        }
      });
    });
  });

  return actions;
}

function getNpmPkgLatestVersionWithNpm(pkgName: string) {
  const result = execSync(`npm view ${pkgName} --json`).toString();
  let data;

  try {
    data = JSON.parse(result);
  } catch (e) {
    throw new Error(`Unable to find latest version of ${pkgName}`);
  }

  return data["dist-tags"]["latest"];
}

function getNpmPkgLatestVersionWithHttp(pkgName: string) {
  return new Promise<string>((resolve, reject) => {
    get(`https://registry.npmjs.org/-/package/${pkgName}/dist-tags`, (res) => {
      if (res.statusCode === 200) {
        let body = "";
        res.on("data", (data) => (body += data));
        res.on("end", () => {
          resolve(JSON.parse(body).latest);
        });
      } else {
        reject();
      }
    }).on("error", () => {
      reject();
    });
  });
}

export const getNpmPkgLatestVersionSync = getNpmPkgLatestVersionWithNpm;

export async function getNpmPkgLatestVersion(pkgName: string) {
  return new Promise<string>((resolve) => {
    getNpmPkgLatestVersionWithHttp(pkgName)
      .then(resolve)
      .catch(() => {
        resolve(getNpmPkgLatestVersionWithNpm(pkgName));
      });
  });
}

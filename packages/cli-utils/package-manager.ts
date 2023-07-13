import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import gte from "semver/functions/gte";

export type PackageManager = "pnpm" | "npm" | "yarn";

export interface PackageManagerCommands {
  install: string;
  ciInstall: string;
  add: string;
  addDev: string;
  rm: string;
  exec: string;
  list: string;
  run: (script: string, args: string) => string;
}

/**
 * Detects which package manager is used based on the lock file
 *
 * @borrows [nx](https://github.com/nrwl/nx/blob/master/packages/nx/src/utils/package-manager.ts)
 *
 * We use different priority
 * 1) `pnpm`
 * 2) `npm`
 * 3) `yarn`
 *
 * fallback to `npm`
 */
export function detectPackageManager(dir = ""): PackageManager {
  return existsSync(join(dir, "pnpm-lock.yaml"))
    ? "pnpm"
    : existsSync(join(dir, "package-lock.json"))
    ? "npm"
    : existsSync(join(dir, "yarn.lock"))
    ? "yarn"
    : "npm";
}

/**
 * @borrows [nx](https://github.com/nrwl/nx/blob/master/packages/nx/src/utils/package-manager.ts)
 *
 * Returns commands for the package manager used in the workspace.
 * By default, the package manager is derived based on the lock file,
 * but it can also be passed in explicitly.
 *
 * Example:
 *
 * ```javascript
 * execSync(`${getPackageManagerCommand().addDev} my-dev-package`);
 * ```
 *
 * @param packageManager The package manager to use. If not provided, it will be detected based on the lock file.
 * @param root The directory the commands will be ran inside of. Defaults to the current working directory
 */
export function getPackageManagerCommand(
  packageManager: PackageManager = detectPackageManager(),
  root: string = process.cwd()
): PackageManagerCommands {
  const commands: { [pm in PackageManager]: () => PackageManagerCommands } = {
    yarn: () => {
      const yarnVersion = getPackageManagerVersion("yarn");
      const useBerry = gte(yarnVersion, "2.0.0");

      return {
        install: "yarn",
        ciInstall: useBerry
          ? "yarn install --immutable"
          : "yarn install --frozen-lockfile",
        add: useBerry ? "yarn add" : "yarn add -W",
        addDev: useBerry ? "yarn add -D" : "yarn add -D -W",
        rm: "yarn remove",
        exec: useBerry ? "yarn exec" : "yarn",
        run: (script: string, args: string) => `yarn ${script} ${args}`,
        list: useBerry ? "yarn info --name-only" : "yarn list",
      };
    },
    pnpm: () => {
      const isPnpmWorkspace = existsSync(join(root, "pnpm-workspace.yaml"));

      return {
        install: "pnpm install --no-frozen-lockfile", // explicitly disable in case of CI
        ciInstall: "pnpm install --frozen-lockfile",
        add: isPnpmWorkspace ? "pnpm add -w" : "pnpm add",
        addDev: isPnpmWorkspace ? "pnpm add -Dw" : "pnpm add -D",
        rm: "pnpm rm",
        exec: "pnpm exec",
        run: (script: string, args: string) => `pnpm run ${script} ${args}`,
        list: "pnpm ls --depth 100",
      };
    },
    npm: () => {
      return {
        install: "npm install",
        ciInstall: "npm ci",
        add: "npm install",
        addDev: "npm install -D",
        rm: "npm rm",
        exec: "npx",
        run: (script: string, args: string) => `npm run ${script} -- ${args}`,
        list: "npm ls",
      };
    },
  };

  return commands[packageManager]();
}

/**
 * @borrows [nx](https://github.com/nrwl/nx/blob/master/packages/nx/src/utils/package-manager.ts)
 *
 * Returns the version of the package manager used in the workspace.
 * By default, the package manager is derived based on the lock file,
 * but it can also be passed in explicitly.
 */
export function getPackageManagerVersion(
  packageManager: PackageManager = detectPackageManager()
): string {
  return execSync(`${packageManager} --version`).toString("utf-8").trim();
}

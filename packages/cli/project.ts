/**
 * @file With `project` we mean the application that is currently using this `CLI`
 */
import { createRequire } from "node:module";
import { join } from "node:path";
import { sentenceCase } from "change-case";
import type { PackageJson } from "type-fest";

/**
 * Get the information relative to the current project using the Olmo CLI
 */
export function getConfigProject() {
  const require = createRequire(import.meta.url);
  const cwd = process.cwd();
  const root = cwd;
  const nodeModules = join(root, "node_modules");
  const packageJsonPath = join(cwd, "package.json");
  const envPath = join(root, ".env");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const packageJson = require(packageJsonPath) as PackageJson & {
    config: {
      /**
       * Project's start year
       *
       * NOTE: This property is enforced via the `pkg` task
       *
       * @default currentYear
       */
      startYear: number;
    };
  };

  const title = getProjectTitle(packageJson.name);
  const slug = getProjectSlug(packageJson.name);
  const repo = getProjectRepoInfo(packageJson.repository);

  /**
   * Meta information about the project using the CLI
   */
  return {
    /** The **project**'s root folder (a.k.a. the `process.cwd()`) */
    root,
    /** The **project**'s `node_modules` path (used by `npm/pnpm/yarn` packages) */
    nodeModules,
    /** The **project**'s `.env` path */
    envPath,
    /**
     * The project's parsed `package.json`
     */
    packageJson,
    /**
     * The project **title** derived from `package.json#name`
     */
    title,
    /**
     * The project **slug** derived from `package.json#name`
     */
    slug,
    /**
     * The project **repo** information normalised from `package.json#repository`
     */
    repo,
  };
}

export const project = getConfigProject();

/**
 * Get clean project name from the given string falling back to the entry `"name"`
 * in the `package.json` stripping out organization name, if any
 */
function getProjectName(input?: string) {
  input = input || "";
  return input.replace(/^@.+\//, "");
}

/**
 * Get project slug normalizing the @org syntax and slashes
 */
function getProjectSlug(input?: string) {
  input = input || "";
  return input.replace(/@/g, "").replace(/\//g, "-");
}

/**
 * Transform a kebab case project name, as defined in the `package.json` entry
 * `"name"` (e.g. `@olmokit/my-project`) to a nice title: `My Project`
 */
function getProjectTitle(input?: string) {
  const name = getProjectName(input);
  return sentenceCase(name);
}

/**
 * Get project repository info by reading the package.json data
 *
 * Given a repository URL as such:
 * `https://git.mycompany.net/repoproject/reponame.git`
 *
 * the `ssh` will be:
 * `git@git.mycompany.net:repoproject/reponame.git`
 * the `name` will be:
 * `reponame``
 */
function getProjectRepoInfo(repository: PackageJson["repository"]) {
  const url =
    typeof repository === "object" ? repository["url"] || "" : repository || "";
  let ssh = "";
  let name = "";

  // if (repository.url) {
  // }

  if (url) {
    ssh = url.replace("https://", "git@");
    const sshParts = ssh.split("/");
    ssh = `${sshParts[0]}:${sshParts.slice(1).join("/")}`;
    name = sshParts.pop()?.replace(".git", "") ?? "";
  }

  return {
    url,
    ssh,
    name,
  };
}

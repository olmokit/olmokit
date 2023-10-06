import { spawnSync } from "node:child_process";
import chalk from "chalk";
import { Command } from "commander";
import { $ } from "execa";
import { publish as ghpagesPublish } from "gh-pages";
import inquirer from "inquirer";
import ora, { oraPromise } from "ora";
import { join } from "path";
import { exit } from "process";
import semver from "semver";
import {
  PackageJson,
  editJsonFile,
  getNpmDependenciesNameAndVersion,
  isGitDirty,
} from "../packages/cli-utils/src/index.js";
import { type Options, getOptionLib, oraOpts } from "./dev.js";
import { type Lib, self } from "./helpers.js";

export const publish = () =>
  new Command("publish")
    .description("Publish packages")
    .action(async (opts: Options) => {
      if (isGitDirty()) {
        ora().fail("You have uncommited work. Cannot proceed.");
        exit(1);
      }

      const versionPolicy = "single" as "single" | "independent";
      const isSingleVersionPolicy = versionPolicy === "single";

      if (isSingleVersionPolicy) {
        ora().info(
          `${chalk.italic("Single version policy")} ${chalk.dim(
            "all packages will be published with the same version",
          )}`,
        );
      }

      const choosen = await getOptionLib(opts, true, true);
      const allLibs = self().libs;
      const selectedLibs = choosen
        ? allLibs.filter((l) => l.slug === choosen)
        : allLibs;

      // ask for release
      const { release } = await promptRelease(
        "Olmo packages",
        self().packageJson.version,
      );

      // bump libs src
      await Promise.all(
        (isSingleVersionPolicy ? allLibs : selectedLibs).map(async (lib) =>
          oraPromise(bumbLib(lib, release), {
            ...oraOpts,
            text: "Bump package version",
            suffixText: chalk.dim(`${lib.name}`),
          }),
        ),
      );

      // build libs
      ora().info(`Build all libs with updated version`);
      await $({ stdio: "inherit" })`nx run-many --all --targets=build`;

      // prepublish libs
      await Promise.all(
        (isSingleVersionPolicy ? allLibs : selectedLibs).map(async (lib) =>
          oraPromise(prepublishLib(lib, release), {
            ...oraOpts,
            text: `Pre-publish ${chalk.bold(lib.packager)} package`,
            suffixText: chalk.dim(`${lib.name}`),
          }),
        ),
      );

      // commit files
      // if (isGitDirty()) {
      if (release.type !== "asIs") {
        await oraPromise(
          $({
            stdio: "inherit",
          })`git commit -am ${`chore(release): v${release.version}`}`,
          {
            text: `Commit files edited during release`,
          },
        );
      }

      // publish libs
      await Promise.all(
        selectedLibs.map(async (lib) => {
          const spinner = ora({
            text: `Publish ${chalk.bold(lib.packager)} package`,
            suffixText: chalk.dim(`${lib.name}`),
          }).start();
          const res = await publishLib(lib, release);

          if (res) {
            spinner.succeed();
          } else {
            spinner.fail();
          }
        }),
      );

      // postpublish (at the level of this repo (not each libs))
      await oraPromise(postpublish(release), {
        text: `Create and push release tag to this repo`,
      });
    });

type Release = {
  type: semver.ReleaseType | "asIs";
  version: string;
};

/**
 * We bump the version only in **src** relying on a subsequent `nx build` to
 * retain the correct version in the generated **dist**. Following
 * a single version policy this does not seem necessary but actually `nx` gives
 * problems recognizing the internal dependency graph if a package does not
 * specify its version in its package.json and it also does not produce the right
 * `dependencies` versions in the built `package.json`. Furthermore this approach
 * gives us the flexibility to more easily move away from the single version
 * policy toward an "independent" policy if needed.
 */
async function bumbLib(lib: Lib, release: Release) {
  await editJsonFile(self().root, "package.json", (data) => {
    data.version = release.version;
  });
  if (lib.packager === "npm") {
    await editJsonFile(lib.src, "package.json", (data) => {
      data.version = release.version;
    });
  } else if (lib.packager === "composer") {
    await editJsonFile(lib.src, "composer.json", (data) => {
      data.version = release.version;
    });
  }

  // NOTE: exception, this bump is a bit hacky, but hard to do better...
  if (lib.name === "laravel-frontend") {
    await editJsonFile(
      join(self().tools, "../packages/template-laravel/template"),
      "composer.json",
      (data) => {
        data.require = data.require || {};
        data.require["olmo/laravel-frontend"] = `^${release.version}`;
      },
    );
  }
}

/**
 * Here we update the `asterisk` used by @nx/eslint in internal monorepo
 * dependencies to the actual version we are going to release.
 * TODO: check why nx does not do this automatically.
 * @resources
 * - https://github.com/pnpm/pnpm/issues/6463
 *
 * We specify the version in the `composer.json` in the **src** of the package
 * but we remove it from the **dist** file following what is suggested in the
 * [composer docs](https://getcomposer.org/doc/04-schema.md#version).
 */
async function prepublishLib(lib: Lib, release: Release) {
  if (lib.packager === "npm") {
    await editJsonFile<PackageJson>(lib.dist, "package.json", (data) => {
      getNpmDependenciesNameAndVersion(data, lib.scope).forEach(({ name }) => {
        ["dependencies", "devDependencies", "peerDependencies"].forEach(
          (key) => {
            if (data?.[key]?.[name]) {
              data[key][name] = release.version;
            }
          },
        );
      });
    });
  } else if (lib.packager === "composer") {
    await editJsonFile([lib.src, lib.dist], "composer.json", (data) => {
      delete data.version;
    });
  }
}

async function publishLib(lib: Lib, release: Release) {
  if (lib.packager === "npm") {
    const { exitCode } = await $({
      cwd: lib.dist,
      reject: false,
      // stdio: "inherit",
    })`npm publish --access public`;
    return exitCode === 0;
  } else if (lib.packager === "composer") {
    return new Promise<boolean>((resolve, reject) => {
      ghpagesPublish(
        lib.dist,
        {
          branch: "main",
          // remote: "origin-ssh",
          dotfiles: true,
          repo: lib.composerJson.support.source,
          tag: release.version,
          push: true,
          message: `chore(release): v${release.version}`,
        },
        (err) => {
          resolve(!err);
        },
      );
    });
  }
}

/**
 * @see https://git-scm.com/book/en/v2/Git-Basics-Tagging
 */
async function postpublish(release: Release) {
  const tagName = `v${release.version}`;
  const branchName = await $`git rev-parse --abbrev-ref HEAD`;
  const { exitCode } = await $({ reject: false })`git tag -a ${tagName} -m ${
    "Release " + release.version
  }"`;

  if (exitCode === 0) {
    // await $({ reject: false })`git push origin ${tagName}`;
    await $({ reject: false })`git push origin ${branchName.stdout} --tags`;
  }

  // TODO: it seems we need to re-link after each build... check why
  spawnSync("pnpm", ["dev", "link"], { stdio: "inherit" });
}

async function promptRelease(subject, currentVersion: string) {
  return await inquirer.prompt<{
    release: Release;
  }>([
    {
      name: "release",
      message: "Choose new version",
      suffix: ` ${chalk.dim(subject)}`,
      choices: createReleaseTypeChoices(currentVersion),
      type: "list",
      validate: (options) => {
        if (!options.length) {
          return "Choose one of the above, use space to choose the option";
        }

        return true;
      },
    },
  ]);
}

function createReleaseTypeChoice(
  releaseType: semver.ReleaseType,
  currentVersion: string,
) {
  const newVersion = semver.inc(currentVersion, releaseType, "alpha", "1");

  return {
    name: `${releaseType} ${chalk.dim(
      chalk.bold(currentVersion) + " -> " + chalk.bold(newVersion),
    )}`,
    value: { type: releaseType, version: newVersion },
  };
}

function createReleaseTypeChoices(currentVersion: string) {
  return [
    createReleaseTypeChoice("patch", currentVersion),
    createReleaseTypeChoice("minor", currentVersion),
    createReleaseTypeChoice("major", currentVersion),
    createReleaseTypeChoice("prepatch", currentVersion),
    createReleaseTypeChoice("preminor", currentVersion),
    createReleaseTypeChoice("premajor", currentVersion),
    {
      name: `as is ${chalk.bold(currentVersion)}`,
      value: { type: "asIs", version: currentVersion },
    },
  ];
}
